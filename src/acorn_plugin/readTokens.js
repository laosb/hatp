import { tokTypes as tt } from 'acorn';
import * as mapping from '../mapping';

const { multiCompare, dots, lts, gts, slashs, eqs, pipes, mults, mergedNumbers } = mapping;
// ### Token reading

// This is the function that is called to fetch the next token. It
// is somewhat obscure, because it works in character codes rather
// than characters, and because operator parsing has been inlined
// into it.
//
// All in the name of speed.
//
export function readTokenDot() {
  return function ha() {
    const next = this.input.charCodeAt(this.pos + 1);
    if (multiCompare(mergedNumbers, next)) return this.readNumber(true);
    const next2 = this.input.charCodeAt(this.pos + 2);
    if (this.options.ecmaVersion >= 6 && multiCompare(dots, next, next2)) {
      this.pos += 3;
      return this.finishToken(tt.ellipsis);
    }
    this.pos += 1;
    return this.finishToken(tt.dot);
  };
}

export function readTokenSlash() {
  return function ha() { // '/'
    const next = this.input.charCodeAt(this.pos + 1);
    if (this.exprAllowed) { this.pos += 1; return this.readRegexp(); }
    if (multiCompare(slashs, next)) return this.finishOp(tt.assign, 2);
    return this.finishOp(tt.slash, 1);
  };
}

export function readTokenMultModuloExp() {
  return function ha(code) { // '%*'
    let next = this.input.charCodeAt(this.pos + 1);
    let size = 1;
    let tokentype = multiCompare(mults, code) ? tt.star : tt.modulo;

    // exponentiation operator ** and **=
    if (this.options.ecmaVersion >= 7 && multiCompare(mults, next)) {
      size += 1;
      tokentype = tt.starstar;
      next = this.input.charCodeAt(this.pos + 2);
    }

    if (multiCompare(eqs, code)) return this.finishOp(tt.assign, size + 1);
    return this.finishOp(tokentype, size);
  };
}

export function readTokenPipeAmp() {
  return function ha(code) { // '|&'
    const next = this.input.charCodeAt(this.pos + 1);
    if (next === code) {
      return this.finishOp(multiCompare(pipes, code) ? tt.logicalOR : tt.logicalAND, 2);
    }
    if (multiCompare(eqs, code)) return this.finishOp(tt.assign, 2);
    return this.finishOp(multiCompare(pipes, code) ? tt.bitwiseOR : tt.bitwiseAND, 1);
  };
}

export function readTokenCaret() {
  return function ha() { // '^'
    const next = this.input.charCodeAt(this.pos + 1);
    if (multiCompare(eqs, next)) return this.finishOp(tt.assign, 2);
    return this.finishOp(tt.bitwiseXOR, 1);
  };
}

export function readTokenPlusMin() {
  return function ha(code) { // '+-'
    const next = this.input.charCodeAt(this.pos + 1);
    if (next === code) {
      return this.finishOp(tt.incDec, 2);
    }
    if (multiCompare(eqs, next)) return this.finishOp(tt.assign, 2);
    return this.finishOp(tt.plusMin, 1);
  };
}

export function readTokenLtGt() {
  return function ha(code) { // '<>'
    const next = this.input.charCodeAt(this.pos + 1);
    let size = 1;
    if (next === code) {
      size = gts.indexOf(code) >= 0 && this.input.charCodeAt(this.pos + 2) === code ? 3 : 2;
      if (lts.indexOf(this.input.charCodeAt(this.pos + size)) >= 0) {
        return this.finishOp(tt.assign, size + 1);
      }
      return this.finishOp(tt.bitShift, size);
    }
    if (lts.indexOf(next) >= 0) size = 2;
    return this.finishOp(tt.relational, size);
  };
}

export function readTokenEqExcl() {
  return function ha(code) { // '=!'
    const next = this.input.charCodeAt(this.pos + 1);
    if (multiCompare(eqs, next)) {
      return this.finishOp(tt.equality,
        multiCompare(eqs, this.input.charCodeAt(this.pos + 2)) ? 3 : 2);
    }
    if (
      multiCompare(eqs, code) && multiCompare(gts, next) && this.options.ecmaVersion >= 6
    ) { // '=>'
      this.pos += 2;
      return this.finishToken(tt.arrow);
    }
    return this.finishOp(multiCompare(eqs, code) ? tt.eq : tt.prefix, 1);
  };
}
