/* eslint-env mocha */
import assert from 'assert';
import { getOpeningElement } from '../helper';
import getProp from '../../src/getProp';
import { getLiteralPropValue } from '../../src/getPropValue';

function extractProp(code, prop = 'foo') {
  const node = getOpeningElement(code);
  const { attributes: props } = node;
  return getProp(props, prop);
}

describe('getLiteralPropValue tests', () => {
  it('should export a function', () => {
    const expected = 'function';
    const actual = typeof getLiteralPropValue;

    assert.equal(expected, actual);
  });

  it('should return undefined when not provided with a JSXAttribute', () => {
    const expected = undefined;
    const actual = getLiteralPropValue(1);

    assert.equal(expected, actual);
  });

  describe('Null tests', () => {
    it('should return true when no value is given', () => {
      const prop = extractProp('<div foo />');

      const expected = true;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });
  });

  describe('Literal tests', () => {
    it('should return correct string if value is a string', () => {
      const prop = extractProp('<div foo="bar" />');

      const expected = 'bar';
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });

    it('should return correct string if value is a string expression', () => {
      const prop = extractProp('<div foo={"bar"} />');

      const expected = 'bar';
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });

    it('should return correct integer if value is a integer expression', () => {
      const prop = extractProp('<div foo={1} />');

      const expected = 1;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });

    it('should convert "true" to boolean type', () => {
      const prop = extractProp('<div foo="true" />');

      const expected = true;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });

    it('should convert "false" to boolean type', () => {
      const prop = extractProp('<div foo="false" />');

      const expected = false;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });

    it('should return String null when value is null', () => {
      const prop = extractProp('<div foo={null} />');

      const expected = 'null';
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });
  });

  describe('JSXElement tests', () => {
    it('should return null', () => {
      const prop = extractProp('<div foo=<bar /> />');

      const expected = null;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });
  });

  describe('Identifier tests', () => {
    it('should return null', () => {
      const prop = extractProp('<div foo={bar} />');

      const expected = null;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });

    it('should return undefined when identifier is literally `undefined`', () => {
      const prop = extractProp('<div foo={undefined} />');

      const expected = undefined;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });
  });

  describe('Template literal tests', () => {
    it('should return template literal with vars wrapped in curly braces', () => {
      const prop = extractProp('<div foo={`bar ${baz}`} />');

      const expected = 'bar {baz}';
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });

    it('should drop variables in template literals that are literally undefined', () => {
      const prop = extractProp('<div foo={`bar ${undefined}`} />');

      const expected = 'bar ';
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });
  });

  describe('Arrow function expression tests', () => {
    it('should return null', () => {
      const prop = extractProp('<div foo={ () => { return "bar"; }} />');

      const expected = null;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });
  });

  describe('Function expression tests', () => {
    it('should return null', () => {
      const prop = extractProp('<div foo={ function() { return "bar"; } } />');

      const expected = null;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });
  });

  describe('Logical expression tests', () => {
    it('should return null for && operator', () => {
      const prop = extractProp('<div foo={bar && baz} />');

      const expected = null;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });

    it('should return null for || operator', () => {
      const prop = extractProp('<div foo={bar || baz} />');

      const expected = null;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });
  });

  describe('Member expression tests', () => {
    it('should return null', () => {
      const prop = extractProp('<div foo={bar.baz} />');

      const expected = null;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });
  });

  describe('Call expression tests', () => {
    it('should return null', () => {
      const prop = extractProp('<div foo={bar()} />');

      const expected = null;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });
  });

  describe('Unary expression tests', () => {
    it('should correctly evaluate an expression that prefixes with -', () => {
      const prop = extractProp('<div foo={-bar} />');

      // -"bar" => NaN
      const expected = true;
      const actual = isNaN(getLiteralPropValue(prop));

      assert.equal(expected, actual);
    });

    it('should correctly evaluate an expression that prefixes with -', () => {
      const prop = extractProp('<div foo={-42} />');

      const expected = -42;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });

    it('should correctly evaluate an expression that prefixes with +', () => {
      const prop = extractProp('<div foo={+bar} />');

      // +"bar" => NaN
      const expected = true;
      const actual = isNaN(getLiteralPropValue(prop));

      assert.equal(expected, actual);
    });

    it('should correctly evaluate an expression that prefixes with +', () => {
      const prop = extractProp('<div foo={+42} />');

      const expected = 42;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });

    it('should correctly evaluate an expression that prefixes with !', () => {
      const prop = extractProp('<div foo={!bar} />');

      const expected = false; // !"bar" === false
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });

    it('should correctly evaluate an expression that prefixes with ~', () => {
      const prop = extractProp('<div foo={~bar} />');

      const expected = -1; // ~"bar" === -1
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });

    it('should return true when evaluating `delete foo`', () => {
      const prop = extractProp('<div foo={delete x} />');

      const expected = true;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });

    it('should return undefined when evaluating `void foo`', () => {
      const prop = extractProp('<div foo={void x} />');

      const expected = undefined;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });

    // TODO: We should fix this to check to see if we can evaluate it.
    it('should return undefined when evaluating `typeof foo`', () => {
      const prop = extractProp('<div foo={typeof x} />');

      const expected = undefined;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });
  });

  describe('This expression tests', () => {
    it('should return null', () => {
      const prop = extractProp('<div foo={this} />');

      const expected = null;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });
  });

  describe('Conditional expression tests', () => {
    it('should return null', () => {
      const prop = extractProp('<div foo={bar ? baz : bam} />');

      const expected = null;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });
  });

  describe('Binary expression tests', () => {
    it('should return null', () => {
      const prop = extractProp('<div foo={1 == "1"} />');

      const expected = null;
      const actual = getLiteralPropValue(prop);

      assert.equal(expected, actual);
    });
  });

  describe('Object expression tests', () => {
    it('should return null', () => {
      const prop = extractProp('<div foo={ { bar: "baz" } } />');

      const expected = null;
      const actual = getLiteralPropValue(prop);

      assert.deepEqual(expected, actual);
    });
  });

  describe('New expression tests', () => {
    it('should return null', () => {
      const prop = extractProp('<div foo={new Bar()} />');

      const expected = null;
      const actual = getLiteralPropValue(prop);

      assert.deepEqual(expected, actual);
    });
  });
});