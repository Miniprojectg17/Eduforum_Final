import { db, jsonResponse } from "@/lib/mock-db"

export async function GET(_: Request, { params }: { params: { courseId: string } }) {
  const { courses } = db()
  const c = courses[params.courseId]
  if (!c) return jsonResponse({ error: "not found" }, 404)
  return jsonResponse(c.resources)
}

export async function POST(request: Request, { params }: { params: { courseId: string } }) {
  const { courses } = db()
  const c = courses[params.courseId]
  if (!c) return jsonResponse({ error: "not found" }, 404)
  const body = await request.json()
  const { title, type, url, meta } = body || {}
  if (!title || !type) return jsonResponse({ error: "title and type required" }, 400)
  const id = String(Date.now())
  c.resources.push({ id, title, type, url, meta })
  return jsonResponse({ ok: true, resource: { id, title, type, url, meta } }, 201)
}
