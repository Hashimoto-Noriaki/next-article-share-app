import { defineConfig } from '@playwright/test';

// CI=false などの文字列でもローカル扱いにするため、'true' と厳密に比較する
const isCI = process.env.CI === 'true';

export default defineConfig({
  testDir: './e2e',
  // ローカルの dev サーバーは初回アクセス時にページをコンパイルするため、CI より長めに待つ
  timeout: isCI ? 30000 : 60000,
  expect: { timeout: isCI ? 5000 : 10000 },
  globalTeardown: './e2e/global-teardown.ts',
  use: {
    baseURL: 'http://localhost:3000',
    // waitForURL / goto の待ち時間。各テストでは timeout を直接書かずにこの値を使う
    navigationTimeout: isCI ? 10000 : 30000,
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
