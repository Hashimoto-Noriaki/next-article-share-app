import { auth } from '@/external/auth';

/**
 * API Route で現在のユーザーIDを取得
 * 未認証の場合は null を返す
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id || null;
}

/**
 * API Route で認証を必須にする
 * 未認証の場合は 401 レスポンスを返す
 */
export async function requireAuth(): Promise<{ userId: string } | Response> {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ message: '認証が必要です' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return { userId: session.user.id };
}
