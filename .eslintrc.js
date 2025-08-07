module.exports = {
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    node: true,
    es6: true,
    jest: true
  },
  rules: {
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'off', // Allow console.log for BiasGuard system
    'no-debugger': 'error',
    'no-unused-vars': 'warn'
  },
  ignorePatterns: [
    'dist/**/*',
    'production-package/**/*',
    'node_modules/**/*',
    '*.js' // Ignore JS files in production package
  ]
};