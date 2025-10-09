import { db, jsonResponse } from "@/lib/mock-db"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { resources } = db()
  const body = await request.json()
  const r = resources[params.id]
  if (!r) return jsonResponse({ error: "Not found" }, 404)
  resources[params.id] = {
    ...r,
    ...("courseId" in body ? { courseId: body.courseId } : {}),
    ...("title" in body ? { title: body.title } : {}),
    ...("description" in body ? { description: body.description } : {}),
    ...("tags" in body ? { tags: body.tags } : {}),
    ...("fileType" in body ? { fileType: body.fileType } : {}),
    ...("url" in body ? { url: body.url } : {}),
  }
  return jsonResponse(resources[params.id])
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { resources } = db()
  if (!resources[params.id]) return jsonResponse({ error: "Not found" }, 404)
  delete resources[params.id]
  return jsonResponse({ ok: true })
}
