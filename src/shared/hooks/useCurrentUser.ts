import { useQuery } from '@tanstack/react-query';

type User = {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
};

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<User> => {
      const res = await fetch('/api/users/me');
      if (!res.ok) {
        throw new Error('認証エラー');
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5分キャッシュ
    retry: false,
  });
}
