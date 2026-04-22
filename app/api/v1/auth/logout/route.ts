import { clearAuthCookies } from "@/lib/auth/cookies";

export async function POST(): Promise<Response> {
  await clearAuthCookies();
  return Response.json({ message: "Logged out successfully." });
}
