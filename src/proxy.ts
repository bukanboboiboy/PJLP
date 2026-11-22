import { NextRequest, NextResponse } from 'next/server';

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes dan static files
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next();
  }

  const session = request.cookies.get('dashboard_session');

  // Jika belum login dan bukan di halaman login, redirect ke login
  if (!session && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login dan di halaman login, redirect ke dashboard
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
