'use client';

import { useState } from 'react';
import Link from 'next/link';

type Props = {
  userId: string;
  userName: string;
};

export function UserDropdown({ userId, userName }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:text-amber-400"
      >
        {userName} ▼
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <ul className="py-2 text-gray-700">
            <li>
              <Link
                href={`/users/${userId}`}
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                プロフィール
              </Link>
            </li>
            <li>
              <Link
                href="/settings/profile"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                設定
              </Link>
            </li>
            <li>
              <Link
                href="/drafts"
                className="block px-4 py-2 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                下書き一覧
              </Link>
            </li>
            <li>
              <span className="block px-4 py-2 text-gray-400">
                ストックした記事
              </span>
            </li>
            <li className="border-t">
              <Link
                href="/settings/withdraw"
                className="block px-4 py-2 hover:bg-gray-100 text-red-500"
                onClick={() => setIsOpen(false)}
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
