/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */

import fs from 'fs';
import { resolve, join } from 'path';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoMemoryServerStates } from 'mongodb-memory-server-core/lib/MongoMemoryServer';

const debug = require('debug')('jest-mongodb:setup');

const mongod = new MongoMemoryServer(getMongodbMemoryOptions());

const cwd = process.cwd();
const globalConfigPath = join(cwd, 'globalConfig.json');

export default async () => {
  // console.info('Setting up DB instance');

  if (mongod.state !== MongoMemoryServerStates.running) {
    await mongod.start();
  }

  const options = getMongodbMemoryOptions();

  const mongoConfig = {
    mongoUri: mongod.getUri(),
    mongoDBName: options.instance.dbName,
  };

  // Write global config to disk because all tests run in different contexts.
  fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));
  debug('Config is written');

  // Set reference to mongod in order to close the server during teardown.
  global.__MONGOD__ = mongod;
  process.env.MONGO_URL = mongoConfig.mongoUri;
};

function getMongodbMemoryOptions() {
  try {
    const { mongodbMemoryServerOptions } = require(resolve(cwd, 'jest-mongodb-config.js'));

    return mongodbMemoryServerOptions;
  } catch (e) {
    return {
      binary: {
        skipMD5: true,
      },
      autoStart: false,
      instance: {},
    };
  }
}
