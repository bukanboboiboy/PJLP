import { NextRequest, NextResponse } from 'next/server';
import { setSession } from '@/lib/auth';
import { API_ENDPOINTS } from '@/lib/api-config';

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

    // Proxy ke API eksternal: /api/auth/login
    const apiResponse = await fetch(API_ENDPOINTS.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        numberid: String(numberid).trim(),
        password: String(password),
      }),
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
      return NextResponse.json(
        { error: errorMessage },
        { status: apiResponse.status }
      );
    }

    if (!data.token || !data.user) {
      return NextResponse.json(
        { error: 'Token autentikasi tidak ditemukan dalam respon server.' },
        { status: 500 }
      );
    }

    // Simpan token dan user di HTTP-only cookie selama 24 jam
    await setSession({
      token: data.token as string,
      user: data.user as {
        id: number;
        nama: string;
        no_hp: string;
        role: string;
        numberid: string;
      },
    });

    return NextResponse.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { error: 'Tidak dapat terhubung ke server API. Periksa koneksi internet Anda.' },
      { status: 500 }
    );
  }
}
