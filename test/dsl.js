'use strict';

const chai = require('chai');
const expect = chai.expect;
const DSL = require('../lib/dsl');

describe('DSL', function() {

  /* parse */

  describe('parse(string)', function() {
    it('should return an array of parsed condition arrays', function() {
      expect(DSL.parse('A(B C) AND D(E) OR F(G H)')).eql([
        [['A', 'B', 'C'], ['D', 'E']],
        [['F', 'G', 'H']]
      ]);
      expect(DSL.parse('A(A_B A-C) OR D(E_) AND F(-G_H)')).eql([
        [['A', 'A_B', 'A-C']],
        [['D', 'E_'], ['F', '-G_H']]
      ]);
    });

    it('should return `null` on invalid DSL string', function() {
      expect(DSL.parse()).eql(null);
      expect(DSL.parse(null)).eql(null);
      expect(DSL.parse('A')).eql(null);
      expect(DSL.parse('aaa A(B C) AND D(E) OR F(G H)')).eql(null);
      expect(DSL.parse('A(B! C) AND D(E) OR F(G H)')).eql(null);
      expect(DSL.parse('A(B C) AND D(E) OR F(G H) ')).eql(null);
      expect(DSL.parse(' A(B C) AND D(E) OR F(G H) ')).eql(null);
    });
  });

  /* stringify */

  describe('stringify(array)', function() {
    it('should return a valid DSL string', function() {
      expect(DSL.stringify([
        [['A', 'B', 'C'], ['D', 'E']],
        [['F', 'G', 'H']]
      ])).eql('A(B C) AND D(E) OR F(G H)');
      expect(DSL.stringify([
        [['A', 'A_B', 'A-C']],
        [['D', 'E_'], ['F', '-G_H']]
      ])).eql('A(A_B A-C) OR D(E_) AND F(-G_H)');
    });

    it('should return `null` on invalid condition array', function() {
      expect(DSL.stringify()).eql(null);
      expect(DSL.stringify([])).eql(null);
      expect(DSL.stringify(['a'])).eql(null);
      expect(DSL.stringify([null])).eql(null);
      expect(DSL.stringify([{}])).eql(null);
      expect(DSL.stringify([
        []
      ])).eql(null);
      expect(DSL.stringify([
        ['A', 'B']
      ])).eql(null);
      expect(DSL.stringify([
        [[]]
      ])).eql(null);
      expect(DSL.stringify([
        [['']]
      ])).eql(null);
      expect(DSL.stringify([
        [['!', 'B']]
      ])).eql(null);
      expect(DSL.stringify([
        [[1, 'B']]
      ])).eql(null);
    });
  });

  /* isValid */

  describe('isValid(string)', function() {
    it('should return `true` on valid string', function() {
      expect(DSL.isValid('D()')).eql(true);
      expect(DSL.isValid('A(B C) AND D() OR E(F)')).eql(true);
    });

    it('should return `false` on invalid string', function() {
      expect(DSL.isValid(' A()')).eql(false);
      expect(DSL.isValid('A() ')).eql(false);
      expect(DSL.isValid('A(B! C)')).eql(false);
      expect(DSL.isValid('A(B C) OR')).eql(false);
      expect(DSL.isValid('AND A(B C)')).eql(false);
    });
  });

  describe('isValid(array)', function() {
    it('should return `true` on valid condition array', function() {
      expect(DSL.isValid([
        [['A', 'B', 'C'], ['D', 'E']],
        [['F', 'G', 'H']]
      ])).eql(true);
      expect(DSL.isValid([
        [['A', 'A_B', 'A-C']],
        [['D', 'E_'], ['F', '-G_H']]
      ])).eql(true);
    });

    it('should return `false` on invalid condition array', function() {
      expect(DSL.isValid()).eql(false);
      expect(DSL.isValid([])).eql(false);
      expect(DSL.isValid(['a'])).eql(false);
      expect(DSL.isValid([null])).eql(false);
      expect(DSL.isValid([{}])).eql(false);
      expect(DSL.isValid([
        []
      ])).eql(false);
      expect(DSL.isValid([
        ['A', 'B']
      ])).eql(false);
      expect(DSL.isValid([
        [[]]
      ])).eql(false);
      expect(DSL.isValid([
        [['']]
      ])).eql(false);
      expect(DSL.isValid([
        [['!', 'B']]
      ])).eql(false);
      expect(DSL.isValid([
        [[1, 'B']]
      ])).eql(false);
    });
  });

});
