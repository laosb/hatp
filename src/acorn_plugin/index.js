import { plugins, tokTypes as tt } from 'acorn';

function readToken(nextMethod) {
  return function ha(code) {
    /* eslint-disable no-plusplus */
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
      default:
    }
    return nextMethod.call(this, code);
  };
}

plugins.halang = function halangPlugin(parser) {
  parser.extend('readToken', readToken);
};
