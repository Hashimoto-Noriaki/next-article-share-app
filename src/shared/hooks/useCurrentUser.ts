'use client';

import { useQuery } from '@tanstack/react-query';
import { getCurrentUserAction } from '@/features/users/actions/user.action';

type User = {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
};

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<User> => {
      const result = await getCurrentUserAction();
      if (!result.success) {
        throw new Error('認証エラー');
      }
      return result.user;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
