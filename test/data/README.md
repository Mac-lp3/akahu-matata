# Naming conventions for test data

## Account test data

These files contain one or more objects with the following properties: 
  * `accounts`: an array of account objects. These objects contain a mix of data from the akahu `GET accounts/` API and user configuration.
  * `expected`: an object describing the transfers that should be generated given the state of the provided `accounts`.

Each account in the list can either be `UNDER` (under the specified minimum), `BETWEEN` (between the specified minimum and maximum), `EXCESS` (over the specified maximum), or `RESERVE` (over the specified minimum and have no maximum).

For each account in the array, the array name should have a `u` for under, `b` for between, `e` for excess, or `r` for reserve.

In addition, since each account should have a tier (and multiple accounts can be in the same tier), each tier should be separated by an underscore. For example:

```javascript
// 1 EXCESS account in tier 1, 1 BETWEEN account in tier 2, and 1 RESERVE account in tier 3
const e_b_r = [...];

// 1 UNDER account in tier 1, and 2 BETWEEN accounts in tier 2
const u_bb = [...];

```

**resolvable.ts**


**unresolvable.ts**
