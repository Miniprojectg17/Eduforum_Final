import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const email = searchParams.get("email")

    if (!id && !email) {
      return NextResponse.json({ error: "Provide id or email" }, { status: 400 })
    }

    const profile = await prisma.facultyProfile.findFirst({
      where: {
        ...(id ? { id } : {}),
        ...(email ? { email } : {}),
      },
    })

    if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ profile })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const emailParam = searchParams.get("email")
  if (!id && !emailParam) return NextResponse.json({ error: "Missing id or email" }, { status: 400 })

  const body = await req.json().catch(() => ({} as any))
  if (body?.email && !String(body.email).includes("@kitcoek")) {
    return NextResponse.json({ error: "Faculty email must be @kitcoek" }, { status: 400 })
  }
  try {
    const updated = await prisma.facultyProfile.update({
      where: id ? { id } : { email: String(emailParam) },
      data: {
        name: body?.name,
        email: body?.email,
        department: body?.department,
        designation: body?.designation,
        phone: body?.phone ?? undefined,
        office: body?.office ?? undefined,
        avatarUrl: body?.avatarUrl ?? undefined,
      },
    })
    return NextResponse.json({ profile: updated })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Update failed" }, { status: 400 })
  }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as any
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

  const { name, email, department, designation, phone, office, avatarUrl } = body
  if (!name || !email || !department || !designation) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  if (!String(email).includes("@kitcoek")) {
    return NextResponse.json({ error: "Faculty email must be @kitcoek" }, { status: 400 })
  }

  try {
    const created = await prisma.facultyProfile.upsert({
      where: { email },
      update: {
        name,
        department,
        designation,
        phone,
        office,
        avatarUrl,
      },
      create: {
        name,
        email,
        department,
        designation,
        phone,
        office,
        avatarUrl,
      },
    })
    return NextResponse.json({ profile: created }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: "Create failed" }, { status: 400 })
  }
}
