/* eslint-disable no-plusplus */
import { lineBreakG } from 'acorn';

export default function skipSpace() {
  // https://github.com/ternjs/acorn/blob/master/src/tokenize.js#L100-L116
  return function ha(endSign) {
    const endS = endSign || '*/';
    const startLoc = this.options.onComment && this.curPosition();
    const start = this.pos;
    const end = this.input.indexOf(endS, this.pos += endS.length);
    if (end === -1) { this.raise(this.pos - 2, 'Unterminated comment'); }
    this.pos = end + endS.length;
    if (this.options.locations) {
      lineBreakG.lastIndex = start;
      let match;
      while ((match = lineBreakG.exec(this.input)) // eslint-disable-line no-cond-assign
        && match.index < this.pos) {
        ++this.curLine;
        this.lineStart = match.index + match[0].length;
      }
    }
    if (this.options.onComment) {
      this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos,
                             startLoc, this.curPosition());
    }
  };
}
