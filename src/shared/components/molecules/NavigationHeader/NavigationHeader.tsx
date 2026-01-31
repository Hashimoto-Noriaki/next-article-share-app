'use client';

import Link from 'next/link';
import { UserDropdown } from '../../../../features/articles/components/UserDropdown';
import { NotificationBell } from '@/features/notifications/components';

type Props = {
  userId: string;
  userName: string;
};

export function NavigationHeader({ userId, userName }: Props) {
  return (
    <nav className="flex items-center gap-5 text-white font-bold">
      <Link href="/articles/new" className="hover:text-amber-400">
        新規投稿
      </Link>
      <NotificationBell />
      <UserDropdown userId={userId} userName={userName} />
    </nav>
  );
}
