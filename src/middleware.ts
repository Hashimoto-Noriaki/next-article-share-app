import { middlewareAuth } from '@/external/auth/auth.config';

export default middlewareAuth;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
