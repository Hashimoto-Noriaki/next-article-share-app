import { prisma } from '@/external/repository/client';

export const passwordResetTokenRepository = {
  deleteByEmail: async (email: string) => {
    return prisma.passwordResetToken.deleteMany({ where: { email } });
  },

  create: async (data: { email: string; token: string; expires: Date }) => {
    return prisma.passwordResetToken.create({ data });
  },

  findByToken: async (token: string) => {
    return prisma.passwordResetToken.findUnique({ where: { token } });
  },

  deleteById: async (id: string) => {
    return prisma.passwordResetToken.delete({ where: { id } });
  },
};
