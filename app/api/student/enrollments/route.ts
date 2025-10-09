import { NextResponse } from "next/server"
import { db, profilesDB, getCoursesByIds } from "@/lib/mock-db"

export async function GET(req: Request) {
  db()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id") || "student1"
  const p = profilesDB.students.get(id)
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ courses: getCoursesByIds(p.enrolledCourseIds) })
}
