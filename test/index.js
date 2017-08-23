import { assert } from 'chai'
import convert from '../src'

const config = { acorn: { sourceType: 'module' } }

describe('普通 JavaScript 代码', () => {
  it('简易测试', () => {
    const haCode = '(() => {console.log("Testing JavaScript. 1 + 1 = ", 1 + 1);})()'
    const targetJs = '(() => {\n  console.log("Testing JavaScript. 1 + 1 = ", 1 + 1);\n})();\n'
    assert(convert(haCode, config) === targetJs)
  })
})

describe('注释', () => {
  it('注：', () => {
    const haCode = 'console.log("测试"); 注：这是个测试。'
    const targetJs = '// 这是个测试。\nconsole.log("测试");\n'
    assert(convert(haCode, config) === targetJs)
  })
  it('//', () => {
    const haCode = 'console.log("测试"); //这是个测试。'
    const targetJs = '// 这是个测试。\nconsole.log("测试");\n'
    assert(convert(haCode, config) === targetJs)
  })
})

describe('语句级标点处理（pp.readToken）', () => {
  it('：；', () => {
    const haCode = 'console.log({ key：value })；'
    const targetJs = 'console.log({\n  key: value\n});\n'
    assert(convert(haCode, config) === targetJs)
  })
  it('「」『』合法配对1', () => {
    const haCode = 'console.log（『「excited！」』）；'
    const targetJs = 'console.log("「excited！」");\n'
    assert(convert(haCode, config) === targetJs)
  })
  it('「」『』合法配对2', () => {
    const haCode = 'console.log（「『excited！』」）；'
    const targetJs = "console.log('『excited！』');\n"
    assert(convert(haCode, config) === targetJs)
  })
  it('全角运算符转换', () => {
    const haCode = 'console.log（1＝＝＝1＾2）；'
    const targetJs = 'console.log(1 === 1 ^ 2);\n'
    assert(convert(haCode, config) === targetJs)
  })
  it('数字转换（二进制）', () => {
    const haCode = 'console.log（０ｂ１１１０１００１）；'
    const targetJs = 'console.log(233);\n'
    assert(convert(haCode, config) === targetJs)
  })
  it('数字转换（八进制）', () => {
    const haCode = 'console.log（０ｏ１１）；'
    const targetJs = 'console.log(9);\n'
    assert(convert(haCode, config) === targetJs)
  })
  it('数字转换（十六进制）', () => {
    const haCode = 'console.log（０ｘ２ａ）；'
    const targetJs = 'console.log(42);\n'
    assert(convert(haCode, config) === targetJs)
  })
  it('数字转换（小数）', () => {
    const haCode = 'console.log（３．１４１５９２６）；'
    const targetJs = 'console.log(3.1415926);\n'
    assert(convert(haCode, config) === targetJs)
  })
})
