import { insertOne, nextId, readStore } from "@/lib/store";

export async function GET() {
  return Response.json(readStore("cod-orders"));
}

export async function POST(req: Request) {
  const body = await req.json();
  const order = {
    ...body,
    id: nextId("COD", "cod-orders"),
  };

  return Response.json(insertOne("cod-orders", order), { status: 201 });
}
