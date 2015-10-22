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
* Condition.parse('a(b c)');
* > true
* Condition.parse(['a', 'b', 'c']);
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
* Validates that `any` input matches the `mapping`. It validates the method name
* and attributes.
*
* Example:
* ```
* // method `a` is a valid method name
* Condition.mappsTo('a(b c)', {a: true});
* > true
* // method `a` expects intiger for the first argument
* Condition.mappsTo('a(1)', {a: args => Number.isInteger(parseInt(args[0]))});
* > true
* ```
*/

function mappsTo(any, mapping) {
  if (!isValid(any)) return false;
  if (!mapping) return true;

  let [kind, ...args] = typeof any === 'string' ? parse(any) : any;
  if (!mapping[kind]) return false;
  if (mapping[kind] === true) return true;
  if (typeof mapping[kind] !== 'function') return false;
  if (!mapping[kind].apply(null, args)) return false;
  return true;
}

/*
* Public interface.
*/

module.exports = {parse, stringify, isValid, mappsTo};
