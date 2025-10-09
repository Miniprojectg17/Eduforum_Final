"use client"

import useSWR from "swr"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function CourseForumsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const router = useRouter()
  const { data: threads } = useSWR(`/api/faculty/courses/${courseId}/forums`, fetcher, { refreshInterval: 10000 })

  return (
    <div className="container mx-auto py-6 space-y-4">
      <Button variant="outline" onClick={() => router.push("/faculty/courses")}>
        ← Back
      </Button>
      <h1 className="text-3xl font-bold">Course Forums</h1>
      <div className="grid gap-4">
        {(threads || []).map((t: any) => (
          <Card key={t.id} className="border-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{t.title}</CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    <span>by {t.author}</span>
                    <span>•</span>
                    <span>{t.timestamp}</span>
                  </CardDescription>
                </div>
                {t.verifiedAnswerId ? <Badge className="bg-success text-white">Has Verified</Badge> : null}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
