import { findById, updateOne, deleteOne } from "@/lib/store";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = findById("antiques", id);
  if (!item) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(item);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const updated = updateOne("antiques", id, body);
  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = deleteOne("antiques", id);
  if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
