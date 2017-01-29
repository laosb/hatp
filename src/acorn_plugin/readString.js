/* eslint-disable no-plusplus */

import { tokTypes as tt, isNewLine } from 'acorn';

export default function readString() {
  // Basically, this code is based on
  // https://github.com/ternjs/acorn/blob/master/src/tokenize.js#L542-L559
  // We need to replace it totally since we need to modify the quotes.
  // We've done some style tweaks to match AirBnB style guide.
  return function ha(quote) {
    let out = '';
    let chunkStart = ++this.pos;
    switch (quote) {
      case 12301: case 8217: out = "'"; break; // 「」 ‘’
      case 12303: case 8221: out = '"'; break; // 『』 “”
      default: break;
    }
    for (;;) {
      if (this.pos >= this.input.length) this.raise(this.start, 'Unterminated string constant');
      const ch = this.input.charCodeAt(this.pos);
      if (ch === quote) break;
      if (ch === 92) { // '\'
        out += this.input.slice(chunkStart, this.pos);
        out += this.readEscapedChar(false);
        chunkStart = this.pos;
      } else {
        if (isNewLine(ch)) this.raise(this.start, 'Unterminated string constant');
        ++this.pos;
      }
    }
    out += this.input.slice(chunkStart, this.pos);
    switch (quote) {
      case 12301: case 8217: out += "'"; break; // 「」 ‘’
      case 12303: case 8221: out += '"'; break; // 『』 “”
      default: break;
    }
    ++this.pos;
    return this.finishToken(tt.string, out);
  };
}
