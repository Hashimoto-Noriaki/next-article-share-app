export type NotificationType = 'like' | 'comment';

export type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  userId: string;
  senderId?: string | null;
  articleId?: string | null;
  createdAt: string;
};

export type NotificationWithRelations = Notification & {
  sender?: {
    id: string;
    name: string | null;
    image?: string | null;
  } | null;
  article?: {
    id: string;
    title: string;
  } | null;
};
