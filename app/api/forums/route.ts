import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const courseIdParam = searchParams.get("courseId")

  // Try to filter by course if provided; our Course IDs are strings (cuid),
  // while frontend may pass numeric IDs from the previous mock. We'll ignore
  // the filter if it doesn't match any course.
  let where: any = {}
  if (courseIdParam) {
    // Attempt: treat courseIdParam as a course code or internal id
    // 1) direct id match
    const courseById = await prisma.course.findFirst({ where: { id: courseIdParam } })
    // 2) or code match if numeric was actually a code-like string
    const courseByCode = courseById ? null : await prisma.course.findFirst({ where: { code: courseIdParam } })
    const course = courseById || courseByCode
    if (course) where = { courseId: course.id }
  }

  const threads = await prisma.thread.findMany({
    where,
    include: { replies: true, course: true },
    orderBy: { timestamp: 'desc' },
  })

  const shaped = threads.map((t, i) => ({
    id: i + 1,
    courseId: i + 1, // numeric placeholder for UI compatibility
    course: t.course?.name || '',
    title: t.title,
    content: t.content || '',
    author: t.author,
    authorId: '',
    timestamp: t.timestamp.toISOString(),
    replies: t.replies.length,
    upvotes: 0,
    hasVerifiedAnswer: Boolean(t.verifiedAnswerId),
    tags: [],
  }))

  return NextResponse.json({ threads: shaped })
}

export async function POST(request: Request) {
  const body = await request.json()

  // Find a matching course by direct id or by code or name
  let course = null as null | { id: string }
  if (body.courseId) {
    course = await prisma.course.findFirst({ where: { id: String(body.courseId) } })
  }
  if (!course && body.code) {
    course = await prisma.course.findFirst({ where: { code: String(body.code) } })
  }
  if (!course && body.course) {
    course = await prisma.course.findFirst({ where: { name: String(body.course) } })
  }
  if (!course) {
    // fallback: pick any course to satisfy FK
    course = await prisma.course.findFirst()
  }
  if (!course) {
    return NextResponse.json({ error: 'No course available for thread' }, { status: 400 })
  }

  const created = await prisma.thread.create({
    data: {
      title: body.title,
      content: body.content ?? '',
      author: body.author ?? 'Anonymous',
      courseId: course.id,
    },
    include: { course: true, replies: true },
  })

  const shaped = {
    id: 1,
    courseId: 1,
    course: created.course?.name || '',
    title: created.title,
    content: created.content || '',
    author: created.author,
    authorId: body.authorId ?? '',
    timestamp: created.timestamp.toISOString(),
    replies: created.replies.length,
    upvotes: 0,
    hasVerifiedAnswer: Boolean(created.verifiedAnswerId),
    tags: body.tags || [],
  }

  return NextResponse.json({ thread: shaped })
}
