import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "everwood-super-secret-jwt-key-2026!"
);

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: { message: "Invalid request body." } }, { status: 400 });
  }

  const { email, password } = (body ?? {}) as Record<string, unknown>;

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    return Response.json({ error: { message: "Please fill in all fields." } }, { status: 400 });
  }

  const adminEmail    = process.env.STUDIO_EMAIL    ?? "admin@everwood.ma";
  const adminPassword = process.env.STUDIO_PASSWORD ?? "0RrNZVU7L74G6g!A9";

  if (email.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
    return Response.json({ error: { message: "Invalid credentials." } }, { status: 401 });
  }

  // Issue JWT
  const jti   = crypto.randomUUID();
  const ttl   = process.env.ACCESS_TOKEN_TTL ?? "8h";
  const token = await new SignJWT({ sub: "admin", email: adminEmail, roles: ["admin"], jti })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ttl)
    .sign(secret);

  // Set cookie
  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === "production";
  cookieStore.set("ev_access", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 8 * 60 * 60, // 8 hours
    path: "/",
  });

  return Response.json({ id: "admin", email: adminEmail, emailVerified: true });
}
