
const { defaults } = require('jest-config')

module.exports = {
  testPathIgnorePatterns: [
    ...defaults.testPathIgnorePatterns,
    'lib/'
  ],
  testEnvironment: 'node',
  collectCoverageFrom: [
    'lib/**/*.js'
  ]
}
