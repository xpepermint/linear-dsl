'use strict';

/*
* Dependencies.
*/

const Condition = require('./condition');

/*
* Parses a DSL string into 3-dimensional array. DSL string is first splited
* on `OR` operation (first dimension), then each part is further splited on
* `AND` operation (second dimension), finally each pair is parsed with
* Condition.parse parser (third dimension).
*
* Example:
* ```
* DSL.parse('a(b c) AND d(e) OR f(g h i)');
* > [
* >   [
* >     ['a', 'b', 'c'],
* >     ['d', 'e']
* >   ],
* >   [
* >     ['f', 'g', 'h', 'i']
* >   ],
* > ]
* ```
*/

function parse(str) {
  if (!str) return null;

  let groups = str.split(/ OR /i);
  groups = groups.map(str => {
    return str.split(/ AND /i).map(condition => Condition.parse(condition));
  });
  if (stringify(groups) !== str) return null;
  return groups;
}

/*
* Merges 3-dimensional array into DSL string.
*
* Example:
* ```
* DSL.parse([
*   [
*     ['a', 'b', 'c'],
*     ['d', 'e']
*   ],
*   [
*     ['f', 'g', 'h', 'i']
*   ],
* ]);
* > 'a(b c) AND d(e) OR f(g h i)'
* ```
*/

function stringify(arr) {
  if (!Array.isArray(arr)) return null;
  if (arr.length === 0) return null;

  arr = arr.map(ands => {
    if (!Array.isArray(ands)) return null;
    if (ands.length === 0) return null;
    ands = ands.map(and => Condition.stringify(and));
    if (ands.filter(s => !!s).length !== ands.length) return null;
    return ands.join(' AND ');
  });
  if (arr.filter(s => !!s).length !== arr.length) return null;
  return arr.join(' OR ');
}

/*
* Returns `true` if the argument is a valid DSL string or a valid 3-dimensional
* array with conditions, otherwise `false` is returned.
*
* Example:
* ```
* DSL.parse('a(b c) AND d(e)');
* > true
* ```
*/

function isValid(any) {
  if (!any) return false;

  if (typeof any === 'string') return stringify(parse(any)) === any;
  else if (Array.isArray(any)) return JSON.stringify(parse(stringify(any))) === JSON.stringify(any);
  return false;
}

/*
* Public interface.
*/

module.exports = {parse, stringify, isValid};
