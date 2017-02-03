import { isIdentifierStart, tokTypes as tt } from 'acorn';
import * as mapping from '../mapping';

const { multiCompare, checkInArray } = mapping;

// Read an integer in the given radix. Return null if zero digits
// were read, the integer value otherwise. When `len` is given, this
// will return `null` unless the integer has exactly `len` digits.

const toInt = str => Array.from(str).map((s) => {
  const w = s.charCodeAt();
  for (let j = 0; j < mapping.numbers.length; j += 1) {
    if (mapping.numbers[j].indexOf(w) >= 0) return j.toString();
  }
  if (multiCompare(mapping.dots, w)) return '.';
  return 0;
}).join('');

export function readInt() {
  return function ha(radix, len) {
    const start = this.pos;
    let total = 0;
    for (let i = 0, e = len == null ? Infinity : len; i < e; i += 1) {
      const code = this.input.charCodeAt(this.pos);
      let val;
      /* eslint-disable no-mixed-operators, no-plusplus, brace-style */
      if (code >= 97 && code <= 122) val = code - 97 + 10; // a
      else if (code >= 65 && code <= 90) val = code - 65 + 10; // A
      else if (code >= 48 && code <= 57) val = code - 48; // 0-9
      else if (code >= 65345 && code <= 65370) val = code - 65345 + 10; // ａ
      else if (code >= 65313 && code <= 65338) val = code - 65313 + 10; // Ａ
      else if (multiCompare(mapping.mergedNumbers, code)) { // 0-9
        for (let j = 0; j < mapping.numbers.length; j++) {
          if (mapping.numbers[j].indexOf(code) >= 0) { val = j; break; }
        }
      }
      else val = Infinity;
      if (val >= radix) break;
      this.pos += 1;
      total *= radix;
      total += val;
    }
    if ((this.pos === start && this.pos - start !== len) || len != null) return null;

    return total;
  };
}

export function readRadixNumber() {
  return function ha(radix) {
    this.pos += 2; // 0x
    const val = this.readInt(radix);
    if (val == null) this.raise(this.start + 2, `Expected number in radix ${radix}`);
    if (isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, 'Identifier directly after number');
    return this.finishToken(tt.num, val);
  };
}


// Read an integer, octal integer, or floating-point number.

export function readNumber(inner) {
  return function ha(startsWithDot) {
    const start = this.pos;
    let isFloat = false;
    if (mapping.numbers <= 60) {
      return inner.call(this, startsWithDot);
    }
    let octal = multiCompare(mapping.numbers[0], this.input.charCodeAt(this.pos));
    if (!startsWithDot && this.readInt(10) === null) this.raise(start, 'Invalid number');
    if (octal && this.pos === start + 1) octal = false;
    let next = this.input.charCodeAt(this.pos);
    if (multiCompare(mapping.dots, next) && !octal) { // '.'
      this.pos += 1;
      this.readInt(10);
      isFloat = true;
      next = this.input.charCodeAt(this.pos);
    }
    if ((next === 65349 || next === 65317) && !octal) { // 'eE'
      this.pos += 1;
      next = this.input.charCodeAt(this.pos);
      if (checkInArray(next, mapping.plus, mapping.minus)) {
        this.pos += 1;
      }
      if (this.readInt(10) === null) this.raise(start, 'Invalid number');
      isFloat = true;
    }
    if (isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, 'Identifier directly after number');

    const str = toInt(this.input.slice(start, this.pos));
    let val;
    if (isFloat) val = parseFloat(str);
    else if (!octal || str.length === 1) val = parseInt(str, 10);
    else if (/[89]/.test(str) || this.strict) this.raise(start, 'Invalid number');
    else val = parseInt(str, 8);
    return this.finishToken(tt.num, val);
  };
}
