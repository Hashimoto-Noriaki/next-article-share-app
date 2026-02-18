import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/external/auth';

export async function AuthenticatedLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return <>{children}</>;
}
