import { NextRequest, NextResponse } from 'next/server';
import { setSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { numberid, password } = body;

    if (!numberid || !password) {
      return NextResponse.json(
        { error: 'Number ID dan Password wajib diisi' },
        { status: 400 }
      );
    }

    // Proxy ke API eksternal
    const apiResponse = await fetch('https://cctv-lorong.gwehjj.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numberid, password }),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: data.message || 'Login gagal. Periksa kembali Number ID dan Password.' },
        { status: apiResponse.status }
      );
    }

    if (!data.token || !data.user) {
      return NextResponse.json(
        { error: 'Response tidak valid dari server' },
        { status: 500 }
      );
    }

    // Simpan session ke cookie
    await setSession({ token: data.token, user: data.user });

    return NextResponse.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server. Coba lagi nanti.' },
      { status: 500 }
    );
  }
}
