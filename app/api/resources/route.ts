import { NextResponse } from "next/server"

const resourcesDB = [
  {
    id: 1,
    courseId: 1,
    course: "Data Structures",
    title: "Lecture 5: Binary Trees",
    type: "PDF",
    size: "2.4 MB",
    uploadedBy: "Prof. Smith",
    uploadDate: "2024-01-15",
    downloads: 45,
    url: "/placeholder.pdf",
  },
  {
    id: 2,
    courseId: 1,
    course: "Data Structures",
    title: "Assignment 3: BST Implementation",
    type: "PDF",
    size: "1.2 MB",
    uploadedBy: "Prof. Smith",
    uploadDate: "2024-01-14",
    downloads: 38,
    url: "/placeholder.pdf",
  },
  {
    id: 3,
    courseId: 2,
    course: "Web Development",
    title: "React Hooks Tutorial",
    type: "Video",
    size: "125 MB",
    uploadedBy: "Prof. Johnson",
    uploadDate: "2024-01-13",
    downloads: 52,
    url: "/placeholder.mp4",
  },
  {
    id: 4,
    courseId: 2,
    course: "Web Development",
    title: "Next.js Project Template",
    type: "ZIP",
    size: "5.8 MB",
    uploadedBy: "Prof. Johnson",
    uploadDate: "2024-01-12",
    downloads: 41,
    url: "/placeholder.zip",
  },
  {
    id: 5,
    courseId: 3,
    course: "Database Systems",
    title: "SQL Cheat Sheet",
    type: "PDF",
    size: "0.8 MB",
    uploadedBy: "Prof. Williams",
    uploadDate: "2024-01-11",
    downloads: 67,
    url: "/placeholder.pdf",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get("courseId")

  await new Promise((resolve) => setTimeout(resolve, 300))

  let filteredResources = resourcesDB
  if (courseId) {
    filteredResources = resourcesDB.filter((r) => r.courseId === Number.parseInt(courseId))
  }

  return NextResponse.json({ resources: filteredResources })
}

export async function POST(request: Request) {
  const body = await request.json()

  const newResource = {
    id: resourcesDB.length + 1,
    courseId: body.courseId,
    course: body.course,
    title: body.title,
    type: body.type,
    size: body.size,
    uploadedBy: body.uploadedBy,
    uploadDate: new Date().toISOString().split("T")[0],
    downloads: 0,
    url: body.url,
  }

  resourcesDB.push(newResource)

  return NextResponse.json({ resource: newResource })
}
