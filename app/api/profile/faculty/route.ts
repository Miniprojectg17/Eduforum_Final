import { NextResponse } from "next/server"
import { db, profilesDB, upsertFacultyProfile, getCoursesByIds } from "@/lib/mock-db"

export async function GET(req: Request) {
  db()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id") || "faculty1"
  const p = profilesDB.faculty.get(id)
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const courses = getCoursesByIds(p.managedCourseIds)
  return NextResponse.json({ profile: p, courses })
}

export async function PATCH(req: Request) {
  db()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id") || "faculty1"
  const body = await req.json().catch(() => ({}))
  if (body?.email && !String(body.email).includes("@kitcoek")) {
    return NextResponse.json({ error: "Faculty email must be @kitcoek" }, { status: 400 })
  }
  const existing = profilesDB.faculty.get(id)
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const updated = upsertFacultyProfile({ ...existing, ...body, id })
  return NextResponse.json({ profile: updated })
}
