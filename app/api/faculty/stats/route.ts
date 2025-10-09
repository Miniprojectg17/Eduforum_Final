import { NextResponse } from "next/server"
import { db, profilesDB } from "@/lib/mock-db"

export async function GET() {
  db()
  const p = profilesDB.faculty.get("faculty1")
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ stats: p.stats })
}
