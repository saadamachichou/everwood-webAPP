import { verifyAccessToken } from "@/lib/auth/jwt";
import { isTokenBlacklisted } from "@/lib/auth/redis";
import { getAccessToken } from "@/lib/auth/cookies";
import { ok, err } from "@/lib/auth/response";
import prisma from "@/lib/auth/db";

export async function GET(req: Request): Promise<Response> {
  const rawAccess = await getAccessToken();

  if (!rawAccess) {
    return err("Not authenticated.", 401, "UNAUTHENTICATED");
  }

  let userId: string;
  let jti: string;
  let tokenRoles: string[] | undefined;

  try {
    const payload = await verifyAccessToken(rawAccess);
    userId = payload.sub;
    jti = payload.jti;
    tokenRoles = payload.roles;
  } catch {
    return err("Invalid or expired access token.", 401, "INVALID_TOKEN");
  }

  // Check Redis blacklist
  const blacklisted = await isTokenBlacklisted(jti);
  if (blacklisted) {
    return err("Token has been revoked.", 401, "TOKEN_REVOKED");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return err("User not found.", 404, "NOT_FOUND");
  }

  // Get current roles from DB (more authoritative than JWT claim)
  const userRoles = await prisma.userRole.findMany({
    where: { userId: user.id },
    include: { role: true },
  });
  const roles = userRoles.map((ur) => ur.role.name);

  return ok({
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
    roles,
  });
}
