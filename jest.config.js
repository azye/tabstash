module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverageFrom: [
    '*.js',
    '!jest.config.js',
    '!tests/**'
  ],
  testMatch: [
    '<rootDir>/tests/**/*.test.js'
  ]
};
