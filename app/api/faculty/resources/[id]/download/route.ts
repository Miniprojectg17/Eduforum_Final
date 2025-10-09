import { db, jsonResponse } from "@/lib/mock-db"

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const { resources } = db()
  const r = resources[params.id]
  if (!r) return jsonResponse({ error: "Not found" }, 404)
  r.downloads += 1
  return jsonResponse({ downloads: r.downloads })
}
