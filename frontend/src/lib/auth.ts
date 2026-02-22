import { cookies } from 'next/headers';

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('befin_token')?.value;
    if (!token) return null;
    return token;
}

export async function setSessionCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set('befin_token', token, {
        httpOnly: false, // Set to false to allow client-side games (Vite/React) to read the token across localhost origin
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
    });
}

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('befin_token');
}

