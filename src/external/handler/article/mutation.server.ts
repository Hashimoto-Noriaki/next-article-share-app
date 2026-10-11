import type { Article } from '@prisma/client';
import type { ActionResult } from '@/shared/types/action';
import { ok, fail, validationFail } from '@/shared/lib/action-result';
import { prisma } from '@/external/repository/client';
import { createNotification } from '@/external/service/notification';
import { articleRepository } from '@/external/repository/article';
import { createArticleSchema } from '@/external/dto/article';
import { draftArticleSchema, DRAFT_LIMIT } from '@/external/dto/article';

export async function likeHandler({
  articleId,
  userId,
}: {
  articleId: string;
  userId: string;
}): Promise<ActionResult> {
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article) return fail('記事が見つかりません');
  if (article.authorId === userId)
    return fail('自分の記事にはいいねできません');

  const existingLike = await prisma.like.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
  if (existingLike) return fail('既にいいね済みです');

  await prisma.$transaction([
    prisma.like.create({ data: { userId, articleId } }),
    prisma.article.update({
      where: { id: articleId },
      data: { likeCount: { increment: 1 } },
    }),
  ]);

  await createNotification({
    type: 'like',
    userId: article.authorId,
    senderId: userId,
    articleId,
  });

  return ok();
}

export async function unlikeHandler({
  articleId,
  userId,
}: {
  articleId: string;
  userId: string;
}): Promise<ActionResult> {
  const existingLike = await prisma.like.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
  if (!existingLike) return fail('いいねしていません');

  await prisma.$transaction([
    prisma.like.delete({
      where: { userId_articleId: { userId, articleId } },
    }),
    prisma.article.update({
      where: { id: articleId },
      data: { likeCount: { decrement: 1 } },
    }),
  ]);

  return ok();
}

export async function stockHandler({
  articleId,
  userId,
}: {
  articleId: string;
  userId: string;
}): Promise<ActionResult> {
  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) return fail('記事が見つかりません');

  const existingStock = await prisma.stock.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
  if (existingStock) return fail('既にストック済みです');

  await prisma.stock.create({ data: { userId, articleId } });

  return ok();
}

export async function unstockHandler({
  articleId,
  userId,
}: {
  articleId: string;
  userId: string;
}): Promise<ActionResult> {
  const existingStock = await prisma.stock.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
  if (!existingStock) return fail('ストックしていません');

  await prisma.stock.delete({
    where: { userId_articleId: { userId, articleId } },
  });

  return ok();
}

export async function createArticleHandler({
  title,
  content,
  tags,
  isDraft,
  userId,
}: {
  title: string;
  content: string;
  tags: string[];
  isDraft: boolean;
  userId: string;
}): Promise<ActionResult<Article>> {
  // 下書き上限チェック
  if (isDraft) {
    const draftCount = await articleRepository.countDraftsByUser(userId);
    if (draftCount >= DRAFT_LIMIT) {
      return fail(
        `下書きが上限（${DRAFT_LIMIT}件）になりました。この機会に投稿してみませんか？`,
      );
    }
  }

  // バリデーション
  const schema = isDraft ? draftArticleSchema : createArticleSchema;
  const parsed = schema.safeParse({ title, content, tags, isDraft });
  if (!parsed.success) {
    return validationFail(parsed.error);
  }

  const article = await articleRepository.create({
    title: parsed.data.title || '',
    content: parsed.data.content || '',
    tags: parsed.data.tags || [],
    isDraft: parsed.data.isDraft ?? false,
    authorId: userId,
  });

  return ok(article);
}

export async function updateArticleHandler({
  articleId,
  title,
  content,
  tags,
  isDraft = false,
  userId,
}: {
  articleId: string;
  title: string;
  content: string;
  tags: string[];
  isDraft?: boolean;
  userId: string;
}): Promise<ActionResult<Article>> {
  const existing = await articleRepository.findAuthorById(articleId);
  if (!existing) {
    return fail('記事が見つかりません');
  }
  if (existing.authorId !== userId) {
    return fail('編集権限がありません');
  }

  const schema = isDraft ? draftArticleSchema : createArticleSchema;
  const parsed = schema.safeParse({ title, content, tags, isDraft });
  if (!parsed.success) {
    return validationFail(parsed.error);
  }

  const article = await articleRepository.update(articleId, {
    title: parsed.data.title || '',
    content: parsed.data.content || '',
    tags: parsed.data.tags || [],
    isDraft: parsed.data.isDraft ?? false,
  });

  return ok(article);
}

export async function deleteArticleHandler({
  articleId,
  userId,
}: {
  articleId: string;
  userId: string;
}): Promise<ActionResult> {
  const existing = await articleRepository.findAuthorById(articleId);
  if (!existing) {
    return fail('記事が見つかりません');
  }
  if (existing.authorId !== userId) {
    return fail('削除権限がありません');
  }

  await articleRepository.delete(articleId);
  return ok();
}
