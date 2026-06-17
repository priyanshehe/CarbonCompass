import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate a random nonce for script execution
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // Enforce a strict CSP
  // Allow 'unsafe-eval' only in development for Fast Refresh / Hot Module Replacement
  const isDev = process.env.NODE_ENV === 'development';

const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self'";
const cspHeader = `
  default-src 'self';
  ${scriptSrc};
  style-src 'self' 'unsafe-inline';
  img-src * data: blob:;
  font-src * data:;
  connect-src *;
`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('content-security-policy', cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set the CSP header on the response
  response.headers.set('content-security-policy', cspHeader);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-action' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
