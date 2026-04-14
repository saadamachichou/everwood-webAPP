import { LoginSchema } from "@/lib/auth/validation";
import { verifyPassword } from "@/lib/auth/password";
import { generateToken, hashToken, deviceFingerprint } from "@/lib/auth/tokens";
import { signAccessToken } from "@/lib/auth/jwt";
import { checkRateLimit } from "@/lib/auth/redis";
import { setAuthCookies } from "@/lib/auth/cookies";
import { audit } from "@/lib/auth/audit";
import { ok, err, validationErr } from "@/lib/auth/response";
import prisma from "@/lib/auth/db";

const LOCKOUT_THRESHOLDS: { attempts: number; durationMs: number }[] = [
  { attempts: 5, durationMs: 15 * 60 * 1000 },    // 5 failures → 15 min lock
  { attempts: 10, durationMs: 60 * 60 * 1000 },   // 10 failures → 1 hr lock
  { attempts: 15, durationMs: 24 * 60 * 60 * 1000 }, // 15 failures → 24 hr lock
];

function getLockoutDuration(attempts: number): number | null {
  // Find highest threshold exceeded
  for (let i = LOCKOUT_THRESHOLDS.length - 1; i >= 0; i--) {
    if (attempts >= LOCKOUT_THRESHOLDS[i].attempts) {
      return LOCKOUT_THRESHOLDS[i].durationMs;
    }
  }
  return null;
}

export async function POST(req: Request): Promise<Response> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ua = req.headers.get("user-agent") ?? "";

  // Rate limit by IP: 30 per 15 min
  const ipRl = await checkRateLimit(`login:ip:${ip}`, 30, 900);
  if (!ipRl.allowed) {
    return err("Too many login attempts. Please try again later.", 429, "RATE_LIMITED");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON body.", 400, "INVALID_BODY");
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return validationErr(
      parsed.error.issues.map((i) => ({ message: i.message, path: i.path as (string | number)[] }))
    );
  }

  const { email, password } = parsed.data;

  // Rate limit by account: 10 per 15 min
  const accountRl = await checkRateLimit(`login:acct:${email}`, 10, 900);
  if (!accountRl.allowed) {
    return err("Invalid credentials.", 401, "INVALID_CREDENTIALS");
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Prevent enumeration — always same message for not-found or locked
  if (!user) {
    return err("Invalid credentials.", 401, "INVALID_CREDENTIALS");
  }

  // Check lockout
  if (user.isLocked) {
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      await audit("LOGIN_FAILED", req, user.id, { reason: "account_locked" });
      return err("Invalid credentials.", 401, "INVALID_CREDENTIALS");
    }
    // Lock has expired — unlock the account
    await prisma.user.update({
      where: { id: user.id },
      data: { isLocked: false, failedLoginAttempts: 0, lockedUntil: null },
    });
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);

  if (!passwordValid) {
    const newAttempts = user.failedLoginAttempts + 1;
    const lockDurationMs = getLockoutDuration(newAttempts);

    const updateData: {
      failedLoginAttempts: number;
      isLocked?: boolean;
      lockedUntil?: Date;
    } = { failedLoginAttempts: newAttempts };

    if (lockDurationMs !== null) {
      updateData.isLocked = true;
      updateData.lockedUntil = new Date(Date.now() + lockDurationMs);
      await audit("ACCOUNT_LOCKED", req, user.id, {
        attempts: newAttempts,
        lockedUntilMs: lockDurationMs,
      });
    }

    await prisma.user.update({ where: { id: user.id }, data: updateData });
    await audit("LOGIN_FAILED", req, user.id, { attempts: newAttempts });

    return err("Invalid credentials.", 401, "INVALID_CREDENTIALS");
  }

  // Successful login — reset failure counter and update lastLoginAt
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      isLocked: false,
      lockedUntil: null,
      lastLoginAt: new Date(),
    },
  });

  // Fetch roles for JWT
  const userRoles = await prisma.userRole.findMany({
    where: { userId: user.id },
    include: { role: true },
  });
  const roles = userRoles.map((ur) => ur.role.name);

  // Issue JWT access token
  const { token: accessToken } = await signAccessToken({
    sub: user.id,
    email: user.email,
    roles,
  });

  // Issue opaque refresh token, store its SHA-256 hash
  const rawRefreshToken = generateToken();
  const tokenHash = hashToken(rawRefreshToken);
  const fp = deviceFingerprint(ip, ua);
  const refreshTtlDays = parseInt(process.env.REFRESH_TOKEN_TTL_DAYS ?? "7", 10);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      deviceFingerprint: fp,
      expiresAt: new Date(Date.now() + refreshTtlDays * 24 * 3600 * 1000),
    },
  });

  await setAuthCookies(accessToken, rawRefreshToken);
  await audit("LOGIN_SUCCESS", req, user.id);

  return ok({ id: user.id, email: user.email, emailVerified: user.emailVerified });
}
