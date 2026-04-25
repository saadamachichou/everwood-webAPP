import { readStore, insertOne, nextId } from "@/lib/store";

export async function GET() {
  return Response.json(readStore("events"));
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = { ...body, id: nextId("E", "events") };
  return Response.json(insertOne("events", item), { status: 201 });
}
