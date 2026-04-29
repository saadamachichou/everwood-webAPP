import { verifyAccessToken } from "@/lib/auth/jwt";
import { blacklistToken } from "@/lib/auth/redis";
import { getAccessToken, clearAuthCookies } from "@/lib/auth/cookies";
import { audit } from "@/lib/auth/audit";
import { ok, err } from "@/lib/auth/response";
import prisma from "@/lib/auth/db";

export async function POST(req: Request): Promise<Response> {
  const rawAccess = await getAccessToken();

  if (!rawAccess) {
    return err("Not authenticated.", 401, "UNAUTHENTICATED");
  }

  let userId: string;
  let jti: string;
  let exp: number | undefined;

  try {
    const payload = await verifyAccessToken(rawAccess);
    userId = payload.sub;
    jti = payload.jti;
    exp = (payload as { exp?: number }).exp;
  } catch {
    return err("Invalid or expired access token.", 401, "INVALID_TOKEN");
  }

  // Revoke ALL refresh tokens for this user
  await prisma.refreshToken.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true, revokedAt: new Date() },
  });

  // Blacklist current access token
  const ttl = exp ? Math.max(0, exp - Math.floor(Date.now() / 1000)) : 900;
  await blacklistToken(jti, ttl);

  await clearAuthCookies();
  await audit("LOGOUT_ALL", req, userId);

  return ok({ message: "Logged out from all devices." });
}
