import { ResetPasswordSchema } from "@/lib/auth/validation";
import { hashPassword } from "@/lib/auth/password";
import { hashToken } from "@/lib/auth/tokens";
import { audit } from "@/lib/auth/audit";
import { ok, err, validationErr } from "@/lib/auth/response";
import prisma from "@/lib/auth/db";

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON body.", 400, "INVALID_BODY");
  }

  const parsed = ResetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return validationErr(
      parsed.error.issues.map((i) => ({ message: i.message, path: i.path as (string | number)[] }))
    );
  }

  const { token, password } = parsed.data;
  const tokenHash = hashToken(token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!resetToken) {
    return err("Invalid or expired reset token.", 400, "INVALID_TOKEN");
  }

  if (resetToken.used) {
    return err("This reset token has already been used.", 400, "TOKEN_USED");
  }

  if (resetToken.expiresAt < new Date()) {
    return err("This reset token has expired.", 400, "TOKEN_EXPIRED");
  }

  const newPasswordHash = await hashPassword(password);

  // Update password, mark token as used, revoke all refresh tokens
  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: {
        passwordHash: newPasswordHash,
        failedLoginAttempts: 0,
        isLocked: false,
        lockedUntil: null,
      },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    }),
    prisma.refreshToken.updateMany({
      where: { userId: resetToken.userId, revoked: false },
      data: { revoked: true, revokedAt: new Date() },
    }),
  ]);

  await audit("PASSWORD_RESET", req, resetToken.userId);

  return ok({ message: "Password has been reset successfully. Please log in." });
}
