/* eslint-disable */ // Should remove this once I work home.
import { lineBreakG } from 'acorn';

export default function skipSpace() {
  // https://github.com/ternjs/acorn/blob/master/src/tokenize.js#L100-L116
  return function ha(endSign) {
    const endS = endSign ? endSign : '*/';
    let startLoc = this.options.onComment && this.curPosition();
    let start = this.pos, 
        end = this.input.indexOf(endS, this.pos += endS.length);
    if (end === -1) { this.raise(this.pos - 2, "Unterminated comment"); }
    this.pos = end + endS.length;
    if (this.options.locations) {
      lineBreakG.lastIndex = start
      let match
      while ((match = lineBreakG.exec(this.input)) && match.index < this.pos) {
        ++this.curLine
        this.lineStart = match.index + match[0].length
      }
    }
    if (this.options.onComment)
      this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos,
                             startLoc, this.curPosition())
  };
}
