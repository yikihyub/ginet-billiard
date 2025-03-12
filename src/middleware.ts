import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';



// 로그인 없이 접근 가능한 공개 경로 정의
const publicPaths = ['/', '/api/auth', '/api/login', '/login', '/signin'];

// 보호된 경로 정의
const protectedPaths = [
  '/app',
  '/dashboard',
  '/mypage',
  '/billiard-place',
  '/match',
  '/team-match',
];

// API 경로 체크 함수
const isPublicApiPath = (pathname: string) => {
  return [
    '/api/auth',
    '/api/login',
    '/api/check',
    '/api/store/allstore',
    '/api/signin',
  ].some((path) => pathname.startsWith(path));
};

// 경로가 보호된 경로인지 확인하는 함수
const isProtectedPath = (pathname: string) => {
  return protectedPaths.some((path) => pathname.startsWith(path));
};

// 경로가 공개 경로인지 확인하는 함수
const isPublicPath = (pathname: string) => {
  return publicPaths.some((path) => pathname.startsWith(path));
};

// 커스텀 미들웨어 함수
export default withAuth(
  async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "Unknown IP";
  console.log("접속 시도 IP:", ip);

  const allowedIPs = ['118.235.88.178', '192.168.0.155', '192.168.0.154'];

  if (!allowedIPs.includes(ip)) {
    return new NextResponse("🚫 접근 불가: 허용된 사용자만 접근 가능합니다.", { status: 403 });
  }

    // API 경로 처리
    if (pathname.startsWith('/api')) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const token = (req as any).nextauth?.token;
      // 공개 API 경로는 통과
      if (isPublicApiPath(pathname)) {
        return NextResponse.next();
      }

      // 비공개 API 경로는 토큰 체크
      if (!token) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      return NextResponse.next();
    }

    // 토큰에서 사용자 정보 접근
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = (req as any).nextauth?.token;
    if (pathname === '/mypage') {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    if (pathname.startsWith('/billiard-place')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    if (pathname === '/match') {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    if (pathname === '/team-match') {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    if (pathname === '/login') {
      if (token) {
        return NextResponse.redirect(new URL('/mypage', req.url));
      }
    }

    // 보호된 경로에 대한 접근 제어
    if (isProtectedPath(pathname)) {
      // 토큰이 없는 경우 로그인 페이지로 리다이렉트
      if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
      }

      // 토큰이 있는 경우 추가 검증
      if (token) {
        // 비밀번호 변경 강제화 로직
        if (!pathname.startsWith('/change-password') && token.mb_8 === false) {
          return NextResponse.redirect(new URL('/change-password', req.url));
        }

        // 대시보드 접근 권한 확인
        if (pathname.startsWith('/dashboard') && token.mb_level <= 2) {
          return NextResponse.redirect(new URL('/', req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;

        // API 경로 처리
        if (pathname.startsWith('/api')) {
          return isPublicApiPath(pathname) || !!token;
        }

        // 공개 경로는 인증 없이 접근 가능
        if (isPublicPath(pathname)) {
          return true;
        }

        // 보호된 경로는 토큰이 있어야 접근 가능
        if (isProtectedPath(pathname)) {
          return !!token;
        }
        if (pathname === '/login' || pathname === '/signup') {
          return !token;
        }

        // mypage는 토큰이 있을 때만 접근 가능
        if (pathname === '/mypage') {
          return !!token;
        }

        // 그 외 경로는 기본적으로 접근 허용
        return true;
      },
    },
  }
);

// 미들웨어 적용 경로 설정
export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
