import { db, jsonResponse } from "@/lib/mock-db"

export async function GET(_: Request, { params }: { params: { courseId: string } }) {
  const { courses } = db()
  const c = courses[params.courseId]
  if (!c) return jsonResponse({ error: "not found" }, 404)
  return jsonResponse(c)
}

export async function PUT(request: Request, { params }: { params: { courseId: string } }) {
  const { courses } = db()
  const c = courses[params.courseId]
  if (!c) return jsonResponse({ error: "not found" }, 404)
  const body = await request.json()
  courses[params.courseId] = { ...c, ...body }
  return jsonResponse(courses[params.courseId])
}

export async function DELETE(_: Request, { params }: { params: { courseId: string } }) {
  const { courses } = db()
  if (!courses[params.courseId]) return jsonResponse({ error: "not found" }, 404)
  delete courses[params.courseId]
  return jsonResponse({ ok: true })
}
