import { NextResponse } from "next/server"
import { db, profilesDB, upsertStudentProfile, getCoursesByIds } from "@/lib/mock-db"

export async function GET(req: Request) {
  db() // ensure seed
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id") || "student1"
  const p = profilesDB.students.get(id)
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const courses = getCoursesByIds(p.enrolledCourseIds)
  return NextResponse.json({ profile: p, courses })
}

export async function PATCH(req: Request) {
  db()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id") || "student1"
  const body = await req.json().catch(() => ({}))
  const existing = profilesDB.students.get(id)
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const updated = upsertStudentProfile({ ...existing, ...body, id })
  return NextResponse.json({ profile: updated })
}
