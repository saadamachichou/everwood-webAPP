import { ChangePasswordSchema } from "@/lib/auth/validation";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { isTokenBlacklisted } from "@/lib/auth/redis";
import { getAccessToken } from "@/lib/auth/cookies";
import { audit } from "@/lib/auth/audit";
import { ok, err, validationErr } from "@/lib/auth/response";
import prisma from "@/lib/auth/db";

export async function PUT(req: Request): Promise<Response> {
  const rawAccess = await getAccessToken();

  if (!rawAccess) {
    return err("Not authenticated.", 401, "UNAUTHENTICATED");
  }

  let userId: string;
  let jti: string;

  try {
    const payload = await verifyAccessToken(rawAccess);
    userId = payload.sub;
    jti = payload.jti;
  } catch {
    return err("Invalid or expired access token.", 401, "INVALID_TOKEN");
  }

  // Check blacklist
  const blacklisted = await isTokenBlacklisted(jti);
  if (blacklisted) {
    return err("Token has been revoked.", 401, "TOKEN_REVOKED");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON body.", 400, "INVALID_BODY");
  }

  const parsed = ChangePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return validationErr(
      parsed.error.issues.map((i) => ({ message: i.message, path: i.path as (string | number)[] }))
    );
  }

  const { currentPassword, newPassword } = parsed.data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return err("User not found.", 404, "NOT_FOUND");
  }

  const passwordValid = await verifyPassword(currentPassword, user.passwordHash);
  if (!passwordValid) {
    return err("Current password is incorrect.", 400, "INVALID_PASSWORD");
  }

  const newPasswordHash = await hashPassword(newPassword);

  // Update password and revoke all OTHER refresh tokens (keep current session)
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    }),
    prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true, revokedAt: new Date() },
    }),
  ]);

  await audit("CHANGE_PASSWORD", req, userId);

  return ok({ message: "Password changed successfully. Please log in again on other devices." });
}
