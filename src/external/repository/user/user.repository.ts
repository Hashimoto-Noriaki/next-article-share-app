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
  // プロフィール画面用
  findProfileById: async (userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        articles: {
          where: { isDraft: false },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            tags: true,
            likeCount: true,
            createdAt: true,
          },
        },
      },
    });
  },

  findMe: async (userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, image: true },
    });
  },

  updateProfile: async (
    userId: string,
    data: { name: string; email: string },
  ) => {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true },
    });
  },

  updateImage: async (userId: string, image: string) => {
    return prisma.user.update({
      where: { id: userId },
      data: { image },
    });
  },

  delete: async (userId: string) => {
    return prisma.user.delete({ where: { id: userId } });
  },
};
