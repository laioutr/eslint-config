import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginImportX from 'eslint-plugin-import-x';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import gitignore from 'eslint-config-flat-gitignore';

import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig } from 'eslint/config';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

/**
 * @param {{ isNuxtModule: boolean, isNuxtApp: boolean, isNextApp: boolean, isOclifApp: boolean }} options
 */
export const configFactory = ({ isNuxtModule, isNuxtApp, isNextApp, isOclifApp } = {}) => {
  const isNuxt = isNuxtModule || isNuxtApp;

  // TODO add vue-i18n eslint
  const nuxtConfigArray = (enable = isNuxt) => (enable ? [...pluginVue.configs['flat/recommended']] : []);

  const nuxtRules = (enable = isNuxt) =>
    enable ?
      {
        // Disabling no-undef rule for Nuxt apps as we are not generating a list of all globals.
        'no-undef': 'off',
        'vue/multi-word-component-names': 'off',

        // Ignore unused `props` variable in Vue components
        'unused-imports/no-unused-vars': [
          'warn',
          {
            vars: 'all',
            varsIgnorePattern: isNuxt ? '(^_|props)' : '^_',
            args: 'after-used',
            argsIgnorePattern: '^_',
          },
        ],
      }
    : {};

  const nuxtModuleRules = (enable = isNuxtModule) =>
    enable ?
      {
        'no-restricted-imports': [
          'error',
          {
            patterns: ['**/.nuxt', '**/.nuxt/*', '~/**', '@/**', '~~/**', '@@/**'],
          },
        ],
      }
    : {};

  const nextConfigArray = (enable = isNextApp) =>
    enable ?
      compat.config({
        extends: ['next', 'next/core-web-vitals', 'next/typescript'],
      })
    : [];

  const oclifRules = (enable = isOclifApp) =>
    enable ?
      {
        // Disallow all console statements in oclif apps
        'no-console': 'error',
      }
    : {};

  return defineConfig(
    gitignore(),
    { ignores: ['*.d.ts', '**/coverage', '**/dist', '**/.nuxt', '**/.output', '**/dist', '**/build', '**/.next'] },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginImportX.flatConfigs.recommended,
    eslintPluginImportX.flatConfigs.typescript,
    ...nuxtConfigArray(),
    ...nextConfigArray(),
    {
      files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx,vue}'],
      plugins: { 'unused-imports': unusedImports },
      settings: {
        'import-x/internal-regex': '^@laioutr',
      },
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
        },
        parserOptions: {
          parser: tseslint.parser,
          ecmaFeatures: {
            jsx: true,
          },
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

        'no-restricted-imports': [
          'error',
          {
            patterns: ['**/.nuxt', '**/.nuxt/*'],
          },
        ],

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
        'import-x/no-unresolved': [
          'error',
          {
            ignore: [
              '^#build',
              // Ignore these as they may not be found when in dev-mode/using stubs.
              '@laioutr-core/frontend-core/runtime',
              '^@laioutr-core/canonical-types',
              '^@laioutr-core/orchestr/',
              '@laioutr-core/ui', // unocss config is not available in stubs
              '@laioutr-core/ui-kit', // unocss config is not available in stubs
              'json-schema', // @types only import, not an actual module
            ],
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
        ...nuxtModuleRules(),
        ...oclifRules(),
      },
    },
    {
      /** Playground files have same configuration as nuxt-apps */
      files: ['**/playground/**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx,vue}'],
      rules: {
        // Console-statements are allowed in playgrounds
        'no-console': 'off',
      },
    },
    eslintConfigPrettier
  );
};
