'use strict';

const chai = require('chai');
const expect = chai.expect;
const Condition = require('../lib/condition');

describe('Condition', function() {

  /* stringify */

  describe('stringify(array)', function() {
    it('should return a valid string', function() {
      expect(Condition.stringify(['A', 'B', 'C'])).eql('A(B C)');
      expect(Condition.stringify(['A-', 'B', 'C'])).eql('A-(B C)');
      expect(Condition.stringify(['_', '_', 'C'])).eql('_(_ C)');
    });

    it('should return `null` on invalid condition', function() {
      expect(Condition.stringify()).eql(null);
      expect(Condition.stringify([])).eql(null);
      expect(Condition.stringify([null])).eql(null);
      expect(Condition.stringify([1])).eql(null);
      expect(Condition.stringify([{}])).eql(null);
      expect(Condition.stringify(['!', 'B', 'C'])).eql(null);
      expect(Condition.stringify(['A', ' ', 'C'])).eql(null);
      expect(Condition.stringify(['!', 'B'])).eql(null);
    });
  });

  /* parse */

  describe('parse(string)', function() {
    it('should return parsed condition array', function() {
      expect(Condition.parse('A(B C)')).eql(['A', 'B', 'C']);
    });

    it('should return `null` on invalid condition', function() {
      expect(Condition.parse()).eql(null);
      expect(Condition.parse(null)).eql(null);
      expect(Condition.parse('')).eql(null);
      expect(Condition.parse(' A(B C)')).eql(null);
      expect(Condition.parse('fake A(B C)')).eql(null);
      expect(Condition.parse('A@(B C)')).eql(null);
      expect(Condition.parse('A(B! C)')).eql(null);
    });
  });

  /* isValid */

  describe('isValid(string)', function() {
    it('should return `true` on valid string', function() {
      expect(Condition.isValid('A()')).eql(true);
      expect(Condition.isValid('A(B C)')).eql(true);
    });

    it('should return `false` on invalid string', function() {
      expect(Condition.isValid(' A(B C)')).eql(false);
      expect(Condition.isValid('A(B! C)')).eql(false);
    });
  });

  describe('isValid(array)', function() {
    it('should return `true` on valid condition array', function() {
      expect(Condition.isValid(['A'])).eql(true);
      expect(Condition.isValid(['A', 'B'])).eql(true);
      expect(Condition.isValid(['A', 'B-', '_'])).eql(true);
    });

    it('should return `false` on invalid condition array', function() {
      expect(Condition.isValid([])).eql(false);
      expect(Condition.isValid(null)).eql(false);
      expect(Condition.isValid(['@'])).eql(false);
    });
  });

});
