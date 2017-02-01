import { tokTypes as tt } from 'acorn';

const makeCodeAt = array => array.map(p => p.charCodeAt());
const multiCompare = (array, ...data) => array.some(key => data.every(d => d === key));

const dots = makeCodeAt(['。', '．']);
const lts = makeCodeAt(['《', '＜']);
const gts = makeCodeAt(['》', '＞']);
const slashs = makeCodeAt(['、', '／']);

// ### Token reading

// This is the function that is called to fetch the next token. It
// is somewhat obscure, because it works in character codes rather
// than characters, and because operator parsing has been inlined
// into it.
//
// All in the name of speed.
//
export function readTokenDot(inner) {
  return function ha() {
    const next = this.input.charCodeAt(this.pos + 1);
    if (next >= 65296 && next <= 65305) return this.readNumber(true);
    const next2 = this.input.charCodeAt(this.pos + 2);
    if (this.options.ecmaVersion >= 6 && multiCompare(dots, next, next2)) {
      this.pos += 3;
      return this.finishToken(tt.ellipsis);
    }
    return inner.call(this);
  };
}

export function readTokenSlash(inner) {
  return function ha() { // '/'
    const next = this.input.charCodeAt(this.pos + 1);
    if (this.exprAllowed) { this.pos += 1; return this.readRegexp(); }
    if (multiCompare(slashs, next)) return this.finishOp(tt.assign, 2);
    return inner.call(this);
  };
}

export function readTokenMultModuloExp(inner) {
  return function ha(code) { // '%*'
    if (!(code === 215 || code === 65290)) return inner.call(this, code);
    let next = this.input.charCodeAt(this.pos + 1);
    let size = 1;
    let tokentype = (code === 215 || code === 65290) ? tt.star : tt.modulo;

    // exponentiation operator ** and **=
    if (this.options.ecmaVersion >= 7 && (next === 215 || next === 65290)) {
      size += 1;
      tokentype = tt.starstar;
      next = this.input.charCodeAt(this.pos + 2);
    }

    if (next === 65309) return this.finishOp(tt.assign, size + 1);
    return this.finishOp(tokentype, size);
  };
}

export function readTokenPipeAmp(inner) {
  return function ha(code) { // '|&'
    if (!(code === 65372 || code === 65286)) return inner.call(this, code);
    const next = this.input.charCodeAt(this.pos + 1);
    if (next === code) return this.finishOp(code === 65372 ? tt.logicalOR : tt.logicalAND, 2);
    if (next === 65309) return this.finishOp(tt.assign, 2);
    return this.finishOp(code === 65372 ? tt.bitwiseOR : tt.bitwiseAND, 1);
  };
}

export function readTokenCaret(inner) {
  return function ha() { // '^'
    const next = this.input.charCodeAt(this.pos + 1);
    if (next === 65309) return this.finishOp(tt.assign, 2);
    return inner.call(this);
  };
}

export function readTokenPlusMin(inner) {
  return function ha(code) { // '+-'
    if (!(code === 65291 || code === 65293 || code === 8212)) return inner.call(this, code);
    const next = this.input.charCodeAt(this.pos + 1);
    if (next === code) {
      return this.finishOp(tt.incDec, 2);
    }
    if (next === 65309) return this.finishOp(tt.assign, 2);
    return this.finishOp(tt.plusMin, 1);
  };
}

export function readTokenLtGt(inner) {
  const concatenated = lts.concat(gts);
  return function ha(code) { // '<>'
    if (concatenated.indexOf(code) < 0) {
      return inner.call(this, code);
    }
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

export function readTokenEqExcl(inner) {
  return function ha(code) { // '=!'
    if (code !== 65309 && code !== 65281) return inner.call(this, code);
    const next = this.input.charCodeAt(this.pos + 1);
    if (next === 65309) {
      return this.finishOp(tt.equality, this.input.charCodeAt(this.pos + 2) === 65309 ? 3 : 2);
    }
    if (code === 65309 && multiCompare(gts, next) && this.options.ecmaVersion >= 6) { // '=>'
      this.pos += 2;
      return this.finishToken(tt.arrow);
    }
    return this.finisOp(code === 65309 ? tt.eq : tt.prefix, 1);
  };
}
