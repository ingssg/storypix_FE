import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  const protectedPaths = ["/account", "/subscribe", "/tale"];
  // const protectedPaths = ["/localTest"];

  if (url.pathname === "/") {
    url.hostname = "service.storypix.spartastudio.app/";
    return NextResponse.rewrite(url);
  }

  if (protectedPaths.includes(url.pathname)) {
    if (!accessToken || !(await checkAccessTokenValidity(accessToken))) {
      if (refreshToken) {
        if (await refreshAccessToken(refreshToken)) {
          const endTime = performance.now();
          return NextResponse.next();
        }
      }
      const loginURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/kakao`;
      return NextResponse.redirect(loginURL);
    }
  }
  return NextResponse.next();
}

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refresh_token=${refreshToken}`,
        },
        credentials: "include",
      }
    );
    return res.ok;
  } catch (error) {
    console.error("🚨 네트워크 오류 발생 (리프레시 요청 실패):", error);
    return false;
  }
};

const checkAccessTokenValidity = async (accessToken: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `access_token=${accessToken}`,
        },
      }
    );
    return res.ok;
  } catch (error) {
    console.error("🚨 네트워크 오류 발생 (액세스 토큰 검증 실패):", error);
    return false;
  }
};

export const config = {
  matcher: "/:path*",
};
