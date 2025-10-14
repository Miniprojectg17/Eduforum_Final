import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
export const runtime = "nodejs"

// GET /api/profile/student?id=<id>&email=<email>
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const email = searchParams.get("email")

    if (!id && !email) {
      return NextResponse.json({ error: "Provide id or email" }, { status: 400 })
    }

    const profileWithCourses = await prisma.studentProfile.findFirst({
      where: {
        ...(id ? { id } : {}),
        ...(email ? { email } : {}),
      },
      include: {
        enrolledCourses: true,
      },
    })

    if (!profileWithCourses) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const { enrolledCourses, ...profile } = profileWithCourses as any
    return NextResponse.json({ profile, courses: enrolledCourses })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}

// PATCH /api/profile/student?id=<id>
export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const emailParam = searchParams.get("email")
  if (!id && !emailParam) return NextResponse.json({ error: "Missing id or email" }, { status: 400 })

  const body = await req.json().catch(() => ({} as any))
  const phone = body?.phone ?? body?.contact?.phone ?? undefined
  try {
    const updated = await prisma.studentProfile.update({
      where: id ? { id } : { email: String(emailParam) },
      data: {
        name: body?.name,
        email: body?.email,
        prn: body?.prn,
        department: body?.department,
        year: body?.year,
        phone,
        avatarUrl: body?.avatarUrl ?? undefined,
      },
    })
    return NextResponse.json({ profile: updated })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Update failed" }, { status: 400 })
  }
}

// POST /api/profile/student
// Body: { name, email, prn, department, year, phone?, avatarUrl? }
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as any
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const { name, email, prn, department, year, phone, avatarUrl } = body
  if (!name || !email || !prn || !department || !year) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  try {
    const created = await prisma.studentProfile.upsert({
      where: { email },
      update: {
        name,
        prn,
        department,
        year,
        phone,
        avatarUrl,
      },
      create: {
        name,
        email,
        prn,
        department,
        year,
        phone,
        avatarUrl,
      },
    })
    return NextResponse.json({ profile: created }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: "Create failed" }, { status: 400 })
  }
}
