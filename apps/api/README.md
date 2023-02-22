# Express mock server

## How to restrict params in the route path?

To have more control over the exact string that can be matched by a route parameter, append a regular expression in
parentheses `()`:

```
Route path: /user/:userId(\d+)
Request URL: http://localhost:3000/user/42
req.params: {"userId": "42"}
```

<http://expressjs.com/en/guide/routing.html>

In Express 4.x, the `*` is considered as all the things rather than "zero or more".
(<https://github.com/expressjs/express/issues/2495>)

## How to use Hygen to generate files?

1. use hygen cmd: `yarn hygen`
2. generate route files `yarn hygen:route` // TODO:generate data files `yarn hygen:model`

## Filter (FIQL/RSQL format)

We imported `@rsql/ast"` and `@rsql/parser` to resolve FIQL filters.

Only 1 comparison:

```ts
import { parse } from '@rsql/parser';

const expression = parse('state==RESOLVED');
/*
{
  type: 'COMPARISON',
  left: { type: 'SELECTOR', selector: 'state' },
  operator: '==',
  right: { type: 'VALUE', value: 'RESOLVED' }
}
*/
```

2 comparisons:

```ts
const expression = parse('state==RESOLVED;entity.state==success');

/*
{
  type: 'LOGIC',
  left: {
    type: 'COMPARISON',
    left: { type: 'SELECTOR', selector: 'state' },
    operator: '==',
    right: { type: 'VALUE', value: 'RESOLVED' }
  },
  operator: ';',
  right: {
    type: 'COMPARISON',
    left: { type: 'SELECTOR', selector: 'entity.state' },
    operator: '==',
    right: { type: 'VALUE', value: 'success' }
  }
}
*/
```

> rsql lib will start AST from right to left. e.g. `state==RESOLVED;entity.state==success;enabled==true` will first take
> `enabled==true`, and then parse `state==RESOLVED;entity.state==success` as a whole.

```json
{
  "type": "LOGIC",
  "left": {
    "type": "LOGIC",
    "left": {
      "type": "COMPARISON",
      "left": { "type": "SELECTOR", "selector": "state" },
      "operator": "==",
      "right": { "type": "VALUE", "value": "RESOLVED" }
    },
    "operator": ";",
    "right": {
      "type": "COMPARISON",
      "left": { "type": "SELECTOR", "selector": "entity.state" },
      "operator": "==",
      "right": { "type": "VALUE", "value": "success" }
    }
  },
  "operator": ";",
  "right": {
    "type": "COMPARISON",
    "left": { "type": "SELECTOR", "selector": "enabled" },
    "operator": "==",
    "right": { "type": "VALUE", "value": "true" }
  }
}
```
