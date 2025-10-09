import { db, jsonResponse } from "@/lib/mock-db"

export async function POST(request: Request) {
  const { announcements } = db()
  const body = await request.json()
  const ids: string[] = Array.isArray(body.ids) ? body.ids : []
  const action: "delete" | "pin" | "unpin" = body.action

  if (!ids.length || !action) return jsonResponse({ error: "Invalid payload" }, 400)

  if (action === "delete") {
    ids.forEach((id) => delete announcements[id])
  } else if (action === "pin") {
    ids.forEach((id) => {
      if (announcements[id]) announcements[id].pinned = true
      if (announcements[id]) announcements[id].updatedAt = new Date().toISOString()
    })
  } else if (action === "unpin") {
    ids.forEach((id) => {
      if (announcements[id]) announcements[id].pinned = false
      if (announcements[id]) announcements[id].updatedAt = new Date().toISOString()
    })
  }
  return jsonResponse({ ok: true })
}
