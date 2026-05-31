import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── Route Protection Middleware ──────────────────────────────────────────────
//
// This runs at the Edge before any page render.
// We read the persisted Zustand auth state from a cookie.
// In production, replace cookie check with Firebase session cookie verification.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read our demo auth cookie (set by login page)
  const authCookie = request.cookies.get('vaultpay-auth');
  let role: string | null = null;
  let isAuthenticated = false;

  if (authCookie?.value) {
    try {
      const parsed = JSON.parse(decodeURIComponent(authCookie.value));
      role = parsed?.state?.role ?? null;
      isAuthenticated = !!parsed?.state?.user;
    } catch {
      // Cookie malformed — treat as unauthenticated
    }
  }

  // ── Public routes — always allow ─────────────────────────────────────────
  const publicRoutes = ['/login', '/403', '/payment-success', '/'];
  if (publicRoutes.some((r) => pathname === r || pathname.startsWith('/api/'))) {
    return NextResponse.next();
  }

  // ── Unauthenticated → Login ───────────────────────────────────────────────
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Client tries to access admin routes → 403 ─────────────────────────────
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/403', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
