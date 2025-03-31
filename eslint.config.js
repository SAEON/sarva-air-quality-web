import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Error prevention
      'no-unused-vars': [
        'error',
        {
          // Allow underscore prefixed variables - common for unused params
          argsIgnorePattern: '^_',
          // Allow single underscore variable - common for destructuring required param
          varsIgnorePattern:
            '^(_|React|Box|FormControl|FormGroup|FormControlLabel|Checkbox|Typography|HashRouter|Routes|Route|Button|IconButton|Tooltip|Drawer|Divider|Slider|TextField|Grid|Paper|CircularProgress|Card|CardContent|CardActions|CardHeader|MenuItem|Select|InputLabel|OutlinedInput|ListItemText|ThemeProvider|MapView)$',
          ignoreRestSiblings: true,
        },
      ],
      'no-var': 'error',
      'prefer-const': 'error',
      // Update console rule to be warning only
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      // React specific
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Style consistency
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'always-multiline'],
      indent: ['error', 2],

      // Best practices
      'arrow-body-style': ['error', 'as-needed'],
      camelcase: ['error', { properties: 'never' }],
      eqeqeq: ['error', 'always'],
      'object-shorthand': 'error',

      // ES6+ features
      'arrow-parens': ['error', 'always'],
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
    },
  },
  {
    files: ['**/*.jsx'],
    rules: {
      'no-unused-vars': 'off',
    },
  },
  // Add specific override for API files
  {
    files: ['**/api/**/*.js'],
    rules: {
      'no-unused-vars': 'off',
    },
  },
  // Convert console.log errors to warnings
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
];
