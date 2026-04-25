import prisma from "./db";
import type { Prisma } from "@prisma/client";

export type AuditEvent =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "LOGOUT_ALL"
  | "REGISTER"
  | "PASSWORD_RESET_REQUEST"
  | "PASSWORD_RESET"
  | "EMAIL_VERIFIED"
  | "ACCOUNT_LOCKED"
  | "TOKEN_REFRESH"
  | "CHANGE_PASSWORD"
  | "SECURITY_ALERT";

export async function audit(
  event: AuditEvent,
  req: Request,
  userId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const ua = req.headers.get("user-agent") ?? "";
    await prisma.auditLog.create({
      data: {
        eventType: event,
        ipAddress: ip,
        userAgent: ua,
        userId: userId ?? null,
        metadata: (metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  } catch {
    // non-blocking — audit failures must not break auth flows
  }
}
