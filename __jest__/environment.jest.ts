/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

// Source: https://github.com/shelfio/jest-mongodb/blob/master/environment.js

import NodeEnvironment from 'jest-environment-node';
import path from 'path';
import fs from 'fs';
import uuid from 'uuid';

const debug = require('debug')('jest-mongodb:environment');

const cwd = process.cwd();
const globalConfigPath = path.join(cwd, 'globalConfig.json');

// * Reference: https://jestjs.io/docs/configuration#testenvironment-string
class MongoEnvironment extends NodeEnvironment {
  async setup() {
    debug('Setup MongoDB Test Environment');

    const globalConfig = JSON.parse(fs.readFileSync(globalConfigPath, 'utf-8'));

    this.global.__MONGO_URI__ = globalConfig.mongoUri;
    this.global.__MONGO_DB_NAME__ = globalConfig.mongoDBName || uuid.v4();

    await super.setup();
  }

  async teardown() {
    debug('Teardown MongoDB Test Environment');

    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

module.exports = MongoEnvironment;
