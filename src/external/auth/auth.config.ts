import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';

/**
 * Edge Runtime 互換の設定（Prisma を含まない）
 */
export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const protectedPaths = ['/articles', '/tutorial'];
      const authPaths = ['/login', '/signup'];

      const isProtected = protectedPaths.some((path) =>
        pathname.startsWith(path),
      );
      const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

      if (isProtected && !isLoggedIn) {
        return false;
      }

      if (isAuthPath && isLoggedIn) {
        return Response.redirect(new URL('/articles', nextUrl));
      }

      return true;
    },
  },
};

/**
 * middleware 専用の auth
 * Edge Runtime で動作する
 */
export const { auth: middlewareAuth } = NextAuth(authConfig);
