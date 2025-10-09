import { db, jsonResponse } from "@/lib/mock-db"

export async function GET(_: Request, { params }: { params: { courseId: string } }) {
  const { courses } = db()
  const c = courses[params.courseId]
  if (!c) return jsonResponse({ error: "not found" }, 404)
  return jsonResponse(c.students)
}

export async function POST(request: Request, { params }: { params: { courseId: string } }) {
  const { courses } = db()
  const c = courses[params.courseId]
  if (!c) return jsonResponse({ error: "not found" }, 404)
  const body = await request.json()
  const { action, ids } = body as { action: "approve" | "reject"; ids: string[] }
  if (!action || !ids?.length) return jsonResponse({ error: "action and ids required" }, 400)
  if (action === "approve") {
    c.students = c.students.map((s) => (ids.includes(s.id) ? { ...s, status: "enrolled" } : s))
  } else {
    c.students = c.students.filter((s) => !ids.includes(s.id))
  }
  return jsonResponse({ ok: true, students: c.students })
}
