'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useDropdown } from '@/shared/hooks';

type Props = {
  userId: string;
  userName: string;
  userImage?: string | null;
};

export function UserDropdown({ userId, userName, userImage }: Props) {
  const { isOpen, ref, toggle, close } = useDropdown();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        className="flex items-center gap-2 hover:opacity-80 transition font-bold"
      >
        {userImage ? (
          <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image
              src={userImage}
              alt={userName}
              fill
              className="object-cover pointer-events-none"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
            {userName?.charAt(0) || '?'}
          </div>
        )}
        <span className="hidden sm:inline">{userName}</span>
        <span>▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <ul className="py-2 text-gray-700 font-bold">
            <li>
              <Link
                href={`/users/${userId}`}
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={close}
              >
                プロフィール
              </Link>
            </li>
            <li>
              <Link
                href="/settings/profile"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={close}
              >
                設定
              </Link>
            </li>
            <li>
              <Link
                href="/drafts"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={close}
              >
                下書き一覧
              </Link>
            </li>
            <li>
              <Link
                href="/stocks"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={close}
              >
                ストックリスト
              </Link>
            </li>
            <li className="border-t">
              <Link
                href="/settings/withdraw"
                className="block px-4 py-2 hover:bg-gray-100 text-red-500"
                onClick={close}
              >
                退会
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
