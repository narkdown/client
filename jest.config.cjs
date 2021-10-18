/** @type {import("@jest/types").Config.InitialOptions } */
module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  testEnvironment: 'node',
  verbose: true,
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};
