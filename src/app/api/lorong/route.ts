import { NextRequest, NextResponse } from 'next/server';
import { getToken, clearSession } from '@/lib/auth';
import { API_ENDPOINTS } from '@/lib/api-config';

export async function GET(request: NextRequest) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sessionId = request.nextUrl.searchParams.get('session_id') || '70';
  const limitParam = request.nextUrl.searchParams.get('limit') || '1000';
  const limit = parseInt(limitParam, 10) || 1000;

  try {
    const apiResponse = await fetch(
      API_ENDPOINTS.monitoringSession(sessionId, limit),
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (apiResponse.status === 401) {
      await clearSession();
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Lorong fetch error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data lorong dari server' },
      { status: 500 }
    );
  }
}
