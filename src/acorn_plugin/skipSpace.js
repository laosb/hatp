/* eslint-disable */
export default function skipSpace() {
  // https://github.com/ternjs/acorn/blob/8de357451e72c8a67acdb8a63353b577735dc7b6/src/tokenize.js#L134-L172
  return function ha() {
    loop: while (this.pos < this.input.length) {
      let ch = this.input.charCodeAt(this.pos)
      switch (ch) {
        case 32: case 160: // ' '
          ++this.pos
          break
        case 13:
          if (this.input.charCodeAt(this.pos + 1) === 10) {
            ++this.pos
          }
        case 10: case 8232: case 8233:
          ++this.pos
          if (this.options.locations) {
            ++this.curLine
            this.lineStart = this.pos
          }
          break
        case 47: // '/'
          switch (this.input.charCodeAt(this.pos + 1)) {
            case 42: // '*'
              this.skipBlockComment()
              break
            case 47:
              this.skipLineComment(2)
              break
            default:
              break loop
          }
          break
        case 27880: // '注'
          switch (this.input.charCodeAt(this.pos + 1)) {
            case 37322: // '释'
              if (this.input.charAt(this.pos + 2) === '：') {
                this.skipBlockComment('以上。');
              } else {
                break loop;
              }
              break
            case 65306: // '：'
              this.skipLineComment(2)
              break
            default:
              break loop
          }
        default:
          if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
            ++this.pos
          } else {
            break loop
          }
      }
    }
  };
};

