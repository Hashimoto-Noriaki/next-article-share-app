'use client';

import Link from 'next/link';
import { NotificationWithRelations } from '@/types';

type Props = {
  notification: NotificationWithRelations;
  onClose: () => void;
};

export function NotificationItem({ notification, onClose }: Props) {
  const timeAgo = (date: string) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}日前`;
    if (hours > 0) return `${hours}時間前`;
    if (minutes > 0) return `${minutes}分前`;
    return 'たった今';
  };

  return (
    <Link
      href={
        notification.articleId ? `/articles/${notification.articleId}` : '#'
      }
      onClick={onClose}
      className={`block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${
        !notification.isRead ? 'bg-cyan-50' : ''
      }`}
    >
      <p className="text-sm text-gray-800">{notification.message}</p>
      <p className="text-xs text-gray-500 mt-1">
        {timeAgo(notification.createdAt)}
      </p>
    </Link>
  );
}
