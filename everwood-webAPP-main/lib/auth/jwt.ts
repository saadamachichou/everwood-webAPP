import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "change-me-in-production-32chars+"
);

export interface JWTPayload {
  sub: string;      // userId
  email: string;
  jti: string;      // unique token ID for blacklisting
  roles?: string[];
}

export async function signAccessToken(
  payload: Omit<JWTPayload, "jti">
): Promise<{ token: string; jti: string }> {
  const jti = crypto.randomUUID();
  const token = await new SignJWT({ ...payload, jti })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(process.env.ACCESS_TOKEN_TTL ?? "15m")
    .sign(secret);
  return { token, jti };
}

export async function verifyAccessToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as JWTPayload;
}
