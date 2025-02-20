import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 미들웨어를 통해 미리 로그인 여부를 확인하고, 로그인이 필요한 페이지로 이동하는 방식

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const accessToken = req.cookies.get("access_token")?.value; // 놀랍게도 도메인이 같으면 middleware는 httpOnly 쿠키를 읽을 수 있다.
  const refreshToken = req.cookies.get("refresh_token")?.value;

  const protectedPaths = ["/account", "/subscribe", "/tale"];

  // 랜딩 페이지는 웹플로우로 리디렉트 해야하기 때문에 next rewrite기능을 통해 리디렉트 -> 도메인은 유지하지만 웹플로우 사이트로 연결됨.
  if (url.pathname === "/") {
    url.hostname = "service.storypix.spartastudio.app/"; // 웹플로우 도메인(기본 도메인인 webflow.io를 사용하면 웹플로우 뱃지 제거 불가능하다하여 커스텀 도메인 사용)
    return NextResponse.rewrite(url);
  }

  if (protectedPaths.includes(url.pathname)) {
    if (!accessToken || !(await checkAccessTokenValidity(accessToken))) { // 액세스 토큰이 없거나 인증이 안되는 경우(만료)
      if (refreshToken) { // 리프레쉬 토큰 있으면 그거로 리프레쉬 시도
        if (await refreshAccessToken(refreshToken)) { // 성공 시 인가된 유저로 간주, 페이지 이동 허용
          return NextResponse.next();
        }
      } // 리프레쉬 토큰이 없거나 리프레쉬 실패 시 로그인 페이지로 리다이렉트
      const loginURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/kakao`; 
      return NextResponse.redirect(loginURL);
    }
  }
  // 액세스토큰 유효하면 그대로 이동
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
          Cookie: `refresh_token=${refreshToken}`,  // 미들웨어는 쿠키를 자동으로 담아주지 않음 -> 헤더에 따로 넣어줘야함.
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
