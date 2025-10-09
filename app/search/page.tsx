"use client"

import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function SearchPage() {
  const sp = useSearchParams()
  const q = (sp?.get("q") || "").toLowerCase()
  const role = sp?.get("role") || "student"
  const { data: forums } = useSWR("/api/forums", fetcher)
  const { data: resources } = useSWR("/api/resources", fetcher)
  const { data: coursesResp } = useSWR("/api/courses?role=student", fetcher)

  const threads = (forums?.threads || []).filter((t: any) => {
    const hay = `${t.title} ${t.content} ${t.course} ${(t.tags || []).join(" ")}`
    return hay.toLowerCase().includes(q)
  })
  const res = (resources?.resources || []).filter((r: any) => {
    const hay = `${r.title} ${r.course} ${r.type}`
    return hay.toLowerCase().includes(q)
  })
  const courses = (coursesResp?.courses || []).filter((c: any) => {
    const hay = `${c.name} ${c.code} ${c.instructor}`
    return hay.toLowerCase().includes(q)
  })

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Search results for “{q}”</h1>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Courses ({courses.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {courses.map((c: any) => (
            <Link key={c.id} href={`/student/courses/${c.id}`} className="block hover:underline">
              {c.name} <span className="text-muted-foreground">• {c.code}</span>
            </Link>
          ))}
          {courses.length === 0 && <div className="text-sm text-muted-foreground">No matching courses</div>}
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Forum Threads ({threads.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {threads.map((t: any) => (
            <Link key={t.id} href={`/student/forums?threadId=${t.id}`} className="block hover:underline">
              {t.title}{" "}
              <Badge variant="secondary" className="ml-2">
                {t.course}
              </Badge>
            </Link>
          ))}
          {threads.length === 0 && <div className="text-sm text-muted-foreground">No matching threads</div>}
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Resources ({res.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {res.map((r: any) => (
            <Link
              key={r.id}
              href={`/student/resources?course=${encodeURIComponent(r.course)}`}
              className="block hover:underline"
            >
              {r.title} <span className="text-muted-foreground">• {r.type}</span>{" "}
              <Badge variant="outline" className="ml-2">
                {r.course}
              </Badge>
            </Link>
          ))}
          {res.length === 0 && <div className="text-sm text-muted-foreground">No matching resources</div>}
        </CardContent>
      </Card>
    </div>
  )
}
