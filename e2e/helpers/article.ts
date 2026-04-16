import { Page } from '@playwright/test';

export interface TestArticle {
  title: string;
  tags: string;
  body: string;
}

/**
 * ユニークなテスト記事データを生成する
 */
export function createTestArticle(suffix = ''): TestArticle {
  const id = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  return {
    title: `テスト記事 ${suffix || id}`,
    tags: 'test playwright',
    body: `## テスト本文\n\nこれはe2eテスト用の記事です。ID: ${id}`,
  };
}

/**
 * 記事を投稿する（/articles/new から公開）
 * 投稿後は /articles にリダイレクトされる
 */
export async function createArticle(page: Page, article: TestArticle) {
  await page.goto('/articles/new');

  await page.getByPlaceholder('タイトルを入力してください').fill(article.title);
  await page
    .getByPlaceholder(
      'タグを入力してください。スペース区切りで5つまで入力できます。',
    )
    .fill(article.tags);
  await page
    .getByPlaceholder('エンジニアに関わる知識をMarkdown記法で書いて共有しよう')
    .fill(article.body);

  await page.locator('button').filter({ hasText: '公開設定へ' }).click();

  await page.waitForURL('/articles', { timeout: 10000 });
}

/**
 * 記事一覧から記事タイトルをクリックして詳細ページへ移動する
 */
export async function navigateToArticle(page: Page, title: string) {
  await page.goto('/articles');
  await page.getByText(title).first().click();
  await page.waitForURL(/\/articles\/[^/]+$/, { timeout: 10000 });
}
