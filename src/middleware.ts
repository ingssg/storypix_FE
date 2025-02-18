import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  console.log("✅ Middleware 실행됨:", url.pathname);
  console.log("🔹 현재 액세스 토큰:", accessToken ? "있음" : "없음");
  console.log("🔹 현재 리프레시 토큰:", refreshToken ? "있음" : "없음");


  const protectedPaths = ["/account", "/subscribe", "/tale"];


  if (url.pathname === "/") {
    url.hostname = "service.storypix.spartastudio.app/";
    return NextResponse.rewrite(url);
  }

  if (protectedPaths.includes(url.pathname)) {
    console.log("🔐 보호된 경로 접근 시도:", url.pathname);
    if (!accessToken || !(await checkAccessTokenValidity(accessToken))) {
      console.log("❌ 액세스 토큰 없음 또는 유효하지 않음");
      if (refreshToken) {
        console.log("🔄 리프레시 토큰이 존재하므로 새로운 액세스 토큰 요청 시도");
        if (await refreshAccessToken(refreshToken)) {
          console.log("✅ 리프레시 성공! 정상적으로 페이지 접근 가능");
          return NextResponse.next();
        }
      }
      console.log("🚫 리프레시 토큰 없음 또는 리프레시 실패 → 로그인 페이지로 리디렉트");
      const loginURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/kakao`;
      return NextResponse.redirect(loginURL);
    }
    console.log("✅ 액세스 토큰이 유효함 → 정상적으로 페이지 접근 허용");
  }
  return NextResponse.next();
}

const refreshAccessToken = async (refreshToken: string) => {
  console.log("🔄 refreshAccessToken() 실행됨");
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${refreshToken}`,
      },
      credentials: "include",
    });
    console.log(`🔄 리프레시 요청 결과: ${res.status} ${res.ok ? "✅ 성공" : "❌ 실패"}`);
    return res.ok;
  } catch (error) {
    console.error("🚨 네트워크 오류 발생 (리프레시 요청 실패):", error);
    return false;
  }
};

const checkAccessTokenValidity = async (accessToken: string) => {
  console.log("🔍 checkAccessTokenValidity() 실행됨");
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `access_token=${accessToken}`,
      },
    });
    console.log(`🔍 액세스 토큰 검증 결과: ${res.status} ${res.ok ? "✅ 유효" : "❌ 무효"}`);
    return res.ok;
  } catch (error) {
    console.error("🚨 네트워크 오류 발생 (액세스 토큰 검증 실패):", error);
    return false;
  }
};

export const config = {
  matcher: "/:path*",
};
