import { prisma } from '@/lib/prisma';

export const userRepository = {
  findById: async (userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        articles: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  },
  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  create: async (data: { name: string; email: string; password: string }) => {
    return prisma.user.create({ data });
  },

  updatePassword: async (userId: string, hashedPassword: string) => {
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  },
};
