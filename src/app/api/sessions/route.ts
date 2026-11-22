import { NextResponse } from 'next/server';
import { getToken, clearSession, clearSessionCookie } from '@/lib/auth';
import { API_ENDPOINTS } from '@/lib/api-config';

export const dynamic = 'force-dynamic';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

export async function GET() {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_STORE_HEADERS });
  }

  try {
    const apiResponse = await fetch(API_ENDPOINTS.monitoringSessions, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      cache: 'no-store',
    });

    if (apiResponse.status === 401) {
      await clearSession();
      const res = NextResponse.json({ error: 'Session expired' }, { status: 401, headers: NO_STORE_HEADERS });
      clearSessionCookie(res);
      return res;
    }

    const data = await apiResponse.json();
    return NextResponse.json(data, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error('Sessions fetch error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil daftar sesi monitoring' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}