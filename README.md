# linear-dsl

> For building custom DSLs.

[![Build Status](https://travis-ci.org/xpepermint/linear-dsl.svg?branch=master)](https://travis-ci.org/xpepermint/linear-dsl)

## Setup

```
$ npm install --save linear-dsl
```

## Usage

```js
'use strict';

const dsl = require('linear-dsl');

dsl.parse('a(1) AND b(2 3) OR c(4)');
```
