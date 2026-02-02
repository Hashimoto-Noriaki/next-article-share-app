'use client';

import { AiOutlineBell } from 'react-icons/ai';
import { NotificationItem } from '../NotificationItem';
import { useNotifications } from '../../hooks';

export function NotificationBell() {
  const {
    isOpen,
    ref,
    notifications,
    isLoading,
    unreadCount,
    handleToggle,
    markAllAsRead,
    markAsRead,
    close,
  } = useNotifications();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        className="relative p-2 hover:text-amber-400"
      >
        <AiOutlineBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-20 border border-gray-200">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
            <h3 className="font-bold text-gray-800">通知</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-cyan-600 hover:text-cyan-800"
              >
                全て既読にする
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <p className="px-4 py-3 text-sm text-gray-500">読み込み中...</p>
            ) : notifications.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-500">
                通知はありません
              </p>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClose={close}
                  onRead={() => markAsRead(notification.id)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
