"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Download, FileText, MessageSquare, Users } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ViewCoursePage() {
  const params = useParams<{ courseId: string }>()
  const courseId = Number(params.courseId)
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const menuItems = [
    { icon: FileText, label: "My Courses", href: "/student/courses" },
    { icon: MessageSquare, label: "Discussion Forums", href: "/student/forums" },
    { icon: FileText, label: "Resources", href: "/student/resources" },
    { icon: FileText, label: "Bookmarks", href: "/student/bookmarks" },
    { icon: FileText, label: "Notifications", href: "/student/notifications" },
    { icon: Users, label: "Profile", href: "/student/profile" },
  ]

  const { data: coursesData } = useSWR("/api/courses?role=student", fetcher, { refreshInterval: 15000 })
  const { data: resourcesData } = useSWR(
    Number.isFinite(courseId) ? `/api/resources?courseId=${courseId}` : null,
    fetcher,
    { refreshInterval: 15000 },
  )

  const course = useMemo(
    () => (coursesData?.courses || []).find((c: any) => c.id === courseId),
    [coursesData, courseId],
  )
  const resources = resourcesData?.resources || []

  useEffect(() => {
    const u = localStorage.getItem("user")
    if (!u) {
      router.push("/")
      return
    }
    const parsed = JSON.parse(u)
    if (parsed.role !== "student") {
      router.push("/faculty/dashboard")
      return
    }
    setUser(parsed)
  }, [router])

  if (!user) return null

  return (
    <DashboardLayout user={user} menuItems={menuItems} role="student">
      <div className="space-y-6">
        {course && (
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <CardTitle className="text-2xl">{course.name}</CardTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    {course.code} • {course.instructor}
                  </div>
                </div>
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  {course.progress}% Complete
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{course.students} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{course.nextClass}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="h-4 w-4 text-primary" />
                  <span className="text-sm">{course.materials || resources.length} materials</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Resources</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-2 bg-transparent"
                      onClick={() => router.push(`/student/forums?course=${encodeURIComponent(course.name)}`)}
                    >
                      Open Forums
                    </Button>
                    <Button
                      variant="outline"
                      className="border-2 bg-transparent"
                      onClick={() => router.push(`/student/resources?course=${encodeURIComponent(course.name)}`)}
                    >
                      Open Resources
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {resources.map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm">{r.title}</span>
                      </div>
                      <Button size="sm" variant="ghost" className="h-8">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {resources.length === 0 && (
                    <div className="text-sm text-muted-foreground">No resources yet for this course.</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
