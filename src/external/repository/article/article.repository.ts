import { prisma } from '@/lib/prisma';

const PER_PAGE = 12;

export const articleRepository = {
  findPublished: async (userId: string) => {
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where: { isDraft: false },
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { name: true, image: true },
          },
          ...(userId && {
            likes: {
              where: { userId },
              select: { id: true },
            },
          }),
        },
        take: PER_PAGE,
      }),
      prisma.article.count({
        where: { isDraft: false },
      }),
    ]);
    return { articles, total, perPage: PER_PAGE };
  },
  findById: async ({
    articleId,
    userId,
  }: {
    articleId: string;
    userId: string;
  }) => {
    return prisma.article.findUnique({
      where: { id: articleId },
      include: {
        author: { select: { id: true, name: true } },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, name: true } } },
        },
        ...(userId && {
          likes: { where: { userId }, select: { id: true } },
          stocks: { where: { userId }, select: { id: true } },
        }),
      },
    });
  },
};
