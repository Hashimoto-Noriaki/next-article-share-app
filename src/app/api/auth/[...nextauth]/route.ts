/**
 * NextAuth.js API Route
 *
 * [...nextauth] はキャッチオールルート
 * /api/auth/* へのすべてのリクエストがここに来る
 *
 * 例:
 * - GET  /api/auth/session  → セッション取得
 * - POST /api/auth/signin   → ログイン
 * - POST /api/auth/signout  → ログアウト
 * - GET  /api/auth/callback/github → OAuth コールバック
 */

import { handlers } from '@/external/auth';

export const { GET, POST } = handlers;
