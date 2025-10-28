module.exports = {
  extends: ['standard'],
  env: {
    browser: true,
    webextensions: true,
    es2021: true
  },
  globals: {
    chrome: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'script'
  },
  rules: {
    'no-console': 'off',
    camelcase: 'off',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-spacing': 'error',
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
    'comma-dangle': ['error', 'never'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    indent: ['error', 2],
    'space-before-function-paren': ['error', 'never'],
    'keyword-spacing': 'error',
    'space-infix-ops': 'error',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'no-multiple-empty-lines': ['error', { max: 2 }],
    'brace-style': ['error', '1tbs'],
    curly: 'error'
  }
};
