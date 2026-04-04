import { prisma } from '@/lib/prisma';

export const commentRepository = {
  findManyByArticleId: async (articleId: string) => {
    return prisma.comment.findMany({
      where: { articleId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });
  },

  findById: async (commentId: string) => {
    return prisma.comment.findUnique({
      where: { id: commentId },
    });
  },

  create: async (data: {
    content: string;
    userId: string;
    articleId: string;
  }) => {
    return prisma.comment.create({
      data,
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });
  },

  update: async (commentId: string, content: string) => {
    return prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });
  },

  delete: async (commentId: string) => {
    return prisma.comment.delete({
      where: { id: commentId },
    });
  },
};
