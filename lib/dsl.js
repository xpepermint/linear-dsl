'use strict';

/*
* Dependencies.
*/

const Condition = require('./condition');

/*
* Removes new line characters, first and last white space and replaces
* duplicated white spaces with a single space.
*/

function normalize(str) {
  return str.replace(/\s\s+/g,' ').trim();
}

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
* Validates that `any` input matches the `mapping`. It validates methods names
* and their attributes.
*
* Example:
* ```
* // method `a` is a valid method name
* DSL.mappsTo('a(b c) AND b()', {a: true, b: true});
* > true
* // method `a` expects intiger for the first argument
* DSL.mappsTo('a(1)', {a: args => Number.isInteger(parseInt(args[0]))});
* > true
* ```
*/

function mappsTo(any, mapping) {
  if (!isValid(any)) return false;
  if (!mapping) return true;

  let arr = typeof(any) === 'string' ? parse(any) : any;
  try {
    for (let or of arr) {
      for (let and of or) {
        if (!Condition.mappsTo(and, mapping)) throw new Error();
      }
    }
    return true;
  } catch(e) {}
  return false;
}

/*
* Public interface.
*/

module.exports = {normalize, parse, stringify, isValid, mappsTo};
