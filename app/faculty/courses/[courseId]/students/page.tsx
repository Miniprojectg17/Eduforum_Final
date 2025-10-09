"use client"

import useSWR from "swr"
import { useParams, useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ManageStudentsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const router = useRouter()
  const { data: students, mutate } = useSWR(`/api/faculty/courses/${courseId}/students`, fetcher, {
    refreshInterval: 10000,
  })
  const [q, setQ] = useState("")
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const filtered = useMemo(
    () =>
      (students || []).filter(
        (s: any) => s.name?.toLowerCase().includes(q.toLowerCase()) || s.email?.toLowerCase().includes(q.toLowerCase()),
      ),
    [students, q],
  )

  const ids = Object.keys(selected).filter((k) => selected[k])

  const bulk = async (action: "approve" | "reject") => {
    await fetch(`/api/faculty/courses/${courseId}/students`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, ids }),
    })
    setSelected({})
    await mutate()
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" onClick={() => router.push("/faculty/courses")}>
          ← Back
        </Button>
        <div className="flex gap-2">
          <Button className="bg-success text-white" disabled={!ids.length} onClick={() => bulk("approve")}>
            Approve Selected
          </Button>
          <Button
            variant="outline"
            className="text-destructive bg-transparent"
            disabled={!ids.length}
            onClick={() => bulk("reject")}
          >
            Reject Selected
          </Button>
        </div>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Manage Students</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Search by name or email..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="grid gap-3">
            {(filtered || []).map((s: any) => (
              <div key={s.id} className="flex items-center justify-between border rounded-lg p-3 bg-card/50">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={!!selected[s.id]}
                    onCheckedChange={(v) => setSelected({ ...selected, [s.id]: !!v })}
                  />
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-sm text-muted-foreground">{s.email}</div>
                  </div>
                </div>
                <div className="text-sm">
                  <span
                    className={`px-2 py-1 rounded ${s.status === "enrolled" ? "bg-success/10 text-success" : "bg-amber-100 text-amber-700"}`}
                  >
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
