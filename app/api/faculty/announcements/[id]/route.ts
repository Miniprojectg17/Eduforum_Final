import { NextResponse } from "next/server"
import { prisma } from "../../../../../lib/prisma"

export const runtime = 'nodejs'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}))

  const existing = await prisma.announcement.findUnique({ where: { id: params.id }, include: { courses: true } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Update basic fields
  const updated = await prisma.announcement.update({
    where: { id: params.id },
    data: {
      ...(body.hasOwnProperty('title') ? { title: String(body.title ?? '') } : {}),
      ...(body.hasOwnProperty('content') ? { content: String(body.content ?? '') } : {}),
      ...(body.hasOwnProperty('pinned') ? { pinned: !!body.pinned } : {}),
      ...(body.hasOwnProperty('scheduledAt') ? { scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null } : {}),
    },
    include: { courses: true },
  })

  // Update course links if provided
  if (Array.isArray(body.courseIds)) {
    const desiredIds: string[] = body.courseIds.map(String)
    // Resolve codes/names to ids
    const resolved: string[] = []
    for (const cid of desiredIds) {
      const byId = await prisma.course.findFirst({ where: { id: cid } })
      const byCode = byId ? null : await prisma.course.findFirst({ where: { code: cid } })
      const byName = byId || byCode ? null : await prisma.course.findFirst({ where: { name: cid } })
      const c = byId || byCode || byName
      if (c) resolved.push(c.id)
    }
    await prisma.$transaction([
      prisma.announcementOnCourse.deleteMany({ where: { announcementId: params.id } }),
      prisma.announcementOnCourse.createMany({ data: resolved.map((courseId) => ({ announcementId: params.id, courseId })) }),
    ])
  }

  const final = await prisma.announcement.findUnique({ where: { id: params.id }, include: { courses: true } })
  if (!final) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({
    id: final.id,
    title: final.title,
    content: final.content,
    courseIds: final.courses.map((ac) => ac.courseId),
    pinned: final.pinned,
    scheduledAt: final.scheduledAt,
    createdAt: final.createdAt.toISOString(),
    updatedAt: final.updatedAt.toISOString(),
  })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const existing = await prisma.announcement.findUnique({ where: { id: params.id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.$transaction([
    prisma.announcementOnCourse.deleteMany({ where: { announcementId: params.id } }),
    prisma.announcement.delete({ where: { id: params.id } }),
  ])
  return NextResponse.json({ ok: true })
}
