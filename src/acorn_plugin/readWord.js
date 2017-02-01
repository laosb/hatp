// TODO:
// keywordTypes needs to be exposed to us: https://github.com/ternjs/acorn/pull/495
// We need a map to map Chinese keywords to western ones.

import { tokTypes as tt } from 'acorn';
import { types as keywordTypes } from './tokentype';

function wordTransform(word) {
  // Transform a Chinese keyword to corresponding one.
  // https://github.com/ternjs/acorn/blob/master/src/tokentype.js#L111-L146
  switch (word) {
    case '中止': return 'break';
    case '取值为': return 'case';
    case '捕捉': return 'catch';
    case '继续': return 'continue';
    case '调试断点': return 'debugger';
    case '默认': return 'default';
    case '做': return 'do';
    case '否则': case '不然': return 'else';
    case '最后': case '最终': return 'finally';
    case '循环': return 'for';
    case '函数': return 'function';
    case '若': case '如果': return 'if';
    case '返回': return 'return';
    case '当': return 'switch';
    case '抛出': case '丢出': case '甩出': return 'throw';
    case '尝试': case '试着': return 'try';
    case '传统变量': return 'var';
    case '变量': case '让': return 'let';
    case '常量': case '钦定': case '钦点': return 'const';
    case '只要': return 'while';
    case '范畴': return 'with';
    case '新': case '新的': return 'new';
    case '本体': case '这个': return 'this';
    case '上级': case '上司': return 'super';
    case '类': return 'class';
    case '扩展自': case '扩展': return 'extends';
    case '导出': return 'export';
    case '导入': return 'import';
    case '空白': return 'null';
    case '真': case '吼': return 'true';
    case '假': case '不吼': return 'false';
    case '在': return 'in';
    case '实例源自': case '实例来自': return 'instanceof';
    case '取类型': return 'typeof';
    case '无返回': return 'void';
    case '删除': return 'delete';
    default: return word;
  }
}

export default function readWord() {
  // https://github.com/ternjs/acorn/blob/master/src/tokenize.js#L691-L699
  return function ha() {
    const word = this.readWord1();
    const transformed = wordTransform(word);
    let type = tt.name;
    if (this.keywords.test(transformed)) {
      if (this.containsEsc) this.raiseRecoverable(this.start, `Escape sequence in keyword ${word}`);
      type = keywordTypes[transformed];
    }
    return this.finishToken(type, transformed);
  };
}
