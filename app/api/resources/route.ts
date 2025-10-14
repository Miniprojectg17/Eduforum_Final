import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export const runtime = 'nodejs'

function formatSize(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let i = 0
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  return `${size % 1 === 0 ? size : size.toFixed(1)} ${units[i]}`
}

function displayType(fileType?: string | null): string {
  return (fileType || '').toString().toUpperCase() || 'OTHER'
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const courseIdParam = searchParams.get("courseId")

  let where: any = {}
  if (courseIdParam) {
    // match by internal id or by code/name fallback
    const courseById = await prisma.course.findFirst({ where: { id: courseIdParam } })
    const courseByCode = courseById ? null : await prisma.course.findFirst({ where: { code: courseIdParam } })
    const course = courseById || courseByCode
    if (course) where = { courseId: course.id }
  }

  const rows = await prisma.resource.findMany({
    where,
    include: { course: true },
    orderBy: { uploadedAt: 'desc' },
  })

  const resources = rows.map((r, i) => ({
    id: i + 1,
    courseId: i + 1,
    course: r.course?.name || '',
    title: r.title,
    type: displayType(r.fileType as any),
    size: formatSize(r.size ?? undefined),
    uploadedBy: 'TBD',
    uploadDate: r.uploadedAt.toISOString().split('T')[0],
    downloads: r.downloads ?? 0,
    url: r.url || '',
  }))

  return NextResponse.json({ resources })
}

export async function POST(request: Request) {
  const body = await request.json()

  // Locate course by id/code/name
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
    course = await prisma.course.findFirst()
  }
  if (!course) {
    return NextResponse.json({ error: 'No course found for resource' }, { status: 400 })
  }

  // Map type to enum-like value if possible
  const typeRaw: string | undefined = body.type
  const typeMap: Record<string, string> = {
    PDF: 'pdf', VIDEO: 'video', DOC: 'doc', ZIP: 'zip', LINK: 'link', PPT: 'ppt', OTHER: 'other'
  }
  const fileType = typeRaw ? (typeMap[typeRaw.toUpperCase()] || 'other') : 'other'

  const created = await prisma.resource.create({
    data: {
      courseId: course.id,
      title: body.title,
      description: body.description ?? '',
      tags: Array.isArray(body.tags) ? body.tags : [],
      fileType: fileType as any,
      url: body.url ?? '',
      uploadedAt: new Date(),
      downloads: 0,
      mimeType: body.mimeType ?? null,
      size: typeof body.size === 'number' ? body.size : null,
      provider: body.provider ?? null,
      storageKey: body.storageKey ?? null,
      duration: typeof body.duration === 'number' ? body.duration : null,
    },
    include: { course: true },
  })

  const shaped = {
    id: 1,
    courseId: 1,
    course: created.course?.name || '',
    title: created.title,
    type: displayType(created.fileType as any),
    size: formatSize(created.size ?? undefined),
    uploadedBy: body.uploadedBy ?? 'TBD',
    uploadDate: created.uploadedAt.toISOString().split('T')[0],
    downloads: created.downloads ?? 0,
    url: created.url || '',
  }

  return NextResponse.json({ resource: shaped })
}
