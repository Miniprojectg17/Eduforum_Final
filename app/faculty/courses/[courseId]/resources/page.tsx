"use client"

import useSWR from "swr"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function CourseResourcesPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const router = useRouter()
  const { data: resources, mutate } = useSWR(`/api/faculty/courses/${courseId}/resources`, fetcher, {
    refreshInterval: 10000,
  })
  const [title, setTitle] = useState("")
  const [type, setType] = useState<"file" | "video" | "link" | "">("")
  const [url, setUrl] = useState("")
  const [meta, setMeta] = useState("")
  const [saving, setSaving] = useState(false)

  const add = async () => {
    if (!title || !type) return
    setSaving(true)
    await fetch(`/api/faculty/courses/${courseId}/resources`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, type, url, meta }),
    })
    setSaving(false)
    setTitle("")
    setType("")
    setUrl("")
    setMeta("")
    await mutate()
  }

  return (
    <div className="container mx-auto py-6 space-y-4">
      <Button variant="outline" onClick={() => router.push("/faculty/courses")}>
        ← Back
      </Button>
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Upload Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., BST Lecture Slides" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Type</label>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">URL (optional)</label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Metadata (optional)</label>
            <Input value={meta} onChange={(e) => setMeta(e.target.value)} placeholder="e.g., Week 3, Chapter 5" />
          </div>
          <Button onClick={add} disabled={saving || !title || !type}>
            {saving ? "Saving..." : "Add Resource"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {(resources || []).map((r: any) => (
          <div key={r.id} className="border rounded-lg p-3 bg-card/50">
            <div className="font-medium">{r.title}</div>
            <div className="text-sm text-muted-foreground">
              {r.type} {r.url ? `• ${r.url}` : ""} {r.meta ? `• ${r.meta}` : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
