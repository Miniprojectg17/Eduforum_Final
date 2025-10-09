import { db, jsonResponse } from "@/lib/mock-db"

export async function GET(_: Request, { params }: { params: { courseId: string } }) {
  const { courses } = db()
  const c = courses[params.courseId]
  if (!c) return jsonResponse({ error: "not found" }, 404)
  return jsonResponse(c.threads)
}
