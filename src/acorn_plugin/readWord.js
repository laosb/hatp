// TODO:
// keywordTypes needs to be exposed to us: https://github.com/ternjs/acorn/pull/495
// We need a map to map Chinese keywords to western ones.

import { tokTypes as tt, keywordTypes } from 'acorn';

export default function readWord() {
  // https://github.com/ternjs/acorn/blob/master/src/tokenize.js#L691-L699
  return function ha() {
    const word = this.readWord1();
    let type = tt.name;
    if (this.keywords.test(word)) {
      if (this.containsEsc) this.raiseRecoverable(this.start, `Escape sequence in keyword ${word}`);
      type = keywordTypes[word];
    }
    return this.finishToken(type, word);
  };
}
