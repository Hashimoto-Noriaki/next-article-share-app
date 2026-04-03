import { prisma } from '@/lib/prisma';

export const notificationRepository = {
  findManyByUserId: async (userId: string) => {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        sender: { select: { id: true, name: true, image: true } },
        article: { select: { id: true, title: true } },
      },
    });
  },

  markAllAsRead: async (userId: string) => {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  },

  findById: async (notificationId: string) => {
    return prisma.notification.findUnique({
      where: { id: notificationId },
    });
  },

  markAsRead: async (notificationId: string) => {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  },
};
