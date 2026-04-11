import { Page } from '@playwright/test';
import { TestArticle } from './article';

/**
 * 記事を下書き保存する（/articles/new から）
 * 保存後は /drafts にリダイレクトされる
 */
export async function saveDraft(page: Page, article: TestArticle) {
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

  await page.locator('button').filter({ hasText: '下書き保存' }).click();

  await page.waitForURL('/drafts', { timeout: 10000 });
}

/**
 * 下書き一覧から指定タイトルの「編集する」ボタンをクリックして編集ページへ移動する
 */
export async function navigateToDraftEdit(page: Page, title: string) {
  await page.goto('/drafts');

  const draftItem = page.locator('h3').filter({ hasText: title });
  await draftItem
    .locator('../..')
    .locator('button')
    .filter({ hasText: '編集する' })
    .click();

  await page.waitForURL(/\/drafts\/[^/]+\/edit/, { timeout: 10000 });
}
