module.exports = {
  extends: ['standard'],
  env: {
    browser: true,
    webextensions: true
  },
  globals: {
    chrome: 'readonly'
  },
  rules: {
    'no-console': 'off',
    'camelcase': 'off'
  }
}