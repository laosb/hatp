/* eslint-disable no-plusplus */

import { tokTypes as tt } from 'acorn';
import * as mapping from '../mapping';

const checkInArray = mapping.checkInArray;

export default function readToken(nextMethod) {
  return function ha(code) {
    if (checkInArray(code, mapping.dots)) {
      return this.readFullTokenDot(code);
    } else if (checkInArray(code, mapping.lts, mapping.gts)) {
      return this.readFullTokenLtGt(code);
    } else if (checkInArray(code, mapping.slashs)) {
      return this.readFullTokenSlash(code);
    } else if (checkInArray(code, mapping.mults, mapping.modulos)) {
      return this.readFullTokenMultModuloExp(code);
    } else if (checkInArray(code, mapping.pipes, mapping.amps)) {
      return this.readFullTokenPipeAmp(code);
    } else if (checkInArray(code, mapping.carets)) {
      return this.readFullTokenCarts(code);
    } else if (checkInArray(code, mapping.plus, mapping.minus)) {
      return this.readFullTokenPlusMin(code);
    } else if (checkInArray(code, mapping.eqs, mapping.excls)) {
      return this.readFullTokenEqExcl(code);
    }
    // https://github.com/ternjs/acorn/blob/master/src/tokenize.js#L313-L323
    switch (code) {
      case 65288: ++this.pos; return this.finishToken(tt.parenL);
      case 65289: ++this.pos; return this.finishToken(tt.parenR);
      case 65307: ++this.pos; return this.finishToken(tt.semi);
      case 65292: ++this.pos; return this.finishToken(tt.comma);
      case 12308: case 12304: case 12310: // 〔 【 〖
        ++this.pos; return this.finishToken(tt.bracketL);
      case 12309: case 12305: case 12311: // 〕 】 〗
        ++this.pos; return this.finishToken(tt.bracketR);
      case 65371: ++this.pos; return this.finishToken(tt.braceL);
      case 65373: ++this.pos; return this.finishToken(tt.braceR);
      case 65306: ++this.pos; return this.finishToken(tt.colon);
      case 65311: ++this.pos; return this.finishToken(tt.question);

      // https://github.com/ternjs/acorn/blob/master/src/tokenize.js#L343-L344
      // To make this work, we need to modify readString a little bit. See below.
      case 12300: return this.readString(12301); // Start with 「, so end with 」.
      case 12302: return this.readString(12303); // Start with 『, so end with 』.
      case 8216: return this.readString(8217); // Start with ‘, so end with ’.
      case 8220: return this.readString(8221); // Start with “, so end with ”.
      default:
    }
    return nextMethod.call(this, code);
  };
}
