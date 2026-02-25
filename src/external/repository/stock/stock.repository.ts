import { prisma } from '@/lib/prisma';

export const stockRepository = {
  findByUser: async (userId: string) => {
    return prisma.stock.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        article: {
          include: {
            author: { select: { name: true } },
          },
        },
      },
    });
  },
};
