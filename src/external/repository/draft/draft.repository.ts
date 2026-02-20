import { prisma } from '@/lib/prisma'

export const draftRepository = {
    findByUser: async (userId: string) => {
    return prisma.article.findMany({
      where: { authorId: userId, isDraft: true },
      orderBy: { updatedAt: 'desc' },
    })
}
}
