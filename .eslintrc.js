module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/airbnb',
    'plugin:prettier/recommended'
  ],
  rules: {
    'prettier/prettier': ["error", {
      "singleQuote": true
    }],
    'comma-dangle': ["error", "never"],
    'no-console': 'off',
    'no-param-reassign': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
};
