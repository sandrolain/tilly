![tilly](https://raw.githubusercontent.com/sandrolain/tilly/33ca7c6d7538c9d7f946d07aecac622c811b5f5e/assets/logo.svg?sanitize=true "tilly")

<p align="center">

**Promise Utility Library**  
Small collection of functions designed to help the manipulation of the **ES6 Promises** with *await* operator.

</p>

This library is the evolution and conversion to TypeScript of [till.mjs](https://github.com/sandrolain/till), equivalent written as plain ES6 module.

---

## Getting Started

Documentation with examples can be found [clicking here](https://sandrolain.github.io/tilly/typedocs/modules/_index_.html)

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
