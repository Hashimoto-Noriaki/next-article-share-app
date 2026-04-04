import { commentRepository } from '@/external/repository/comment';

export async function getCommentsByArticleIdServer(articleId: string) {
  try {
    const comments = await commentRepository.findManyByArticleId(articleId);
    return { success: true as const, comments };
  } catch (error) {
    console.error('コメント取得エラー:', error);
    return { success: false as const, error: 'コメントの取得に失敗しました' };
  }
}
