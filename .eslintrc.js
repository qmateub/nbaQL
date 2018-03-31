module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  globals: {
    window: true,
    define: true,
    require: true,
    module: true,
    _: false,
  },
  extends: 'eslint:recommended',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
      es6: true,
    },
    sourceType: 'module',
  },
  plugins: ['babel', 'graphql'],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-multiple-empty-lines': [2, { max: 2, maxEOF: 2 }],
    'no-console': 0,
  },
};
