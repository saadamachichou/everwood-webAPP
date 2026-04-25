import { readStore, insertOne, nextId } from "@/lib/store";

export async function GET() {
  return Response.json(readStore("menu"));
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = { ...body, id: nextId("M", "menu") };
  return Response.json(insertOne("menu", item), { status: 201 });
}
