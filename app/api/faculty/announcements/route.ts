import { db, jsonResponse } from "@/lib/mock-db"

export async function GET(request: Request) {
  const { announcements, courses } = db()
  const url = new URL(request.url)
  const course = url.searchParams.get("course")
  const pinned = url.searchParams.get("pinned")
  const from = url.searchParams.get("from")
  const to = url.searchParams.get("to")

  let list = Object.values(announcements)

  if (course && course !== "all") {
    list = list.filter((a) => a.courseIds.includes(course))
  }
  if (pinned === "true") list = list.filter((a) => a.pinned)
  if (pinned === "false") list = list.filter((a) => !a.pinned)
  if (from) list = list.filter((a) => new Date(a.createdAt) >= new Date(from))
  if (to) list = list.filter((a) => new Date(a.createdAt) <= new Date(to))

  // sort latest first
  list.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))

  const courseOptions = Object.values(courses).map((c) => ({ id: c.id, name: c.name }))
  return jsonResponse({ announcements: list, courseOptions })
}

export async function POST(request: Request) {
  const { announcements } = db()
  const body = await request.json()
  const id = `an_${Date.now()}`
  const now = new Date().toISOString()
  announcements[id] = {
    id,
    title: body.title || "Untitled",
    content: body.content || "",
    courseIds: Array.isArray(body.courseIds) ? body.courseIds : [],
    pinned: !!body.pinned,
    scheduledAt: body.scheduledAt || null,
    createdAt: now,
    updatedAt: now,
  }
  return jsonResponse(announcements[id], 201)
}
