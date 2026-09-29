// spec: specs/comment.md
// seed: e2e/seed.spec.ts

import { test, expect, Page } from '@playwright/test';
import { createTestUser, signup } from './helpers/auth';
import {
  createTestArticle,
  createArticle,
  navigateToArticle,
} from './helpers/article';

// コメントを投稿し、本文が表示されるまで待つ
async function postComment(page: Page, content: string) {
  await page.getByPlaceholder('コメントを入力...').fill(content);
  await page.getByRole('button', { name: 'コメントする' }).click();
  await expect(page.getByText(content, { exact: true })).toBeVisible();
}

test.describe('コメント機能', () => {
  test('コメントを投稿する', async ({ page }) => {
    // 1. createTestUser() でユーザーを作成し、signup() で新規登録・ログインする
    const userName = 'コメント投稿者';
    await signup(page, createTestUser(userName));

    // 2. createTestArticle() でテスト記事データを作成し、createArticle() で記事を公開する
    const article = createTestArticle();
    await createArticle(page, article);

    // 3. navigateToArticle() で記事詳細ページへ遷移する
    await navigateToArticle(page, article.title);

    // 4. 見出し「コメント (0)」と「コメントはまだありません」が表示されていることを確認する
    await expect(
      page.getByRole('heading', { name: 'コメント (0)' }),
    ).toBeVisible();
    await expect(page.getByText('コメントはまだありません')).toBeVisible();

    // 5. ユニークなコメント本文を用意し、テキストエリアに入力する
    const content = `コメント ${Date.now()}`;
    const input = page.getByPlaceholder('コメントを入力...');
    await input.fill(content);

    // 6. 「コメントする」ボタンをクリックする
    await page.getByRole('button', { name: 'コメントする' }).click();

    // 投稿したコメント本文が表示される
    const comment = page.getByText(content, { exact: true }).locator('..');
    await expect(page.getByText(content, { exact: true })).toBeVisible();
    // 見出しが「コメント (1)」になり、「コメントはまだありません」は消える
    await expect(
      page.getByRole('heading', { name: 'コメント (1)' }),
    ).toBeVisible();
    await expect(page.getByText('コメントはまだありません')).toHaveCount(0);
    // コメント要素内に投稿者名が表示される
    await expect(comment).toContainText(userName);
    // 投稿フォームが空に戻る
    await expect(input).toHaveValue('');
    // 自分のコメントに「編集」「削除」ボタンが表示される
    await expect(comment.getByRole('button', { name: '編集' })).toBeVisible();
    await expect(comment.getByRole('button', { name: '削除' })).toBeVisible();
  });

  test('自分のコメントを編集する', async ({ page }) => {
    // 1. ログインし、記事を公開して詳細ページへ遷移する
    await signup(page, createTestUser());
    const article = createTestArticle();
    await createArticle(page, article);
    await navigateToArticle(page, article.title);

    // ダイアログが表示されないことを確認するため記録する
    const dialogs: string[] = [];
    page.on('dialog', async (dialog) => {
      dialogs.push(dialog.message());
      await dialog.dismiss();
    });

    // 2. ユニークな本文Aを投稿し、表示されるまで待つ
    const contentA = `元コメント ${Date.now()}`;
    await postComment(page, contentA);
    const comment = page.getByText(contentA, { exact: true }).locator('..');

    // 3. 本文Aのコメント要素内の「編集」ボタンをクリックする
    await comment.getByRole('button', { name: '編集' }).click();

    // 4. 編集用テキストエリアに本文Aが入り、「更新」「キャンセル」が表示される
    const editBox = page.getByRole('textbox', {
      name: 'コメント',
      exact: true,
    });
    await expect(editBox).toBeVisible();
    await expect(editBox).toHaveValue(contentA);
    await expect(page.getByRole('button', { name: '更新' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'キャンセル' }),
    ).toBeVisible();

    // 5. 本文Cに書き換え、「キャンセル」ボタンをクリックする
    const contentC = `キャンセル用 ${Date.now()}`;
    await editBox.fill(contentC);
    await page.getByRole('button', { name: 'キャンセル' }).click();

    // 6. 本文Aがそのまま表示されている
    await expect(page.getByText(contentA, { exact: true })).toBeVisible();
    await expect(page.getByText(contentC, { exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: '更新' })).toHaveCount(0);

    // 7. 再度「編集」をクリックし、テキストエリアの値が本文Aに戻っている
    await comment.getByRole('button', { name: '編集' }).click();
    await expect(editBox).toHaveValue(contentA);

    // 8. 本文Bに書き換え、「更新」ボタンを1回だけクリックする
    const contentB = `編集後コメント ${Date.now()}`;
    await editBox.fill(contentB);
    await page.getByRole('button', { name: '更新' }).click();

    // 更新後、本文Bが表示され、本文Aは表示されない
    await expect(page.getByText(contentB, { exact: true })).toBeVisible();
    await expect(page.getByText(contentA, { exact: true })).toHaveCount(0);
    // 編集フォームが閉じ、「編集」「削除」ボタンが再表示される
    await expect(page.getByRole('button', { name: '更新' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'キャンセル' })).toHaveCount(
      0,
    );
    const updated = page.getByText(contentB, { exact: true }).locator('..');
    await expect(updated.getByRole('button', { name: '編集' })).toBeVisible();
    await expect(updated.getByRole('button', { name: '削除' })).toBeVisible();
    // コメント件数は「コメント (1)」のまま
    await expect(
      page.getByRole('heading', { name: 'コメント (1)' }),
    ).toBeVisible();
    // ダイアログは表示されない
    expect(dialogs).toEqual([]);
  });

  test('自分のコメントを削除する（確認ダイアログあり）', async ({ page }) => {
    // 1. ログインし、記事を公開して詳細ページへ遷移する
    await signup(page, createTestUser());
    const article = createTestArticle();
    await createArticle(page, article);
    await navigateToArticle(page, article.title);

    // 2. ユニークなコメント本文を投稿し、表示されるまで待つ
    const content = `削除するコメント ${Date.now()}`;
    await postComment(page, content);

    // 3. ボタンをクリックする前に、dismiss するダイアログハンドラを登録する
    let dialogType = '';
    let dialogMessage = '';
    page.once('dialog', async (dialog) => {
      dialogType = dialog.type();
      dialogMessage = dialog.message();
      await dialog.dismiss();
    });

    // 4. section 内の「削除」ボタンをクリックする（記事本体の「削除」と区別するため）
    const deleteButton = page
      .locator('section')
      .getByRole('button', { name: '削除' });
    await deleteButton.click();

    // 5. コメント本文が残り、見出しが「コメント (1)」のまま
    expect(dialogType).toBe('confirm');
    expect(dialogMessage).toBe('コメントを削除しますか？');
    await expect(page.getByText(content, { exact: true })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'コメント (1)' }),
    ).toBeVisible();

    // 6. accept するハンドラを登録し、同じ「削除」ボタンをクリックする
    page.once('dialog', (dialog) => dialog.accept());
    await deleteButton.click();

    // 本文が消え、見出しが「コメント (0)」になり、「コメントはまだありません」が表示される
    await expect(page.getByText(content, { exact: true })).toHaveCount(0);
    await expect(
      page.getByRole('heading', { name: 'コメント (0)' }),
    ).toBeVisible();
    await expect(page.getByText('コメントはまだありません')).toBeVisible();
  });

  test('他人のコメントには編集・削除ボタンが表示されない', async ({
    page,
    browser,
  }) => {
    // 1. browser.newContext() で投稿者用のコンテキストとページを作る
    const authorContext = await browser.newContext();
    const authorPage = await authorContext.newPage();

    // 2. 投稿者用ページで、ユーザーを作成し新規登録・ログインする
    await signup(authorPage, createTestUser('投稿者'));

    // 3. 投稿者用ページで記事を公開する
    const article = createTestArticle();
    await createArticle(authorPage, article);

    // 4. 投稿者用ページで記事詳細へ遷移し、コメントを投稿する
    await navigateToArticle(authorPage, article.title);
    const authorContent = `1件目のコメント ${Date.now()}`;
    await postComment(authorPage, authorContent);

    // 5. 投稿者用ページで、コメント要素内に「編集」「削除」が表示されている
    const authorsOwnView = authorPage
      .getByText(authorContent, { exact: true })
      .locator('..');
    await expect(
      authorsOwnView.getByRole('button', { name: '編集' }),
    ).toBeVisible();
    await expect(
      authorsOwnView.getByRole('button', { name: '削除' }),
    ).toBeVisible();

    // 6. 投稿者用のコンテキストを閉じる
    await authorContext.close();

    // 7. テストの page で、閲覧者ユーザーを作成し新規登録・ログインする
    await signup(page, createTestUser('閲覧者'));

    // 8. 同じ記事の詳細ページへ遷移する
    await navigateToArticle(page, article.title);

    // 9. 投稿者のコメント本文と投稿者名が表示されている
    await expect(page.getByText(authorContent, { exact: true })).toBeVisible();
    const authorComment = page
      .getByText(authorContent, { exact: true })
      .locator('..');
    await expect(authorComment).toContainText('投稿者');

    // 10. 投稿者のコメント要素内に「編集」「削除」ボタンが存在しない
    await expect(
      authorComment.getByRole('button', { name: '編集' }),
    ).toHaveCount(0);
    await expect(
      authorComment.getByRole('button', { name: '削除' }),
    ).toHaveCount(0);
    // 記事著者ではないので、section の外の記事本体にも「編集」「削除」は表示されない
    await expect(
      page.locator('article').getByRole('link', { name: '編集' }),
    ).toHaveCount(0);
    await expect(
      page.locator('article').getByRole('button', { name: '削除' }),
    ).toHaveCount(0);

    // 11. 閲覧者が自分のコメントを投稿し、自分のコメントにのみボタンが表示される
    const viewerContent = `2件目のコメント ${Date.now()}`;
    await postComment(page, viewerContent);
    const viewerComment = page
      .getByText(viewerContent, { exact: true })
      .locator('..');
    await expect(
      viewerComment.getByRole('button', { name: '編集' }),
    ).toBeVisible();
    await expect(
      viewerComment.getByRole('button', { name: '削除' }),
    ).toBeVisible();
    await expect(
      authorComment.getByRole('button', { name: '編集' }),
    ).toHaveCount(0);
    await expect(
      authorComment.getByRole('button', { name: '削除' }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('heading', { name: 'コメント (2)' }),
    ).toBeVisible();
  });
});
