//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    ignores: [
      'src/components/ui/**',
      'src/components/ui/',
      '**/ui/**',
      'eslint.config.js',
      'prettier.config.js',
      'vite.config.ts',
      'tsconfig.json',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  },
]
