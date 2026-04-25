import { readStore, insertOne, nextId } from "@/lib/store";

export async function GET() {
  return Response.json(readStore("antiques"));
}

export async function POST(req: Request) {
  const body = await req.json();
  const item = { ...body, id: nextId("ANT", "antiques") };
  return Response.json(insertOne("antiques", item), { status: 201 });
}
