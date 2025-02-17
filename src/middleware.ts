import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log("middleware");
  console.log(req.cookies);
  const url = req.nextUrl.clone();

  if (url.pathname === "/") {
    url.hostname = "service.storypix.spartastudio.app/";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
