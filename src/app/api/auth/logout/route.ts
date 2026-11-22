import { NextResponse } from 'next/server';
import { clearSession, clearSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  await clearSession();
  const response = NextResponse.json(
    { success: true },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
  clearSessionCookie(response);
  return response;
}