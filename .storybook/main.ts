import type { StorybookConfig } from '@storybook/nextjs';
import type { Configuration } from 'webpack';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config: Configuration) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        // pg / Prisma が依存する Node.js 組み込みモジュールをブラウザビルドで無効化
        net: false,
        tls: false,
        fs: false,
        dns: false,
        child_process: false,
      },
    };
    return config;
  },
};
export default config;
