import { NextRequest, NextResponse } from 'next/server';
import { getToken, clearSession, clearSessionCookie } from '@/lib/auth';
import { API_ENDPOINTS } from '@/lib/api-config';

export const dynamic = 'force-dynamic';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

export async function GET(request: NextRequest) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const lorongIds = request.nextUrl.searchParams.get('lorong_ids');
  if (!lorongIds) {
    return NextResponse.json({ error: 'lorong_ids parameter required' }, { status: 400, headers: NO_STORE_HEADERS });
  }

  const ids = lorongIds.split(',').map((id) => id.trim()).filter(Boolean);

  try {
    const results = await Promise.all(
      ids.map(async (lorongId) => {
        try {
          const apiResponse = await fetch(
            API_ENDPOINTS.monitoringPengecekan(lorongId),
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
              },
              cache: 'no-store',
            }
          );

          if (apiResponse.status === 401) {
            throw new Error('UNAUTHORIZED');
          }

          const data = await apiResponse.json();
          return {
            lorong_id: parseInt(lorongId, 10),
            data: Array.isArray(data) ? data : [],
          };
        } catch (err) {
          if (err instanceof Error && err.message === 'UNAUTHORIZED') throw err;
          return { lorong_id: parseInt(lorongId, 10), data: [] };
        }
      })
    );

    return NextResponse.json({ results }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      await clearSession();
      const res = NextResponse.json({ error: 'Session expired' }, { status: 401, headers: NO_STORE_HEADERS });
      clearSessionCookie(res);
      return res;
    }
    console.error('Device check fetch error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data perangkat' },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}