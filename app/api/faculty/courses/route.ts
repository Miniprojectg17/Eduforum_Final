import { db, jsonResponse } from "@/lib/mock-db"

export async function GET() {
  const { courses } = db()
  return jsonResponse(Object.values(courses))
}

export async function POST(request: Request) {
  const body = await request.json()
  const { name, code } = body || {}
  if (!name || !code) return jsonResponse({ error: "name and code required" }, 400)
  const { courses } = db()
  const id = String(Date.now())
  courses[id] = { id, name, code, students: [], resources: [], threads: [] }
  return jsonResponse(courses[id], 201)
}
