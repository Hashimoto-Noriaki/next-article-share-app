import { prisma } from './prisma';

type CreateNotificationParams = {
  type: 'like' | 'comment';
  userId: string;
  senderId: string;
  articleId?: string;
};

export async function createNotification({
  type,
  userId,
  senderId,
  articleId,
}: CreateNotificationParams) {
  // 自分自身への通知は作成しない
  if (userId === senderId) return;

  const sender = await prisma.user.findUnique({
    where: { id: senderId },
    select: { name: true },
  });

  const senderName = sender?.name || '名無し';

  let message = '';
  switch (type) {
    case 'like':
      message = `${senderName}さんがあなたの記事にいいねしました`;
      break;
    case 'comment':
      message = `${senderName}さんがあなたの記事にコメントしました`;
      break;
  }

  await prisma.notification.create({
    data: {
      type,
      message,
      userId,
      senderId,
      articleId,
    },
  });
}
