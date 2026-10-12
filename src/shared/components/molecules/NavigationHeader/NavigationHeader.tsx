import type { ReactNode } from 'react';
import Link from 'next/link';
import { UserDropdown } from '../UserDropdown';

type Props = {
  userId: string;
  userName: string;
  userImage?: string | null;
  actions?: ReactNode;
  showNewArticleLink?: boolean;
  as?: 'nav' | 'div';
};

export function NavigationHeader({
  userId,
  userName,
  userImage,
  actions,
  showNewArticleLink = true,
  as: Component = 'nav',
}: Props) {
  return (
    <Component className="flex items-center gap-5 text-white font-bold">
      {showNewArticleLink && (
        <Link href="/articles/new" className="hover:text-amber-400">
          新規投稿
        </Link>
      )}
      {actions}
      <UserDropdown userId={userId} userName={userName} userImage={userImage} />
    </Component>
  );
}
