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
  return function () {
    const next = this.input.charCodeAt(this.pos + 1);
    if (next >= 48 && next <= 57) return this.readNumber(true);
    const next2 = this.input.charCodeAt(this.pos + 2);
    if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) { // 46 = dot '.'
      this.pos += 3;
      return this.finishToken(tt.ellipsis);
    }
    ++this.pos;
    return this.finishToken(tt.dot);
  };
}

export function readToken_slash(inner) {
  return function ()  { // '/'
    const next = this.input.charCodeAt(this.pos + 1);
    if (this.exprAllowed) { ++this.pos; return this.readRegexp(); }
    if (next === 61) return this.finishOp(tt.assign, 2);
    return this.finishOp(tt.slash, 1);
  };
}

export function readToken_mult_modulo_exp(inner) {
  return function (code)  { // '%*'
    let next = this.input.charCodeAt(this.pos + 1);
    let size = 1;
    let tokentype = code === 42 ? tt.star : tt.modulo;

    // exponentiation operator ** and **=
    if (this.options.ecmaVersion >= 7 && next === 42) {
      ++size;
      tokentype = tt.starstar;
      next = this.input.charCodeAt(this.pos + 2);
    }

    if (next === 61) return this.finishOp(tt.assign, size + 1);
    return this.finishOp(tokentype, size);
  };
}

export function readToken_pipe_amp(inner) {
  return function (code)  { // '|&'
    const next = this.input.charCodeAt(this.pos + 1);
    if (next === code) return this.finishOp(code === 124 ? tt.logicalOR : tt.logicalAND, 2);
    if (next === 61) return this.finishOp(tt.assign, 2);
    return this.finishOp(code === 124 ? tt.bitwiseOR : tt.bitwiseAND, 1);
  };
}

export function readToken_caret(inner) {
  return function ()  { // '^'
    const next = this.input.charCodeAt(this.pos + 1);
    if (next === 61) return this.finishOp(tt.assign, 2);
    return this.finishOp(tt.bitwiseXOR, 1);
  };
}

export function readToken_plus_min(inner) {
  return function (code)  { // '+-'
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
    if (next === 61) return this.finishOp(tt.assign, 2);
    return this.finishOp(tt.plusMin, 1);
  };
}

export function readToken_lt_gt(inner) {
  return function (code)  { // '<>'
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
  return function (code)  { // '=!'
    const next = this.input.charCodeAt(this.pos + 1);
    if (next === 61) return this.finishOp(tt.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
    if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) { // '=>'
      this.pos += 2;
      return this.finishToken(tt.arrow);
    }
    return this.finisOp(code === 61 ? tt.eq : tt.prefix, 1);
  };
}
