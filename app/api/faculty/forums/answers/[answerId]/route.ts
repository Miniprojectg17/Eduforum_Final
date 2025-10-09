import { db, jsonResponse } from "@/lib/mock-db"

export async function PATCH(request: Request, { params }: { params: { answerId: string } }) {
  const { courses } = db()
  const body = await request.json()
  const { action, courseId, threadId } = body || {}
  if (!action || !courseId || !threadId) return jsonResponse({ error: "action, courseId, threadId required" }, 400)
  const c = courses[courseId]
  const t = c?.threads.find((t) => t.id === threadId)
  const a = t?.replies.find((r) => r.id === params.answerId)
  if (!a || !t || !c) return jsonResponse({ error: "not found" }, 404)
  if (action === "verify") {
    t.verifiedAnswerId = a.id
    a.status = "verified"
  } else if (action === "incorrect") {
    if (t.verifiedAnswerId === a.id) t.verifiedAnswerId = undefined
    a.status = "incorrect"
  } else {
    return jsonResponse({ error: "unknown action" }, 400)
  }
  return jsonResponse({ ok: true, answer: a, verifiedAnswerId: t.verifiedAnswerId })
}

export async function DELETE(request: Request, { params }: { params: { answerId: string } }) {
  const { courses } = db()
  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get("courseId") || ""
  const threadId = searchParams.get("threadId") || ""
  const c = courses[courseId]
  const t = c?.threads.find((t) => t.id === threadId)
  if (!t || !c) return jsonResponse({ error: "not found" }, 404)
  t.replies = t.replies.filter((r) => r.id !== params.answerId)
  if (t.verifiedAnswerId === params.answerId) t.verifiedAnswerId = undefined
  return jsonResponse({ ok: true })
}
