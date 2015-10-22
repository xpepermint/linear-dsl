# linear-dsl

> For building custom DSLs.

[![Build Status](https://travis-ci.org/xpepermint/linear-dsl.svg?branch=master)](https://travis-ci.org/xpepermint/linear-dsl)

## Setup

```
$ npm install --save linear-dsl
```

## Usage

Parsing custom DSL query.

```js
const dsl = require('linear-dsl');
let data = dsl.parse('a(foo) AND b(2 bars) OR c(4)');
```

Validating query mapping.

```js
const a = true;
const b = (args => /[a-z]/i.test(args[0]));
const c = {args =>};
const mapping = {a, b, c};

dsl.mappsTo('a(foo) AND b(2 bars) OR c(4)', mapping);
```
