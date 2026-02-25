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
};
