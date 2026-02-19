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
};
