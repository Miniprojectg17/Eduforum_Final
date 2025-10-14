import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma' // or '@/lib/prisma' if your alias works

export const runtime = 'nodejs'

export async function GET() {
  const rows = await prisma.course.findMany()
  const courses = rows.map((c, i) => ({
    id: i + 1,
    code: c.code,
    name: c.name,
    instructor: 'TBD',
    students: 0,
    progress: 0,
    nextClass: 'TBD',
    description: '',
  }))
  return NextResponse.json({ courses })
}

export async function POST(request: Request) {
  const body = await request.json()
  const course = await prisma.course.create({
    data: { code: body.code, name: body.name },
  })
  return NextResponse.json({ course })
}