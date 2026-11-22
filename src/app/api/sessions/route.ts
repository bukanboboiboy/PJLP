import { NextResponse } from 'next/server';
import { getToken, clearSession } from '@/lib/auth';
import { API_ENDPOINTS } from '@/lib/api-config';

export async function GET() {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const apiResponse = await fetch(API_ENDPOINTS.monitoringSessions, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (apiResponse.status === 401) {
      await clearSession();
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const data = await apiResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Sessions fetch error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil daftar sesi monitoring' },
      { status: 500 }
    );
  }
}
