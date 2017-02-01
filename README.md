# hatp

[![Build Status](https://travis-ci.org/laosb/hatp.svg?branch=master)](https://travis-ci.org/laosb/hatp)

The transpiler which transpile [HaLang](https://laosb.github.io/halang) to Javascript. Currently not for prod.

## Usage

This package exports a `convert` function as default.

```js
import convert from 'hatp';
convert(`很惭愧 这是注释`);
```

You can also use this package in CLI:

```
$ hatp -o built/
测试.ha -> built/测试.js
```

See more CLI info by `hatp -h`.
