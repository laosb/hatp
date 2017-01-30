// https://github.com/ternjs/acorn/blob/master/src/statement.js#L72
export default function parseStatement(nextMethod) {
  return function ha(declaration, topLevel, exports) {
    const node = this.startNode();
    console.log(this);
    // Catch 'from' here. Chinese token '从' should already be tokenized as 'from' in the tokenizer.
    if (this.type.label === 'name' && this.value === 'from') {
      return this.parseFromImport(node);
    }

    return nextMethod.call(this, declaration, topLevel, exports);
  };
}
