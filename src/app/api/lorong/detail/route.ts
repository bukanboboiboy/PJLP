import { NextRequest, NextResponse } from 'next/server';
import { getToken, clearSession } from '@/lib/auth';
import { API_ENDPOINTS } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const lorongIds = request.nextUrl.searchParams.get('lorong_ids');
  if (!lorongIds) {
    return NextResponse.json({ error: 'lorong_ids parameter required' }, { status: 400 });
  }

  const ids = lorongIds.split(',').map((id) => id.trim()).filter(Boolean);

  try {
    // Fetch semua device check secara paralel (batch)
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
              },
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

    return NextResponse.json({ results });
  } catch (error) {
    if (error instanceof Error && error.message === 'UNAUTHORIZED') {
      await clearSession();
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }
    console.error('Device check fetch error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data perangkat' },
      { status: 500 }
    );
  }
}
