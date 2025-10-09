"use client"

import useSWR from "swr"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ManageCoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const router = useRouter()
  const { data: course, mutate } = useSWR(`/api/faculty/courses/${courseId}`, fetcher)
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    await fetch(`/api/faculty/courses/${courseId}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: name || course?.name, code: code || course?.code }),
    })
    setSaving(false)
    await mutate()
  }

  if (!course) return null

  return (
    <div className="container mx-auto py-6 space-y-4">
      <Button variant="outline" onClick={() => router.push("/faculty/courses")}>
        ← Back
      </Button>
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Manage Course</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Course Name</label>
              <Input defaultValue={course.name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Course Code</label>
              <Input defaultValue={course.code} onChange={(e) => setCode(e.target.value)} />
            </div>
          </div>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
