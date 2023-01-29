import { RDEEntityState, RDEList, RDEValue } from '@seed/rde';

/**
 * Add a RDEValue<T> to existed RDEList<T>
 * used in createProject, etc
 * @param item RDE entity to be added
 * @param list RDE list
 */
export function addItemToList<T extends RDEEntityState>(item: RDEValue<T>, list: RDEList<T>) {
  list.values.unshift(item);
  list.resultTotal++;
  list.pageCount = Math.ceil(list.resultTotal / list.pageSize);
}

/**
 * Delete RDEValue<T> at index in the RDEList<T>
 * used in deleteProject, etc
 * @param id RDE entity id to be deleted
 * @param list RDE list
 */
export function removeItemFromList<T extends RDEEntityState>(id: string, list: RDEList<T>) {
  const index = list.values.findIndex((v) => v.id === id);

  if (index > -1) {
    list.values.splice(index, 1);
    list.resultTotal--;
    list.pageCount = Math.ceil(list.resultTotal / list.pageSize);
  }
}

/**
 * Returns the RESOLVED and success entities in the RDEList<T>.
 */
export function filterResolvedAndSuccessEntity<T extends RDEEntityState>(list: RDEList<T>) {
  return list.values.filter((v) => v.entity.state === 'success' && v.state === 'RESOLVED');
}

/**
 * Returns the RDEList<T> whose values are filtered by orgId.
 */
export function filterRDEListByOrgId<T extends RDEEntityState>(list: RDEList<T>, orgId: string | undefined) {
  if (orgId) {
    return { ...list, values: list.values.filter((v) => v.org.id === orgId) };
  } else {
    return list;
  }
}
