import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "change-me-in-production-32chars+"
);

const PROTECTED = ["/studio"];

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const isProtected = PROTECTED.some((p) =>
    req.nextUrl.pathname.startsWith(p)
  );

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("ev_access")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/studio/:path*"],
};
