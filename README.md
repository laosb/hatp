# hatp

[![Build Status](https://travis-ci.org/laosb/hatp.svg?branch=master)](https://travis-ci.org/laosb/hatp)
[![npm Version](https://img.shields.io/npm/v/hatp.svg)](https://npmjs.com/package/hatp)

The transpiler which transpile [HaLang](https://laosb.github.io/halang) to Javascript, based on Acorn and Astring.

## Usage

This package exports a `convert` function as default.

```js
import convert from 'hatp';
const config = {
  ha: {}, // Config for ha the acorn plugin. If none, use `true`.
  acorn: { sourceType: 'module' }, // Config for acorn.
  astring: {}, // Config for astring.
};
convert(`钦定 蛤 = “主席”；`, config);
```

You can also use this package in CLI:

```
$ hatp -o built/
测试.ha -> built/测试.js
```

See more CLI usage by `hatp -h`.

## License

MIT.
