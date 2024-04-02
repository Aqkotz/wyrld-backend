// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require('path');
import type { Config } from '@jest/types';
// import { resolve } from 'path';

const jestConfig: Config.InitialOptions = {
  preset: 'ts-jest',
  globalSetup: resolve(__dirname, './__jest__/setup.jest.ts'),
  globalTeardown: resolve(__dirname, './__jest__/teardown.jest.ts'),
  testEnvironment: resolve(__dirname, './__jest__/environment.jest.ts'),
  moduleDirectories: ['node_modules', '<rootDir>/src'], // https://stackoverflow.com/questions/70328994/cannot-use-import-statement-outside-a-module-in-node-modules
  globals: {
    'ts-jest': {
      tsconfig: resolve(__dirname, './__jest__/tsconfig.json'),
    },
  },
};

module.exports = jestConfig;
