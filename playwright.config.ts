import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  globalTeardown: './e2e/global-teardown.ts',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  retries: 1,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'html',
  // CI では本番ビルドを起動してからテストする。ローカルは起動済みの dev サーバーを使う
  webServer: process.env.CI
    ? {
        command: 'npm run build:ci && npm start',
        url: 'http://localhost:3000',
        timeout: 300000,
      }
    : undefined,
});
