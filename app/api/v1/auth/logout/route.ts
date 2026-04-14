import { verifyAccessToken } from "@/lib/auth/jwt";
import { blacklistToken } from "@/lib/auth/redis";
import { hashToken } from "@/lib/auth/tokens";
import { getAccessToken, getRefreshToken, clearAuthCookies } from "@/lib/auth/cookies";
import { audit } from "@/lib/auth/audit";
import { ok, err } from "@/lib/auth/response";
import prisma from "@/lib/auth/db";

export async function POST(req: Request): Promise<Response> {
  const rawAccess = await getAccessToken();
  const rawRefresh = await getRefreshToken();

  let userId: string | undefined;

  // Blacklist access token JTI if present and valid
  if (rawAccess) {
    try {
      const payload = await verifyAccessToken(rawAccess);
      userId = payload.sub;

      // Calculate remaining TTL for blacklist expiry (15 min max)
      const exp = (payload as { exp?: number }).exp;
      const ttl = exp ? Math.max(0, exp - Math.floor(Date.now() / 1000)) : 900;
      await blacklistToken(payload.jti, ttl);
    } catch {
      // Token already invalid — that's fine
    }
  }

  // Revoke refresh token in DB if present
  if (rawRefresh) {
    const tokenHash = hashToken(rawRefresh);
    try {
      await prisma.refreshToken.updateMany({
        where: { tokenHash, revoked: false },
        data: { revoked: true, revokedAt: new Date() },
      });
    } catch {
      // Non-blocking
    }
  }

  await clearAuthCookies();

  if (userId) {
    await audit("LOGOUT", req, userId);
  }

  return ok({ message: "Logged out successfully." });
}
