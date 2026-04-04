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
  findAuthorById: async (articleId: string) => {
    return prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true, authorId: true },
    });
  },
  findByIdForEdit: async (articleId: string) => {
    return prisma.article.findUnique({
      where: { id: articleId },
      include: {
        author: { select: { id: true, name: true } },
      },
    });
  },
  searchPublished: async ({
    query,
    page,
    perPage,
  }: {
    query: string;
    page: number;
    perPage: number;
  }) => {
    const skip = (page - 1) * perPage;
    const where = {
      isDraft: false,
      OR: [
        { title: { contains: query, mode: 'insensitive' as const } },
        { tags: { has: query } },
      ],
    };
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } } },
        skip,
        take: perPage,
      }),
      prisma.article.count({ where }),
    ]);
    return { articles, total };
  },
  create: async (data: {
    title: string;
    content: string;
    tags: string[];
    isDraft: boolean;
    authorId: string;
  }) => {
    return prisma.article.create({ data });
  },
  update: async (
    articleId: string,
    data: {
      title: string;
      content: string;
      tags: string[];
      isDraft: boolean;
    },
  ) => {
    return prisma.article.update({
      where: { id: articleId },
      data,
    });
  },
  delete: async (articleId: string) => {
    return prisma.article.delete({
      where: { id: articleId },
    });
  },
  // 下書き数カウント（上限チェック用）
  countDraftsByUser: async (userId: string) => {
    return prisma.article.count({
      where: { authorId: userId, isDraft: true },
    });
  },
};
