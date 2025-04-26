/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    // eslint-disable-next-line
    '^.+\.tsx?$': ['ts-jest', {}],
  },
};
