import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notification';

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
