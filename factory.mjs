import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginImportX from 'eslint-plugin-import-x';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

/**
 * @param {{ isNuxtModule: boolean, isNuxtApp: boolean, isNextApp: boolean }} options
 */
export const configFactory = ({ isNuxtModule, isNuxtApp, isNextApp } = {}) => {
  const isNuxt = isNuxtModule || isNuxtApp;

  const nuxtAppGlobals = () =>
    isNuxtApp ?
      {
        ref: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        watchEffect: 'readonly',
      }
    : {};

  const nuxtConfigArray = () => (isNuxt ? pluginVue.configs['flat/recommended'] : []);

  const nuxtRules = () =>
    isNuxt ?
      {
        'vue/multi-word-component-names': 'off',
      }
    : {};

  const nextConfigArray = () =>
    isNextApp ?
      compat.config({
        extends: ['next', 'next/core-web-vitals', 'next/typescript'],
      })
    : [];

  return tseslint.config(
    { ignores: ['*.d.ts', '**/coverage', '**/dist'] },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginImportX.flatConfigs.recommended,
    eslintPluginImportX.flatConfigs.typescript,
    ...nuxtConfigArray(),
    ...nextConfigArray(),
    {
      files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx,vue}'],
      plugins: { 'unused-imports': unusedImports },
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.browser,
          ...nuxtAppGlobals(),
        },
        parserOptions: {
          parser: tseslint.parser,
        },
      },
      rules: {
        'accessor-pairs': 'error',
        'arrow-body-style': 'error',
        'block-scoped-var': 'error',
        'consistent-return': 'error',
        curly: 'error',
        'default-case': 'error',
        'default-case-last': 'error',
        'dot-notation': 'error',
        eqeqeq: 'error',
        'grouped-accessor-pairs': 'error',
        'guard-for-in': 'error',
        'max-classes-per-file': ['error', 1],
        'max-depth': ['error', 7],
        'no-alert': 'error',
        'no-array-constructor': 'error',
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-console': [
          'error',
          {
            allow: ['warn'],
          },
        ],
        'no-else-return': 'error',
        'no-eval': 'error',
        'no-extend-native': 'error',
        'no-extra-bind': 'error',
        'no-extra-label': 'error',
        'no-floating-decimal': 'error',
        'no-implicit-globals': 'error',
        'no-implied-eval': 'error',
        'no-iterator': 'error',
        'no-labels': 'error',
        'no-lone-blocks': 'error',
        'no-lonely-if': 'error',
        'no-multi-assign': 'error',
        'no-multi-str': 'error',
        'no-negated-condition': 'error',
        'no-nested-ternary': 'error',
        'no-new': 'error',
        'no-new-func': 'error',
        'no-new-object': 'error',
        'no-new-wrappers': 'error',
        'no-octal-escape': 'error',
        'no-proto': 'error',
        'no-return-assign': 'error',
        'no-return-await': 'error',
        'no-sequences': 'error',
        'no-throw-literal': 'error',
        'no-undef-init': 'error',
        'no-unneeded-ternary': 'error',
        'no-useless-call': 'error',
        'no-useless-catch': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-concat': 'error',
        'no-useless-rename': 'error',
        'no-useless-return': 'error',
        'no-var': 'error',
        'no-void': 'error',
        'object-shorthand': 'error',
        'one-var': ['error', 'never'],
        'prefer-const': 'error',
        'prefer-numeric-literals': 'error',
        'prefer-object-spread': 'error',
        'prefer-promise-reject-errors': 'error',
        'prefer-regex-literals': 'error',
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'error',
        'quote-props': ['error', 'as-needed'],
        radix: 'error',
        'spaced-comment': ['error', 'always'],
        strict: 'error',
        'symbol-description': 'error',
        'vars-on-top': 'error',
        yoda: 'error',

        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'warn',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_',
          },
        ],

        'import-x/no-dynamic-require': 'warn',
        'import-x/no-nodejs-modules': 'warn',
        'import-x/order': [
          'error',
          {
            alphabetize: {
              caseInsensitive: true,
              order: 'asc',
            },
            groups: ['builtin', 'external', 'sibling', 'internal', 'object', 'type', 'parent', 'index'],
            'newlines-between': 'ignore',
          },
        ],
        'sort-imports': [
          'error',
          {
            allowSeparatedGroups: true,
            ignoreDeclarationSort: true,
            ignoreCase: true,
            ignoreMemberSort: false,
            memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          },
        ],

        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',

        ...nuxtRules(),
      },
    },
    eslintConfigPrettier
  );
};
