import { assert } from 'chai';
import convert from '../src';

const config = { acorn: { sourceType: 'module' } };

describe('语句级标点处理（pp.readToken）', () => {
  it('：；', () => {
    const haCode = 'console.log({ key：value })；';
    const targetJs = 'console.log({\n  key: value\n});\n';
    assert(convert(haCode, config) === targetJs);
  });
  it('「」『』合法配对1', () => {
    const haCode = 'console.log（『「excited！」』）；';
    const targetJs = 'console.log("「excited！」");\n';
    assert(convert(haCode, config) === targetJs);
  });
  it('「」『』合法配对2', () => {
    const haCode = 'console.log（「『excited！』」）；';
    const targetJs = "console.log('『excited！』');\n";
    assert(convert(haCode, config) === targetJs);
  });
});
