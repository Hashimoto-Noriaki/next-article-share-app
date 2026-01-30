'use client';

import Link from 'next/link';
import { NotificationWithRelations } from '@/types';
import { timeAgo } from '@/utils';

type Props = {
  notification: NotificationWithRelations;
  onClose: () => void;
};

export function NotificationItem({ notification, onClose }: Props) {
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
