'use strict';

const chai = require('chai');
const expect = chai.expect;
const Condition = require('../lib/condition');

describe('Condition', () => {

  /* stringify */

  describe('stringify(array)', () => {
    it('should return a valid string', () => {
      expect(Condition.stringify(['A', 'B', 'C'])).eql('A(B C)');
      expect(Condition.stringify(['A-!', 'B', 'C'])).eql('A-!(B C)');
      expect(Condition.stringify(['_@', '_%', 'C<'])).eql('_@(_% C<)');
    });

    it('should return `null` on invalid condition', () => {
      expect(Condition.stringify()).eql(null);
      expect(Condition.stringify([])).eql(null);
      expect(Condition.stringify([null])).eql(null);
      expect(Condition.stringify([1])).eql(null);
      expect(Condition.stringify([{}])).eql(null);
      expect(Condition.stringify(['!(', 'B', 'C'])).eql(null);
      expect(Condition.stringify(['A', ' ', 'C'])).eql(null);
      expect(Condition.stringify([')', 'B'])).eql(null);
    });
  });

  /* parse */

  describe('parse(string)', () => {
    it('should return parsed condition array', () => {
      expect(Condition.parse('A()')).eql(['A']);
      expect(Condition.parse('A(B C)')).eql(['A', 'B', 'C']);
    });

    it('should return `null` on invalid condition', () => {
      expect(Condition.parse()).eql(null);
      expect(Condition.parse(null)).eql(null);
      expect(Condition.parse('')).eql(null);
      expect(Condition.parse(' A(B C)')).eql(null);
      expect(Condition.parse('fake A(B C)')).eql(null);
      expect(Condition.parse('A((B C))')).eql(null);
    });
  });

  /* isValid */

  describe('isValid(string)', () => {
    it('should return `true` on valid string', () => {
      expect(Condition.isValid('A()')).eql(true);
      expect(Condition.isValid('A(B C)')).eql(true);
    });

    it('should return `false` on invalid string', () => {
      expect(Condition.isValid(' A(B C)')).eql(false);
      expect(Condition.isValid('A(())')).eql(false);
    });
  });

  describe('isValid(array)', () => {
    it('should return `true` on valid condition array', () => {
      expect(Condition.isValid(['A'])).eql(true);
      expect(Condition.isValid(['A', 'B@'])).eql(true);
      expect(Condition.isValid(['A!', 'B-', '_'])).eql(true);
    });

    it('should return `false` on invalid condition array', () => {
      expect(Condition.isValid([])).eql(false);
      expect(Condition.isValid(null)).eql(false);
      expect(Condition.isValid(['()'])).eql(false);
    });
  });

  /* mappsTo */

  describe('mappsTo(string, object)', () => {
    it('should return `true` on valid mapping', () => {
      expect(Condition.mappsTo('A(any)', {A: true})).eql(true);
      expect(Condition.mappsTo('A(1)', {A: a => Number.isInteger(parseInt(a))})).eql(true);
    });

    it('should return `false` on invalid mapping', () => {
      expect(Condition.mappsTo('A(any)', {A: false})).eql(false);
      expect(Condition.mappsTo('A(foo)', {A: a => Number.isInteger(parseInt(a))})).eql(false);
    });
  });

});
