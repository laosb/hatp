import { tokTypes as tt } from 'acorn';

// ### Token reading

// This is the function that is called to fetch the next token. It
// is somewhat obscure, because it works in character codes rather
// than characters, and because operator parsing has been inlined
// into it.
//
// All in the name of speed.
//
export function readToken_dot(inner) {
  return function ha() {
    const next = this.input.charCodeAt(this.pos + 1);
    if (next >= 65296 && next <= 65305) return this.readNumber(true);
    const next2 = this.input.charCodeAt(this.pos + 2);
    if (this.options.ecmaVersion >= 6 &&
      ((next === 12290 && next2 === 12290) || (next === 65294 || next2 === 65294))
      // 。 = 12290，． = 65294
      ) {
      this.pos += 3;
      return this.finishToken(tt.ellipsis);
    }
    return inner.call(this);
  };
}

export function readToken_slash(inner) {
  return function ha() { // '/'
    const next = this.input.charCodeAt(this.pos + 1);
    if (this.exprAllowed) { ++this.pos; return this.readRegexp(); }
    if (next === 12289 || next === 65295) return this.finishOp(tt.assign, 2);
    return inner.call(this);
  };
}

export function readToken_mult_modulo_exp(inner) {
  return function ha(code)  { // '%*'
    if (!(code === 215 || code === 65290)) return inner.call(this, code);
    let next = this.input.charCodeAt(this.pos + 1);
    let size = 1;
    let tokentype = (code === 215 || code === 65290) ? tt.star : tt.modulo;

    // exponentiation operator ** and **=
    if (this.options.ecmaVersion >= 7 && (next === 215 || next === 65290)) {
      ++size;
      tokentype = tt.starstar;
      next = this.input.charCodeAt(this.pos + 2);
    }

    if (next === 65309) return this.finishOp(tt.assign, size + 1);
    return this.finishOp(tokentype, size);
  };
}

export function readToken_pipe_amp(inner) {
  return function ha(code) { // '|&'
    if (!(code === 65372 || code === 65286)) return inner.call(this, code);
    const next = this.input.charCodeAt(this.pos + 1);
    if (next === code) return this.finishOp(code === 65372 ? tt.logicalOR : tt.logicalAND, 2);
    if (next === 65309) return this.finishOp(tt.assign, 2);
    return this.finishOp(code === 65372 ? tt.bitwiseOR : tt.bitwiseAND, 1);
  };
}

export function readToken_caret(inner) {
  return function ha() { // '^'
    const next = this.input.charCodeAt(this.pos + 1);
    if (next === 65309) return this.finishOp(tt.assign, 2);
    return inner.call(this);
  };
}

export function readToken_plus_min(inner) {
  return function ha(code)  { // '+-'
    const next = this.input.charCodeAt(this.pos + 1);
    if (next === code) {
      if (next == 45 && this.input.charCodeAt(this.pos + 2) == 62 &&
          lineBreak.test(this.input.slice(this.lastTokEnd, this.pos))) {
        // A `-->` line comment
        this.skipLineComment(3);
        this.skipSpace();
        return this.nextToken();
      }
      return this.finishOp(tt.incDec, 2);
    }
    if (next === 65309) return this.finishOp(tt.assign, 2);
    return this.finishOp(tt.plusMin, 1);
  };
}

export function readToken_lt_gt(inner) {
  return function ha(code) { // '<>'
    const next = this.input.charCodeAt(this.pos + 1);
    let size = 1;
    if (next === code) {
      size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
      if (this.input.charCodeAt(this.pos + size) === 61) return this.finishOp(tt.assign, size + 1);
      return this.finishOp(tt.bitShift, size);
    }
    if (next == 33 && code == 60 && this.input.charCodeAt(this.pos + 2) == 45 &&
        this.input.charCodeAt(this.pos + 3) == 45) {
      if (this.inModule) this.unexpected();
      // `<!--`, an XML-style comment that should be interpreted as a line comment
      this.skipLineComment(4);
      this.skipSpace();
      return this.nextToken();
    }
    if (next === 61) size = 2;
    return this.finishOp(tt.relational, size);
  };
}

export function readToken_eq_excl(inner) {
  return function ha(code) { // '=!'
    if (code !== 65309 && code !== 65281) return inner.call(this, code);
    const next = this.input.charCodeAt(this.pos + 1);
    if (next === 65309) return this.finishOp(tt.equality, this.input.charCodeAt(this.pos + 2) === 65309 ? 3 : 2);
    if (code === 65309 && (next === 65310 || next === 12299) && this.options.ecmaVersion >= 6) { // '=>'
      this.pos += 2;
      return this.finishToken(tt.arrow);
    }
    return this.finisOp(code === 65309 ? tt.eq : tt.prefix, 1);
  };
}
