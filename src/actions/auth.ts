'use server';

import { signOut } from '@/external/auth';

export async function logout() {
  await signOut({ redirectTo: '/login' });
}
