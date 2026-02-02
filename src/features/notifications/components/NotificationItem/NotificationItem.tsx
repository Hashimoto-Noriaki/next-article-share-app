'use client';

import Link from 'next/link';
import Image from 'next/image';
import { NotificationWithRelations } from '@/types';
import { timeAgo } from '@/utils';
import { AiFillHeart } from 'react-icons/ai';
import { FaComment } from 'react-icons/fa';

type Props = {
  notification: NotificationWithRelations;
  onClose: () => void;
  onRead: () => void;
};

export function NotificationItem({ notification, onClose, onRead }: Props) {
  const handleClick = () => {
    if (!notification.isRead) {
      onRead();
    }
    onClose();
  };

  return (
    <Link
      href={
        notification.articleId ? `/articles/${notification.articleId}` : '#'
      }
      onClick={handleClick} // 変更
      className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${
        !notification.isRead ? 'bg-cyan-50' : ''
      }`}
    >
      {/* 送信者アイコン */}
      <div className="relative shrink-0">
        {notification.sender?.image ? (
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={notification.sender.image}
              alt={notification.sender.name || ''}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
            {notification.sender?.name?.charAt(0) || '?'}
          </div>
        )}
        {/* 通知タイプアイコン */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-white border border-gray-200">
          {notification.type === 'like' ? (
            <AiFillHeart className="w-3 h-3 text-red-500" />
          ) : (
            <FaComment className="w-3 h-3 text-cyan-500" />
          )}
        </div>
      </div>
      {/* 通知内容 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-1">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
    </Link>
  );
}
