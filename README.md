![tilly](https://raw.githubusercontent.com/sandrolain/tilly/33ca7c6d7538c9d7f946d07aecac622c811b5f5e/assets/logo.svg?sanitize=true "tilly")

<p align="center">

**Promise Utility Library**  
Small collection of functions designed to help the manipulation of the **ES6 Promises** with *await* operator.

</p>

This library is the evolution and conversion to TypeScript of [till.mjs](https://github.com/sandrolain/till), equivalent written as plain ES6 module.

---

## Install

### With [NPM](https://www.npmjs.com/)

```sh
$ npm install tilly
```

or as development dependency:

```sh
$ npm install --save-dev tilly
```

### With [YARN](https://yarnpkg.com/)

```sh
$ yarn add tilly
```

or as development dependency:

```sh
$ yarn add --dev tilly
```

### Release Download

You can download and use the [latest release](https://github.com/sandrolain/tilly/releases) directly from the GitHub page.

---

## Usage

### As TypeScript module

```typescript
/// import specific methods or classes
import { all, sleep } from "tilly";
// ...

// or entire library
import * as tilly from "tilly";
// ...
```

### As browser EcmaScript module

```html
<script type="module">
/// import specific methods or classes
import { all, sleep } from "./tilly/esm/index.js";
// ...

// or entire library
import * as tilly from "./tilly/esm/index.js";
// ...
</script>
```

### As commonjs/node.js module

```javascript
/// import specific methods or classes
const { all, sleep } = require("tilly");
// ...

// or entire library
const tilly = require("tilly");
// ...
```

---

## Documentation

Typedoc documentation with examples can be found by [clicking here](https://sandrolain.github.io/tilly/typedocs/modules/_index_.html).

The same examples are visible by [clicking here](https://sandrolain.github.io/tilly/examples.html).

---

## Build types available

This package is written in TypeScript and the build includes type definitions for use in other TypeScript projects.  
The build of this package generates two versions:
- **ES Module**: For use in TypeScript or web projects for browsers that support ES6 modules. Using ES6 import in projects based on node.js (including TypeScript) it allows during the bundling phase (via webpack, rollup or equivalent) to perform the tree-shaking of the dependencies and have a lighter bundle.
- **Universal Module Definition**: To be used directly in projects based on node.js, or into web projects callable via global variable or via requirejs

---

## Status

<table><thead><tr><th>master</th><th>develop</th></tr></thead><tbody><tr><td>

[![Build Status](https://travis-ci.org/sandrolain/tilly.svg?branch=master)](https://travis-ci.org/sandrolain/tilly)

</td><td>

[![Build Status](https://travis-ci.org/sandrolain/tilly.svg?branch=develop)](https://travis-ci.org/sandrolain/tilly)

</td></tr></tbody></table>

---

## License
[![MIT](https://img.shields.io/github/license/sandrolain/tilly)](./LICENSE)

-------------------------

[Sandro Lain](https://www.sandrolain.com/)
