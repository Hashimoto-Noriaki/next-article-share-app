import { NextRequest, NextResponse } from 'next/server';

// 認証が必要なパス
const protectedPaths = ['/articles', '/tutorial'];

// 未認証ユーザー向けパス
const authPaths = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 認証が必要なパスにアクセス
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ログイン済みで認証ページにアクセス
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/articles', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
