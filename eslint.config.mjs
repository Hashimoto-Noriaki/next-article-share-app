// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const require = createRequire(import.meta.url);
const localRules = require('./eslint-local-rules.js');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  ...storybook.configs['flat/recommended'],
  {
    plugins: {
      'local-rules': { rules: localRules },
    },
    rules: {
      'local-rules/restrict-service-imports': 'error',
      'local-rules/restrict-action-imports': 'error',
      'local-rules/use-client-check': 'error',
    },
  },
];

export default eslintConfig;
