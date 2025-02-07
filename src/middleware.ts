import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (url.pathname === "/") {
    return NextResponse.redirect("https://storypix.spartastudio.app/");
  }

  return NextResponse.next();
}
