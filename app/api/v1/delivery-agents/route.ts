import { readStore } from "@/lib/store";

export async function GET() {
  return Response.json(readStore("delivery-agents"));
}
