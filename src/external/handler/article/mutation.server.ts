import { prisma } from '@/external/repository/client';
import { createNotification } from '@/external/service/notification';
import { articleRepository } from '@/external/repository/article';
import { createArticleSchema } from '@/shared/lib/validations/article';
import {
  draftArticleSchema,
  DRAFT_LIMIT,
} from '@/shared/lib/validations/draft';

export async function likeHandler({
  articleId,
  userId,
}: {
  articleId: string;
  userId: string;
}) {
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article) return { success: false, error: '記事が見つかりません' };
  if (article.authorId === userId)
    return { success: false, error: '自分の記事にはいいねできません' };

  const existingLike = await prisma.like.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
  if (existingLike) return { success: false, error: '既にいいね済みです' };

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

  return { success: true };
}

export async function unlikeHandler({
  articleId,
  userId,
}: {
  articleId: string;
  userId: string;
}) {
  const existingLike = await prisma.like.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
  if (!existingLike) return { success: false, error: 'いいねしていません' };

  await prisma.$transaction([
    prisma.like.delete({
      where: { userId_articleId: { userId, articleId } },
    }),
    prisma.article.update({
      where: { id: articleId },
      data: { likeCount: { decrement: 1 } },
    }),
  ]);

  return { success: true };
}

export async function stockHandler({
  articleId,
  userId,
}: {
  articleId: string;
  userId: string;
}) {
  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) return { success: false, error: '記事が見つかりません' };

  const existingStock = await prisma.stock.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
  if (existingStock) return { success: false, error: '既にストック済みです' };

  await prisma.stock.create({ data: { userId, articleId } });

  return { success: true };
}

export async function unstockHandler({
  articleId,
  userId,
}: {
  articleId: string;
  userId: string;
}) {
  const existingStock = await prisma.stock.findUnique({
    where: { userId_articleId: { userId, articleId } },
  });
  if (!existingStock) return { success: false, error: 'ストックしていません' };

  await prisma.stock.delete({
    where: { userId_articleId: { userId, articleId } },
  });

  return { success: true };
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
}) {
  // 下書き上限チェック
  if (isDraft) {
    const draftCount = await articleRepository.countDraftsByUser(userId);
    if (draftCount >= DRAFT_LIMIT) {
      return {
        success: false as const,
        error: `下書きが上限（${DRAFT_LIMIT}件）になりました。この機会に投稿してみませんか？`,
      };
    }
  }

  // バリデーション
  const schema = isDraft ? draftArticleSchema : createArticleSchema;
  const parsed = schema.safeParse({ title, content, tags, isDraft });
  if (!parsed.success) {
    return { success: false as const, errors: parsed.error.issues };
  }

  const article = await articleRepository.create({
    title: parsed.data.title || '',
    content: parsed.data.content || '',
    tags: parsed.data.tags || [],
    isDraft: parsed.data.isDraft ?? false,
    authorId: userId,
  });

  return { success: true as const, article };
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
}) {
  const existing = await articleRepository.findAuthorById(articleId);
  if (!existing) {
    return { success: false as const, error: '記事が見つかりません' };
  }
  if (existing.authorId !== userId) {
    return { success: false as const, error: '編集権限がありません' };
  }

  const schema = isDraft ? draftArticleSchema : createArticleSchema;
  const parsed = schema.safeParse({ title, content, tags, isDraft });
  if (!parsed.success) {
    return { success: false as const, errors: parsed.error.issues };
  }

  const article = await articleRepository.update(articleId, {
    title: parsed.data.title || '',
    content: parsed.data.content || '',
    tags: parsed.data.tags || [],
    isDraft: parsed.data.isDraft ?? false,
  });

  return { success: true as const, article };
}

export async function deleteArticleHandler({
  articleId,
  userId,
}: {
  articleId: string;
  userId: string;
}) {
  const existing = await articleRepository.findAuthorById(articleId);
  if (!existing) {
    return { success: false as const, error: '記事が見つかりません' };
  }
  if (existing.authorId !== userId) {
    return { success: false as const, error: '削除権限がありません' };
  }

  await articleRepository.delete(articleId);
  return { success: true as const };
}
