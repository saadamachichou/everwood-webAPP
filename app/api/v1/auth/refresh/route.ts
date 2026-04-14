import { signAccessToken } from "@/lib/auth/jwt";
import { generateToken, hashToken, deviceFingerprint } from "@/lib/auth/tokens";
import { getRefreshToken, setAuthCookies } from "@/lib/auth/cookies";
import { audit } from "@/lib/auth/audit";
import { ok, err } from "@/lib/auth/response";
import prisma from "@/lib/auth/db";

export async function POST(req: Request): Promise<Response> {
  const rawRefresh = await getRefreshToken();

  if (!rawRefresh) {
    return err("No refresh token provided.", 401, "NO_REFRESH_TOKEN");
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";
  const fp = deviceFingerprint(ip, ua);
  const tokenHash = hashToken(rawRefresh);

  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!stored) {
    return err("Invalid refresh token.", 401, "INVALID_REFRESH_TOKEN");
  }

  // Reuse detection: token already revoked → possible token theft
  if (stored.revoked) {
    // Revoke ALL refresh tokens for this user as a security measure
    await prisma.refreshToken.updateMany({
      where: { userId: stored.userId, revoked: false },
      data: { revoked: true, revokedAt: new Date() },
    });
    await audit("SECURITY_ALERT", req, stored.userId, {
      reason: "refresh_token_reuse_detected",
      tokenId: stored.id,
    });
    return err("Security alert: token reuse detected. Please log in again.", 401, "TOKEN_REUSE");
  }

  // Check expiry
  if (stored.expiresAt < new Date()) {
    return err("Refresh token has expired.", 401, "REFRESH_TOKEN_EXPIRED");
  }

  // Check device fingerprint
  if (stored.deviceFingerprint !== fp) {
    return err("Device mismatch. Please log in again.", 401, "DEVICE_MISMATCH");
  }

  // Fetch user and roles
  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  if (!user || user.isLocked) {
    return err("Account not accessible.", 401, "ACCOUNT_INACCESSIBLE");
  }

  const userRoles = await prisma.userRole.findMany({
    where: { userId: user.id },
    include: { role: true },
  });
  const roles = userRoles.map((ur) => ur.role.name);

  // Rotate: revoke old token, issue new pair
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revoked: true, revokedAt: new Date() },
  });

  const { token: accessToken } = await signAccessToken({
    sub: user.id,
    email: user.email,
    roles,
  });

  const rawNewRefresh = generateToken();
  const newTokenHash = hashToken(rawNewRefresh);
  const refreshTtlDays = parseInt(process.env.REFRESH_TOKEN_TTL_DAYS ?? "7", 10);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: newTokenHash,
      deviceFingerprint: fp,
      expiresAt: new Date(Date.now() + refreshTtlDays * 24 * 3600 * 1000),
    },
  });

  await setAuthCookies(accessToken, rawNewRefresh);
  await audit("TOKEN_REFRESH", req, user.id);

  return ok({ ok: true });
}
