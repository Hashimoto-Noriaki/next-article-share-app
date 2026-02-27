import { userRepository } from '@/external/repository/user';

export async function getUserProfileHandler({ userId }: { userId: string }) {
  const user = await userRepository.findById(userId);
  if (!user) return null;

  return {
    ...user,
    displayName: user.name || '名無し',
    articleCount: user.articles.length,
  };
}
