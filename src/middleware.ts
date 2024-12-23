export { auth as middleware } from '@/auth';

// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   const token = await getToken({ req: request });
//   const isAuthPage =
//     request.nextUrl.pathname.startsWith("/login") ||
//     request.nextUrl.pathname.startsWith("/register");
//   const isMyPage = request.nextUrl.pathname.startsWith("/mypage");

//   // 인증 페이지에서 이미 로그인한 경우
//   if (isAuthPage && token) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // mypage 접근 시 로그인이 필요한 경우
//   if (isMyPage && !token) {
//     return NextResponse.redirect(
//       new URL(
//         `/login?from=${encodeURIComponent(request.nextUrl.pathname)}`,
//         request.url
//       )
//     );
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/login", "/register", "/mypage/:path*"],
// };
