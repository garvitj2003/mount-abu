import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // --- VULNERABILITY FIX: Improper Error Handling ---
  // The report (Page 4) showed that TRACE requests cause a 500 Server Error.
  // We explicitly block TRACE and TRACK methods to return a 405.
  if (request.method === 'TRACE' || request.method === 'TRACK') {
    return new NextResponse(null, { status: 405, statusText: 'Method Not Allowed' });
  }

  const nonce = crypto.randomUUID();

  // --- VULNERABILITY FIX: Content Security Policy ---
  // Removed 'upgrade-insecure-requests' to allow running on private HTTP IP.
  // Added 'frame-ancestors' to prevent Clickjacking.
  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    connect-src 'self'; 
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set the CSP header on the response
  response.headers.set('Content-Security-Policy', csp);
  
  // Security headers to prevent sniffing and clickjacking
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // --- VULNERABILITY FIX: Known Vulnerable Component ---
  // The report (Page 2) flagged version disclosure. 
  // We remove the 'X-Powered-By' header to hide "Next.js".
  response.headers.delete('X-Powered-By');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};