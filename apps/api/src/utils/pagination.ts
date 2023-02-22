import { ExpressionNode, getSelector, getValue, isComparisonNode } from '@rsql/ast';
import { parse } from '@rsql/parser';
import { RDEEntityState, RDEList, RDEValue } from '@seed/shared/models';
import { Request, Response } from 'express';
import { filter, get } from 'lodash';

/**
 * Get paged RDE list
 * @param pageQuery \{ rdeList, page: currentPage(start with 1), pageSize: default 25 }
 * @returns resultTotal: total data count;
 * pageCount: how many pages on the navigation;
 * page: current page (page starts with 1);
 * pageSize: display how many data per page, datagrid row count; if pageSize is 0, return all
 * values: RDE entities
 */
export function getPagedRdeList<T extends RDEEntityState>({
  rdeList,
  page = 1,
  pageSize = 25,
}: {
  rdeList: RDEList<T>;
  page?: number;
  pageSize?: number;
}): RDEList<T> {
  // rdeList total data count
  const resultTotal = rdeList.values.length;

  const pageCount = pageSize === 0 ? 1 : Math.ceil(resultTotal / pageSize);

  // correct page and pageSize
  page = Math.min(Math.max(page, 1), pageCount);
  pageSize = pageSize === 0 ? resultTotal : pageSize;

  return {
    resultTotal,
    pageCount,
    page,
    pageSize, // display how many data per page, datagrid row count
    values: pageSize === 0 ? rdeList.values : rdeList.values.slice((page - 1) * pageSize, page * pageSize),
    associations: null,
  };
}

/**
 * // TODO: enhance sort
 * express response paged rde list
 * @param req express request
 * @param res express response
 * @param originalRdeList original RDE list
 */
export const handlePagedRequest = <T extends RDEEntityState>(req: Request, res: Response, originalRdeList: RDEList<T>) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize ?? '25'); // pageSize 0 means get all data
  const filter = (req.query.filter || '') as string;

  if (filter === '') {
    return res.send(getPagedRdeList({ rdeList: originalRdeList, page, pageSize }));
  }

  const filterMap = getFilterMap(filter);

  const filteredValues = filterByTemplate(originalRdeList.values, filterMap) as RDEValue<T>[];

  const rdeList = { ...originalRdeList, values: filteredValues };

  return res.send(getPagedRdeList({ rdeList, page, pageSize }));

  // res.status(400).json({message: 'Failed to pass state==RESOLVED filter.'});
};

/**
 * passing FIQL filter string, parse it and return key value pairs. e.g. state==RESOLVED;entity.state==success
 * will return {'state':'RESOLVED', 'entity.state':'success'}
 * @param filter FIQL filter string
 * @returns object template that will be used to filter arrays
 */
const getFilterMap = (filter: string) => {
  const expression = parse(filter);

  // {'state':'RESOLVED', 'entity.state':'success'}
  const filterMap: Record<string, string | string[]> = {};

  function traverseNode(node: ExpressionNode) {
    if (isComparisonNode(node)) {
      filterMap[getSelector(node)] = getValue(node);
    } else {
      if (isComparisonNode(node.right)) {
        filterMap[getSelector(node.right)] = getValue(node.right);
      }

      if (isComparisonNode(node.left)) {
        filterMap[getSelector(node.left)] = getValue(node.left);
      } else {
        traverseNode(node.left);
      }
    }
  }

  traverseNode(expression);

  return filterMap;
};

/**
 * wildcard case-insensitive search filter array by template
 * the template key can be a path like entity.state cuz lodash get(el, path) is used to get the property value
 * e.g. const arr = filterByTemplate(sourceArr, {state: 'RESOLVED', 'entity.state': 'success', name: '*derek*', 'entity.repo_count': 10});
 * @param source source array
 * @param template object returned by getFilterMap function
 * @returns filtered array
 */
function filterByTemplate(source: Array<Record<string, any>>, template: Record<string, string | string[]>) {
  return filter(source, el =>
    // use == instead of === cuz object value could be number, but getFilterMap always return string
    Object.keys(template).every(propertyName => {
      // replace datagrid filter * with empty, e.g. *derek* --> derek
      const term = (template[propertyName] as string).replace(/\*/g, '');

      const entityValue = get(el, propertyName);

      // search property is not key of the data source's entity
      if (entityValue === undefined) {
        return false;
      }

      // string can be converted to number
      if (isNaN(parseInt(term)) === false) {
        return entityValue === parseInt(term);
      }

      if (typeof entityValue === 'string') {
        // source matches the value, ignore case
        if (propertyName === 'name') {
          return entityValue.match(new RegExp(term, 'i'));
        } else {
          // if property inside entity, only support exact match
          return entityValue.match(new RegExp(`^${term}$`, 'i'));
        }
      }

      // e.g. entityValue is a object/array
      return false;
    }),
  );
}
