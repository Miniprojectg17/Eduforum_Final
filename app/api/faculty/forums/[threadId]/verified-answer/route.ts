import { db, jsonResponse } from "@/lib/mock-db"

export async function POST(request: Request, { params }: { params: { threadId: string } }) {
  const { courses } = db()
  const body = await request.json()
  const { courseId, content, author = "Faculty" } = body || {}
  const c = courses[courseId]
  const t = c?.threads.find((th) => th.id === params.threadId)
  if (!t || !c) return jsonResponse({ error: "not found" }, 404)
  const id = String(Date.now())
  const answer = { id, author, content, timestamp: "just now", upvotes: 0, status: "verified" as const }
  t.replies.unshift(answer)
  t.verifiedAnswerId = id
  return jsonResponse({ ok: true, answer, verifiedAnswerId: id }, 201)
}
