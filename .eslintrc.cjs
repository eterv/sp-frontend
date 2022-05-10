module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['svelte3', '@typescript-eslint'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  globals: {
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    defineProps: 'readonly',
    withDefaults: 'readonly',
    $ref: 'readonly',
    $computed: 'readonly',
  },
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  ignorePatterns: ['dist'],
  settings: {
    'svelte3/typescript': true,
  },
};
