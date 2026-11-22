import { NextRequest, NextResponse } from 'next/server';
import { applySessionCookie, clearSessionCookie } from '@/lib/auth';
import { API_ENDPOINTS } from '@/lib/api-config';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { numberid, password } = body;

    if (!numberid || !password) {
      return NextResponse.json(
        { error: 'Number ID dan Password wajib diisi.' },
        { status: 400 }
      );
    }

    const apiResponse = await fetch(API_ENDPOINTS.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify({
        numberid: String(numberid).trim(),
        password: String(password),
      }),
      cache: 'no-store',
    });

    let data: Record<string, unknown> = {};
    const textResponse = await apiResponse.text();
    try {
      data = JSON.parse(textResponse);
    } catch {
      console.error('Non-JSON response from upstream login:', textResponse);
      return NextResponse.json(
        { error: 'Server API eksternal mengembalikan respon tidak valid.' },
        { status: apiResponse.status || 502 }
      );
    }

    if (!apiResponse.ok) {
      const errorMessage =
        (typeof data.error === 'string' && data.error) ||
        (typeof data.message === 'string' && data.message) ||
        'Login gagal. Periksa kembali Number ID dan Password.';
      const errRes = NextResponse.json(
        { error: errorMessage },
        { status: apiResponse.status }
      );
      clearSessionCookie(errRes);
      return errRes;
    }

    if (!data.token || !data.user) {
      return NextResponse.json(
        { error: 'Token autentikasi tidak ditemukan dalam respon server.' },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      { success: true, user: data.user },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );

    // Bersihkan cookie lama dengan path: '/' lalu timpa dengan sesi baru
    clearSessionCookie(response);
    applySessionCookie(response, {
      token: data.token as string,
      user: data.user as {
        id: number;
        nama: string;
        no_hp: string;
        role: string;
        numberid: string;
      },
    });

    return response;
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { error: 'Tidak dapat terhubung ke server API. Periksa koneksi internet Anda.' },
      { status: 500 }
    );
  }
}