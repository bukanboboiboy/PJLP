import { NextRequest, NextResponse } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes dan static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next();
  }

  const rawCookie = request.cookies.get('dashboard_session')?.value;
  let hasValidSession = false;

  if (rawCookie) {
    try {
      const parsed = JSON.parse(rawCookie);
      hasValidSession = Boolean(parsed?.token && parsed?.user?.numberid);
    } catch {
      hasValidSession = false;
    }
  }

  // Jika belum login dan bukan di halaman login, redirect ke login
  if (!hasValidSession && pathname !== '/login') {
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    if (rawCookie) {
      res.cookies.set('dashboard_session', '', {
        path: '/',
        maxAge: 0,
        expires: new Date(0),
      });
    }
    return res;
  }

  // Jika sudah login dan di halaman login, redirect ke dashboard
  if (hasValidSession && pathname === '/login') {
    const res = NextResponse.redirect(new URL('/', request.url));
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res;
  }

  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  return response;
}