'use strict';

const chai = require('chai');
const expect = chai.expect;
const DSL = require('../lib/dsl');

describe('DSL', () => {

  /* normalize */

  describe('normalize(string)', () => {
    it('should remove new-line charactes, first and last space and duplicated spaces from string', () => {
      expect(DSL.normalize(' \n   a \t   a  ')).eq('a a');
    });
  });

  /* parse */

  describe('parse(string)', () => {
    it('should return an array of parsed condition arrays', () => {
      expect(DSL.parse('A(B C) AND D(E) OR F(G H)')).eql([
        [['A', 'B', 'C'], ['D', 'E']],
        [['F', 'G', 'H']]
      ]);
      expect(DSL.parse('A(A_B A-C) OR D(E_) AND F(-G_H)')).eql([
        [['A', 'A_B', 'A-C']],
        [['D', 'E_'], ['F', '-G_H']]
      ]);
    });

    it('should return `null` on invalid DSL string', () => {
      expect(DSL.parse()).eql(null);
      expect(DSL.parse(null)).eql(null);
      expect(DSL.parse('A')).eql(null);
      expect(DSL.parse('aaa A(B C) AND D(E) OR F(G H)')).eql(null);
      expect(DSL.parse('(A(B! C) AND D(E)) OR F(G H)')).eql(null);
      expect(DSL.parse('A(B C) AND D(E) OR F(G H) ')).eql(null);
      expect(DSL.parse(' A(B C) ')).eql(null);
    });
  });

  /* stringify */

  describe('stringify(array)', () => {
    it('should return a valid DSL string', () => {
      expect(DSL.stringify([
        [['A', 'B', 'C'], ['D', 'E']],
        [['F', 'G', 'H']]
      ])).eql('A(B C) AND D(E) OR F(G H)');
      expect(DSL.stringify([
        [['A', 'A_B', 'A-C']],
        [['D', 'E_'], ['F', '-G_H']]
      ])).eql('A(A_B A-C) OR D(E_) AND F(-G_H)');
    });

    it('should return `null` on invalid condition array', () => {
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
        [['(', 'B']]
      ])).eql(null);
      expect(DSL.stringify([
        [[1, 'B']]
      ])).eql(null);
    });
  });

  /* isValid */

  describe('isValid(string)', () => {
    it('should return `true` on valid string', () => {
      expect(DSL.isValid('D()')).eql(true);
      expect(DSL.isValid('A(B C) AND D() OR E(F)')).eql(true);
    });

    it('should return `false` on invalid string', () => {
      expect(DSL.isValid(' A()')).eql(false);
      expect(DSL.isValid('A() ')).eql(false);
      expect(DSL.isValid('A(B C) OR')).eql(false);
      expect(DSL.isValid('AND A(B C)')).eql(false);
    });
  });

  describe('isValid(array)', () => {
    it('should return `true` on valid condition array', () => {
      expect(DSL.isValid([
        [['A', 'B', 'C'], ['D', 'E']],
        [['F', 'G', 'H']]
      ])).eql(true);
      expect(DSL.isValid([
        [['A', 'A_B', 'A-C']],
        [['D', 'E_'], ['F', '-G_H']]
      ])).eql(true);
    });

    it('should return `false` on invalid condition array', () => {
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
        [['(', 'B']]
      ])).eql(false);
      expect(DSL.isValid([
        [[1, 'B']]
      ])).eql(false);
    });
  });

  /* mappsTo */

  describe('mappsTo(string, object)', () => {
    it('should return `true` on valid mapping', () => {
      expect(DSL.mappsTo('A(any) AND B()', {A: true, B: true})).eql(true);
      expect(DSL.mappsTo('A(1 any)', {A: a => Number.isInteger(parseInt(a))})).eql(true);
    });

    it('should return `false` on invalid mapping', () => {
      expect(DSL.mappsTo('A(any) OR B()', {A: false})).eql(false);
      expect(DSL.mappsTo('A(foo)', {A: a => Number.isInteger(parseInt(a))})).eql(false);
      expect(DSL.mappsTo('A(foo)', {B: true})).eql(false);
    });
  });

});
