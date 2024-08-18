import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

export default tseslint.config(
  pluginReact.configs.flat.recommended,
  { ignores: ['dist'] },
  {
    rules: {
      'react/boolean-prop-naming': ['error', { validateNested: true }],
      'react/checked-requires-onchange-or-readonly': 'error',
      'react/destructuring-assignment': ['error', 'always'],
      'react/forbid-dom-props': 'error',
      'react/forbid-elements': 'error',
      'react/forbid-foreign-prop-types': 'error',
      'react/forbid-prop-types': 'error',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/hook-use-state': 'error',
      'react/iframe-missing-sandbox': 'error',
      'react/jsx-child-element-spacing': 'error',
      'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-handler-names': 'error',
      'react/jsx-max-depth': ['error', { max: 4 }],
      'react/jsx-no-bind': ['error', { allowArrowFunctions: true }],
      'react/jsx-no-constructed-context-values': 'error',
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['coerce', 'ternary'] }],
      'react/jsx-no-target-blank': ['error', { enforceDynamicLinks: 'always' }],
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-one-expression-per-line': ['error', { allow: 'single-child' }],
      'react/jsx-props-no-multi-spaces': 'error',
      'react/jsx-sort-props': ['error', { callbacksLast: true, shorthandFirst: true, ignoreCase: true }],
      'react/jsx-wrap-multilines': [
        'error',
        {
          declaration: 'parens-new-line',
          assignment: 'parens-new-line',
          return: 'parens-new-line',
          arrow: 'parens-new-line',
          condition: 'parens-new-line',
          logical: 'parens-new-line',
          prop: 'parens-new-line',
        },
      ],
      'react/no-adjacent-inline-elements': 'error',
      'react/no-arrow-function-lifecycle': 'error',
      'react/no-invalid-html-attribute': 'error',
      'react/no-multi-comp': ['error', { ignoreStateless: true }],
      'react/no-object-type-as-default-prop': 'error',
      'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
      'react/no-unused-class-component-methods': 'error',
      'react/prefer-exact-props': 'error',
      'react/sort-comp': [
        'error',
        {
          order: [
            'static-variables',
            'static-methods',
            'instance-variables',
            'lifecycle',
            'getters',
            'setters',
            'instance-methods',
            'everything-else',
            'rendering',
          ],
          groups: {
            rendering: ['^render.+$', 'render'],
          },
        },
      ],
      'react/sort-default-props': ['error', { ignoreCase: true }],
      'react/sort-prop-types': ['error', { callbacksLast: true, requiredFirst: true, ignoreCase: true }],
      'react/state-in-constructor': ['error', 'always'],
      'react/static-property-placement': ['error', 'property assignment'],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-sort-props': 'off',
      'react/display-name': 'off',
      'react/jsx-handler-names': 'off',
    },
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
);
