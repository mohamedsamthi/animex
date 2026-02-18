import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/profile', '/admin'];
const adminRoutes = ['/admin'];
const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check for Supabase auth token in cookies
    const token = request.cookies.get('sb-access-token')?.value
        || request.cookies.get('supabase-auth-token')?.value;

    // Redirect authenticated users away from auth pages
    if (authRoutes.some(route => pathname.startsWith(route)) && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Redirect unauthenticated users away from protected routes
    if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile/:path*', '/admin/:path*', '/login', '/signup', '/forgot-password', '/reset-password'],
};
