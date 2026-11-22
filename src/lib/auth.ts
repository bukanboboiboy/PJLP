import { cookies } from 'next/headers';

const COOKIE_NAME = 'dashboard_session';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 jam

export interface SessionData {
  token: string;
  user: {
    id: number;
    nama: string;
    no_hp: string;
    role: string;
    numberid: string;
  };
}

export async function setSession(data: SessionData): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, JSON.stringify(data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return null;
  try {
    return JSON.parse(cookie.value) as SessionData;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getToken(): Promise<string | null> {
  const session = await getSession();
  return session?.token ?? null;
}
