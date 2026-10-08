import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const hostname = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto') || 'http';

  // Skip local/dev and preview hosts where www/https enforcement would break them.
  const isLocal =
    hostname === 'localhost' ||
    hostname.startsWith('127.') ||
    hostname.startsWith('192.168.') ||
    hostname.endsWith('.local');

  if (!isLocal) {
    const hasWww = hostname.startsWith('www.');
    const isHttps = proto === 'https';

    if (!hasWww || !isHttps) {
      const newHost = hasWww ? hostname : `www.${hostname}`;
      const url = new URL(`https://${newHost}${nextUrl.pathname}${nextUrl.search}`);
      return NextResponse.redirect(url, 308);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
