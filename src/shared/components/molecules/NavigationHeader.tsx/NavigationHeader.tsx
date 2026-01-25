'use client';

import Link from 'next/link';
import { UserDropdown } from '../../../../features/articles/components/UserDropdown';

type Props = {
  userId: string;
  userName: string;
};

export function NavigationHeader({ userId, userName }: Props) {
  return (
    <nav className="flex  items-center gap-8 text-white font-bold">
      <Link href="/articles/new" className="hover:text-amber-400">
        新規投稿
      </Link>
      <UserDropdown
        userId={userId}
        userName={userName}
        className="hover:text-amber-400"
      />
    </nav>
  );
}
