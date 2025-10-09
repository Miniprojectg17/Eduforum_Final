import { db, jsonResponse } from "@/lib/mock-db"

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const { announcements } = db()
  const body = await _req.json()
  const a = announcements[params.id]
  if (!a) return jsonResponse({ error: "Not found" }, 404)
  announcements[params.id] = {
    ...a,
    ...("title" in body ? { title: body.title } : {}),
    ...("content" in body ? { content: body.content } : {}),
    ...("courseIds" in body ? { courseIds: body.courseIds } : {}),
    ...("pinned" in body ? { pinned: !!body.pinned } : {}),
    ...("scheduledAt" in body ? { scheduledAt: body.scheduledAt } : {}),
    updatedAt: new Date().toISOString(),
  }
  return jsonResponse(announcements[params.id])
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { announcements } = db()
  if (!announcements[params.id]) return jsonResponse({ error: "Not found" }, 404)
  delete announcements[params.id]
  return jsonResponse({ ok: true })
}
