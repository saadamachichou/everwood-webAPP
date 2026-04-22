import { verifyAccessToken } from "@/lib/auth/jwt";
import { getAccessToken } from "@/lib/auth/cookies";

export async function GET(): Promise<Response> {
  const rawAccess = await getAccessToken();

  if (!rawAccess) {
    return Response.json({ error: { message: "Not authenticated." } }, { status: 401 });
  }

  try {
    const payload = await verifyAccessToken(rawAccess);
    return Response.json({
      id: payload.sub,
      email: payload.email,
      emailVerified: true,
      roles: payload.roles ?? ["admin"],
    });
  } catch {
    return Response.json({ error: { message: "Invalid or expired session." } }, { status: 401 });
  }
}
