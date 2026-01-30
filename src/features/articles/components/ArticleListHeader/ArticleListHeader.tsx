'use client';

import Link from 'next/link';
import { logout } from '@/actions/auth';
import { NotificationBell } from '@/features/notifications/components';
import { UserDropdown } from '../UserDropdown';

type Props = {
  userId: string;
  userName: string;
};

export function ArticleListHeader({ userId, userName }: Props) {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-linear-to-br from-cyan-500 to-cyan-600 h-[15vh] p-3">
      <div className="flex justify-between">
        <div className="font-bold">
          <h1 className="text-3xl text-amber-500 mb-5">
            テックブログ共有アプリ
          </h1>
          <p className="text-white text-2xl">
            エンジニア同士で有益な記事を共有しよう
          </p>
        </div>
        <nav>
          <ul className="flex gap-5 text-white text-lg font-bold p-10">
            <li>
              <Link href="/tutorial" className="hover:text-amber-400">
                利用説明
              </Link>
            </li>
            <li>
              <Link href="/articles/new" className="hover:text-amber-400">
                新規投稿
              </Link>
            </li>
            <li>
              <NotificationBell />
            </li>
            <li>
              <UserDropdown userId={userId} userName={userName} />
            </li>
            <li>
              <button onClick={handleLogout} className="hover:text-amber-400">
                ログアウト
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
