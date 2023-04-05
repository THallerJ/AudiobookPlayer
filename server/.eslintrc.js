module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  overrides: [],
  plugins: ['prettier'],

  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: { 'prefer-destructuring': 'off' },
};
