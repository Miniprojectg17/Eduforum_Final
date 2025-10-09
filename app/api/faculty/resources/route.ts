import { db, jsonResponse } from "@/lib/mock-db"

export async function GET(request: Request) {
  const { resources, courses } = db()
  const url = new URL(request.url)
  const course = url.searchParams.get("course")
  const fileType = url.searchParams.get("fileType")
  const search = url.searchParams.get("search")
  const sort = url.searchParams.get("sort") // "date" | "downloads" | "title"

  let list = Object.values(resources)

  if (course && course !== "all") list = list.filter((r) => r.courseId === course)
  if (fileType && fileType !== "all") list = list.filter((r) => r.fileType === fileType)
  if (search) {
    const q = search.toLowerCase()
    list = list.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q) ||
        (r.tags || []).some((t) => t.toLowerCase().includes(q)),
    )
  }

  if (sort === "downloads") list.sort((a, b) => b.downloads - a.downloads)
  else if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title))
  else list.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))

  const courseOptions = Object.values(courses).map((c) => ({ id: c.id, name: c.name }))
  return jsonResponse({ resources: list, courseOptions })
}

export async function POST(request: Request) {
  const { resources } = db()
  const body = await request.json()
  const id = `res_${Date.now()}`
  resources[id] = {
    id,
    courseId: body.courseId,
    title: body.title,
    description: body.description || "",
    tags: Array.isArray(body.tags) ? body.tags : [],
    fileType: body.fileType || "other",
    url: body.url || "/generic-file.png",
    uploadedAt: new Date().toISOString(),
    downloads: 0,
  }
  return jsonResponse(resources[id], 201)
}
