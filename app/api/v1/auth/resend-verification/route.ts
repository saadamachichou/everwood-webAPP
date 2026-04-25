import { verifyAccessToken } from "@/lib/auth/jwt";
import { generateToken, hashToken } from "@/lib/auth/tokens";
import { checkRateLimit } from "@/lib/auth/redis";
import { getAccessToken } from "@/lib/auth/cookies";
import { audit } from "@/lib/auth/audit";
import { ok, err } from "@/lib/auth/response";
import prisma from "@/lib/auth/db";

export async function POST(req: Request): Promise<Response> {
  const rawAccess = await getAccessToken();

  if (!rawAccess) {
    return err("Not authenticated.", 401, "UNAUTHENTICATED");
  }

  let userId: string;
  try {
    const payload = await verifyAccessToken(rawAccess);
    userId = payload.sub;
  } catch {
    return err("Invalid or expired access token.", 401, "INVALID_TOKEN");
  }

  // Rate limit: 3 per user per hour
  const rl = await checkRateLimit(`resend-verify:${userId}`, 3, 3600);
  if (!rl.allowed) {
    return err("Too many verification emails sent. Please try again later.", 429, "RATE_LIMITED");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return err("User not found.", 404, "NOT_FOUND");
  }

  if (user.emailVerified) {
    return err("Email is already verified.", 400, "ALREADY_VERIFIED");
  }

  const rawToken = generateToken();
  const verificationToken = hashToken(rawToken);
  const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.user.update({
    where: { id: userId },
    data: { verificationToken, verificationExpiry },
  });

  if (process.env.NODE_ENV !== "production") {
    console.log(`[DEV] Resent verification token for ${user.email}: ${rawToken}`);
  }

  return ok({ message: "Verification email sent." });
}
