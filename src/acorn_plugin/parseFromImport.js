/* eslint-disable no-param-reassign, no-underscore-dangle */

import { tokTypes as tt } from 'acorn';

export default function parseFromInput() {
  return function ha(node) {
    this.next();
    // For the `导入 「./xxx」；`, it should be handled by parseImport.
    node.source = this.type === tt.string ? this.parseExprAtom() : this.unexpected();
    this.expect(tt._import);
    node.specifiers = this.parseImportSpecifiers();
    this.semicolon();
    return this.finishNode(node, 'ImportDeclaration');
  };
}
