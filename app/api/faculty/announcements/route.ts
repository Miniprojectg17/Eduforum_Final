import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const course = url.searchParams.get("course")
  const pinned = url.searchParams.get("pinned")
  const from = url.searchParams.get("from")
  const to = url.searchParams.get("to")

  // Resolve course filter to courseId if provided
  let where: any = {}
  if (course && course !== 'all') {
    const byId = await prisma.course.findFirst({ where: { id: course } })
    const byCode = byId ? null : await prisma.course.findFirst({ where: { code: course } })
    const byName = byId || byCode ? null : await prisma.course.findFirst({ where: { name: course } })
    const c = byId || byCode || byName
    if (c) {
      where = { courses: { some: { courseId: c.id } } }
    }
  }
  if (pinned === 'true') where = { ...where, pinned: true }
  if (pinned === 'false') where = { ...where, pinned: false }
  if (from || to) {
    where = {
      ...where,
      createdAt: {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      },
    }
  }

  const [rows, courseList] = await Promise.all([
    prisma.announcement.findMany({
      where,
      include: { courses: { include: { course: true } } },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.course.findMany({ select: { id: true, name: true } }),
  ])

  const announcements = rows.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    courseIds: a.courses.map((ac) => ac.courseId),
    pinned: a.pinned,
    scheduledAt: a.scheduledAt,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }))

  const courseOptions = courseList.map((c) => ({ id: c.id, name: c.name }))
  return NextResponse.json({ announcements, courseOptions })
}

export async function POST(request: Request) {
  const body = await request.json()
  const now = new Date()
  const courseIds: string[] = Array.isArray(body.courseIds) ? body.courseIds.map(String) : []

  // Validate supplied course IDs by resolving codes/names if needed
  const resolvedCourseIds: string[] = []
  for (const cid of courseIds) {
    const byId = await prisma.course.findFirst({ where: { id: cid } })
    const byCode = byId ? null : await prisma.course.findFirst({ where: { code: cid } })
    const byName = byId || byCode ? null : await prisma.course.findFirst({ where: { name: cid } })
    const c = byId || byCode || byName
    if (c) resolvedCourseIds.push(c.id)
  }

  const created = await prisma.announcement.create({
    data: {
      title: body.title || 'Untitled',
      content: body.content || '',
      pinned: !!body.pinned,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
      createdAt: now,
      courses: { create: resolvedCourseIds.map((id) => ({ courseId: id })) },
    },
    include: { courses: true },
  })

  return NextResponse.json({
    id: created.id,
    title: created.title,
    content: created.content,
    courseIds: resolvedCourseIds,
    pinned: created.pinned,
    scheduledAt: created.scheduledAt,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  }, { status: 201 })
}
