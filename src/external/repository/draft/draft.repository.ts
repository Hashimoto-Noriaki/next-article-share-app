import { prisma } from '@/lib/prisma';

export const draftRepository = {
  findByUser: async (userId: string) => {
    return prisma.article.findMany({
      where: { authorId: userId, isDraft: true },
      orderBy: { updatedAt: 'desc' },
    });
  },
  findManyByUserId: async (userId: string) => {
    return prisma.article.findMany({
      where: { authorId: userId, isDraft: true },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  delete: async (draftId: string) => {
    return prisma.article.delete({
      where: { id: draftId },
    });
  },

  findById: async (draftId: string) => {
    return prisma.article.findUnique({
      where: { id: draftId },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        isDraft: true,
        authorId: true,
      },
    });
  },
};
