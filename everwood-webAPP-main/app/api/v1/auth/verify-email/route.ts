import { VerifyEmailSchema } from "@/lib/auth/validation";
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

  const parsed = VerifyEmailSchema.safeParse(body);
  if (!parsed.success) {
    return validationErr(
      parsed.error.issues.map((i) => ({ message: i.message, path: i.path as (string | number)[] }))
    );
  }

  const { token } = parsed.data;
  const tokenHash = hashToken(token);

  const user = await prisma.user.findFirst({
    where: {
      verificationToken: tokenHash,
      verificationExpiry: { gt: new Date() },
      emailVerified: false,
    },
  });

  if (!user) {
    return err("Invalid or expired verification token.", 400, "INVALID_TOKEN");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verificationToken: null,
      verificationExpiry: null,
    },
  });

  await audit("EMAIL_VERIFIED", req, user.id, { email: user.email });

  return ok({ message: "Email verified successfully." });
}
