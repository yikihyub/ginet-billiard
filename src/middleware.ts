import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// 로그인 없이 접근 가능한 공개 경로 정의
const publicPaths = ["/", "/api/auth", "/api/login", "/login", "/signin", "/api/signin", "/api/club/getclub"];

// 보호된 경로 정의 (접두사 없는 기본 경로)
const protectedPaths = [
  "/app",
  "/dashboard",
  "/mypage",
  "/billiard-place",
  "/match",
  "/team-match",
  "/club",
  "/billiard-commu",
  "/record",
  "/reservation",
  "/term",
  "/main-match",
  "/main-club"
];

// 로그인 페이지 경로
const loginPaths = ["/login", "/signin"];

// API 경로 체크 함수
const isPublicApiPath = (pathname: string) => {
  return [
    "/api/auth",
    "/api/login",
    "/api/signin",
    "/api/check",
    "/api/club/getclub",
    "/api/store/allstore",
  ].some((path) => pathname.startsWith(path));
};

// 경로가 보호된 경로인지 확인하는 함수 (모바일, 데스크톱 접두사 고려)
const isProtectedPath = (pathname: string) => {
  // 접두사 제거한 경로 확인
  const basePath = pathname.replace(/^\/mobile|^\/desktop/, "");
  return protectedPaths.some((path) => basePath.startsWith(path));
};

// 경로가 공개 경로인지 확인하는 함수 (모바일, 데스크톱 접두사 고려)
const isPublicPath = (pathname: string) => {
  // 접두사 제거한 경로 확인
  const basePath = pathname.replace(/^\/mobile|^\/desktop/, "");
  return publicPaths.some((path) => basePath.startsWith(path)) || loginPaths.some(path => basePath.startsWith(path));
};

// 경로에서 접두사 제거하는 함수
const removePrefixes = (pathname: string) => {
  return pathname.replace(/^\/mobile|^\/desktop/, "");
};

const isSuperGinetPath = (pathname: string) => {
  return pathname.startsWith("/superginet");
};

// 미들웨어
export default withAuth(
  async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
    const userAgent = req.headers.get("user-agent") || "";
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
    
    // 현재 디바이스에 맞는 접두사 결정
    const correctPrefix = isMobile ? "/mobile" : "/desktop";
    
    // 현재 URL에서 접두사 확인
    const hasDesktopPrefix = pathname.startsWith("/desktop");
    const hasMobilePrefix = pathname.startsWith("/mobile");
    const hasCorrectPrefix = isMobile ? hasMobilePrefix : hasDesktopPrefix;
    
    // API 경로 처리 - 접두사 관련 없음
    if (pathname.startsWith("/api")) {
      const token = (req as any).nextauth?.token;
      if (isPublicApiPath(pathname)) return NextResponse.next();
      if (!token) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      return NextResponse.next();
    }

    // 루트 경로 처리 - 디바이스 타입에 맞게 리다이렉트
    if (pathname === "/") {
      return NextResponse.redirect(new URL(correctPrefix, req.url));
    }

    // ✅ superginet은 접두사 검사 제외
    if (!isSuperGinetPath(pathname)) {
      // 잘못된 접두사를 가진 경로 처리
      if (!hasCorrectPrefix && (hasDesktopPrefix || hasMobilePrefix)) {
        const cleanPath = removePrefixes(pathname);
        return NextResponse.redirect(new URL(`${correctPrefix}${cleanPath}`, req.url));
      }

      // 접두사가 없는 경로 처리 (로그인 경로 제외)
      if (!hasCorrectPrefix && !hasDesktopPrefix && !hasMobilePrefix) {
        if (loginPaths.some(path => pathname.startsWith(path))) {
          return NextResponse.redirect(new URL(`${correctPrefix}${pathname}`, req.url));
        }

        return NextResponse.redirect(new URL(`${correctPrefix}${pathname}`, req.url));
      }
    }

    // 나머지 권한 관련 로직
    const token = (req as any).nextauth?.token;
    
    // 로그인 필요한 보호 경로 처리 (모바일, 데스크톱 모두)
    if (isProtectedPath(pathname) && !token) {
      const loginPath = `${correctPrefix}/login`;
      return NextResponse.redirect(new URL(loginPath, req.url));
    }

    // 로그인 상태로 로그인 페이지 접근 시 처리
    if (pathname.endsWith("/login") && token) {
      return NextResponse.redirect(new URL(`${correctPrefix}/mypage`, req.url));
    }

    // 비밀번호 변경 강제화 (모바일, 데스크톱 모두)
    if (token && token.mb_8 === false && !pathname.endsWith("/change-password")) {
      return NextResponse.redirect(new URL(`${correctPrefix}/change-password`, req.url));
    }

    // 대시보드 접근 권한 확인 (모바일, 데스크톱 모두)
    if (pathname.includes("/dashboard") && token && token.mb_level <= 2) {
      return NextResponse.redirect(new URL(correctPrefix, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = req.nextUrl.pathname;

        // API 경로 처리
        if (pathname.startsWith("/api")) {
          return isPublicApiPath(pathname) || !!token;
        }

        // 공개 경로 접근 허용 (모바일/데스크톱 접두사 고려)
        if (isPublicPath(pathname)) {
          return true;
        }

        // 보호된 경로 접근 제한 (모바일/데스크톱 접두사 고려)
        if (isProtectedPath(pathname)) {
          return !!token;
        }

        return true;
      },
    },
  }
);

// 미들웨어 적용 경로 설정
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};