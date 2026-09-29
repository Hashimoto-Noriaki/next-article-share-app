import { defineConfig } from '@playwright/test';

// CI=false などの文字列でもローカル扱いにするため、'true' と厳密に比較する
const isCI = process.env.CI === 'true';

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
  reporter: isCI ? [['html', { open: 'never' }], ['github']] : 'html',
  // CI では本番ビルドを起動してからテストする。ローカルは起動済みの dev サーバーを使う
  webServer: isCI
    ? {
        command: 'npm run build:ci && npm start',
        url: 'http://localhost:3000',
        timeout: 300000,
      }
    : undefined,
});
