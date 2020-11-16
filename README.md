# @cwire/nodejs-sdk

[![github (open issues)](https://img.shields.io/github/issues/cwire-io/nodejs-sdk)](https://github.com/cwire-io/nodejs-sdk)
[![npm (scoped)](https://img.shields.io/npm/v/@cwire/nodejs-sdk.svg)](https://www.npmjs.com/package/@cwire/nodejs-sdk)
[![npm bundle size (minified)](https://img.shields.io/github/stars/cwire-io/nodejs-sdk)](https://www.npmjs.com/package/@cwire/nodejs-sdk)

With @cwire/nodejs-sdk you can easy integrate your nodejs backend
to [cwire.io](https://cwire.io).
 
## Install

npm
```
$ npm install @cwire/nodejs-sdk
```
Yarn
```
$ yarn addd @cwire/nodejs-sdk
```

## Small example
For more please checkout our docs or [code examples](https://github.com/cwire-io/nodejs-sdk/tree/master/examples)
```js
import express from 'express';
import { DataTypes, Model, Sequelize } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory');
class User extends Model {}
class Setting extends Model {}
User.init({
  field: {
    allowNull: false,
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'MyAwsomeTestModel'
});
await CWire.init("<YOUR_API_KEY>", {
  models: [
    new DataModel('users', {
      model: User,
      type: "Sequelize"
    })
  ],
});
```
