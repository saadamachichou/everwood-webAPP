import { RegisterSchema } from "@/lib/auth/validation";
import { hashPassword } from "@/lib/auth/password";
import { generateToken, hashToken } from "@/lib/auth/tokens";
import { checkRateLimit } from "@/lib/auth/redis";
import { audit } from "@/lib/auth/audit";
import { ok, err, validationErr } from "@/lib/auth/response";
import prisma from "@/lib/auth/db";

export async function POST(req: Request): Promise<Response> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Rate limit: 5 registrations per IP per hour
  const rl = await checkRateLimit(`reg:${ip}`, 5, 3600);
  if (!rl.allowed) {
    return err("Too many registration attempts. Please try again later.", 429, "RATE_LIMITED");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON body.", 400, "INVALID_BODY");
  }

  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) {
    return validationErr(
      parsed.error.issues.map((i) => ({ message: i.message, path: i.path as (string | number)[] }))
    );
  }

  const { email, password } = parsed.data;

  // Check if email is already taken
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return err("An account with this email already exists.", 409, "EMAIL_TAKEN");
  }

  const passwordHash = await hashPassword(password);

  // Generate email verification token
  const rawToken = generateToken();
  const verificationToken = hashToken(rawToken);
  const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      verificationToken,
      verificationExpiry,
    },
  });

  await audit("REGISTER", req, user.id, { email });

  // In development, log the verification token instead of sending email
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[DEV] Email verification token for ${email}: ${rawToken}`
    );
  }

  return ok(
    { id: user.id, email: user.email, emailVerified: user.emailVerified },
    201
  );
}
