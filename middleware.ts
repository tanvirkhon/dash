import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/login'];

export function middleware(request: NextRequest) {
  // Always allow access by just returning next()
  return NextResponse.next();

  // For development, skip auth checks
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next();
  }

  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);
  const token = request.cookies.get('session');

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};