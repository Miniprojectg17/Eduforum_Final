"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CreateCoursePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!name || !code) return
    setSaving(true)
    await fetch("/api/faculty/courses", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, code }),
    })
    setSaving(false)
    router.push("/faculty/courses")
  }

  return (
    <div className="container mx-auto max-w-xl py-8">
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Create Course</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Course Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Operating Systems" />
          </div>
          <div>
            <label className="text-sm font-medium">Course Code</label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g., CS410" />
          </div>
          <Button className="w-full" onClick={submit} disabled={saving || !name || !code}>
            {saving ? "Creating..." : "Create Course"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
