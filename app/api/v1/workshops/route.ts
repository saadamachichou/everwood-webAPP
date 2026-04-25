import { readStore, insertOne, nextId } from "@/lib/store";

export async function GET() {
  return Response.json(readStore("workshops"));
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = { ...body, id: nextId("W", "workshops") };
  return Response.json(insertOne("workshops", item), { status: 201 });
}
