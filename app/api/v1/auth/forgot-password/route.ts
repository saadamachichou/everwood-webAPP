import { ForgotPasswordSchema } from "@/lib/auth/validation";
import { generateToken, hashToken } from "@/lib/auth/tokens";
import { checkRateLimit } from "@/lib/auth/redis";
import { audit } from "@/lib/auth/audit";
import { ok, err, validationErr } from "@/lib/auth/response";
import prisma from "@/lib/auth/db";

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON body.", 400, "INVALID_BODY");
  }

  const parsed = ForgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return validationErr(
      parsed.error.issues.map((i) => ({ message: i.message, path: i.path as (string | number)[] }))
    );
  }

  const { email } = parsed.data;

  // Rate limit by email: 3 per hour
  const rl = await checkRateLimit(`forgot:${email}`, 3, 3600);
  if (!rl.allowed) {
    // Still return 200 to prevent enumeration
    return ok({ message: "If that email is registered, a reset link has been sent." });
  }

  // Always return 200 regardless of whether user exists (prevent enumeration)
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const rawToken = generateToken();
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    // Invalidate any existing unused reset tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    await audit("PASSWORD_RESET_REQUEST", req, user.id, { email });

    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV] Password reset token for ${email}: ${rawToken}`);
    }
  }

  return ok({ message: "If that email is registered, a reset link has been sent." });
}
