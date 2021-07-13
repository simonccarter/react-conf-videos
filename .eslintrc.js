
module.exports = {
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['react', '@typescript-eslint', 'jest'],
  env: {
    node: true,
    browser: true,
    es6: true,
    jest: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    'linebreak-style': 'off',
    "@typescript-eslint/explicit-module-boundary-types": 'off',
    "@typescript-eslint/no-shadow": 'off',
    "react/prop-types": 'off',
    "react/jsx-props-no-spreading": 'off',
    "prefer-default-export": 'off',
    "import/prefer-default-export": 'off',
    "no-restricted-syntax": 'off',
    "prefer-destructuring": 'off',
    "padding-line-between-statements": [
      "error",
      { blankLine: "always", prev: "*", next: "return" }
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};