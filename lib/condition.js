'use strict';

/*
* Regular expression for matching unicode alpha-numeric characters.
*/

const SYMBOL_REGEX = /[()\s]/ig;

/*
* Parses a single DSL condition into and 1-dimensional array where the first
* item represents the method name and the rest of items represents a sequence of
* method arguments.
*
* Example:
* ```
* Condition.parse('a(b c)');
* > ['a', 'b', 'c']
* ```
*/

function parse(str) {
  if (!str) return null;

  let arr = str.split(SYMBOL_REGEX);
  if (!arr) return null;
  arr = arr.filter(word => ['', undefined, null].indexOf(word)===-1);
  if (stringify(arr) !== str) return null;
  return arr;
}

/*
* Merges array items into DSL condition.
*
* Example:
* ```
* Condition.parse(['a', 'b', 'c']);
* > 'a(b c)'
* ```
*/

function stringify(arr) {
  if (!Array.isArray(arr)) return null;

  let [kind, ...args] = arr.slice(0).filter(s => (typeof s === 'string') && !SYMBOL_REGEX.test(s));
  if (!kind) return null;
  if (arr.length !== args.length+1) return null;
  return `${kind}(${args.join(' ')})`
}

/*
* Returns `true` if the argument is a valid DSL condition string or a valid
* 1-dimensional condition array, otherwise `false` is returned.
*
* Example:
* ```
* DSL.parse('a(b c)');
* > true
* DSL.parse(['a', 'b', 'c']);
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
