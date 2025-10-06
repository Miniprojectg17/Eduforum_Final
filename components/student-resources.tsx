"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, MessageSquare, FileText, Download, Eye, Clock, User, File, Video, ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function StudentResources() {
  const [user, setUser] = useState<any>(null)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const router = useRouter()

  const { data: resourcesData, error } = useSWR("/api/resources", fetcher, {
    refreshInterval: 10000,
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "student") {
      router.push("/faculty/dashboard")
      return
    }
    setUser(parsedUser)
  }, [router])

  if (!user) return null

  const menuItems = [
    { icon: BookOpen, label: "My Courses", href: "/student/courses" },
    { icon: MessageSquare, label: "Discussion Forums", href: "/student/forums" },
    { icon: FileText, label: "Resources", href: "/student/resources" },
    { icon: BookOpen, label: "Bookmarks", href: "/student/bookmarks" },
    { icon: Clock, label: "Notifications", href: "/student/notifications" },
    { icon: User, label: "Profile", href: "/student/profile" },
  ]

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
      case "mp4":
        return <Video className="h-8 w-8 text-accent" />
      case "image":
      case "jpg":
      case "png":
        return <ImageIcon className="h-8 w-8 text-primary" />
      default:
        return <File className="h-8 w-8 text-primary" />
    }
  }

  const resources = resourcesData?.resources || []

  const filteredResources = selectedCourse ? resources.filter((r: any) => r.course === selectedCourse) : resources

  const courses = ["All Courses", ...Array.from(new Set(resources.map((r: any) => r.course)))]

  return (
    <DashboardLayout user={user} menuItems={menuItems} role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Course Resources</h1>
          <p className="text-muted-foreground text-lg">Access lecture materials, assignments, and study guides</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {courses.map((course) => (
            <Badge
              key={course}
              variant={
                course === "All Courses" && !selectedCourse
                  ? "default"
                  : selectedCourse === course
                    ? "default"
                    : "outline"
              }
              className="cursor-pointer hover:bg-primary/10 px-4 py-2 transition-colors"
              onClick={() => setSelectedCourse(course === "All Courses" ? null : course)}
            >
              {course}
            </Badge>
          ))}
        </div>

        {!resourcesData && !error && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading resources...</p>
          </div>
        )}

        {/* Resources Grid */}
        <div className="grid gap-4">
          {filteredResources.map((resource: any) => (
            <Card key={resource.id} className="border-2 hover:border-primary/40 transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 flex-wrap md:flex-nowrap">
                  <div className="p-3 bg-primary/10 rounded-lg">{getFileIcon(resource.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        <Badge variant="secondary" className="mb-2 bg-secondary text-secondary-foreground">
                          {resource.course}
                        </Badge>
                        <h3 className="text-lg font-semibold mb-1 text-balance">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Uploaded by {resource.uploadedBy} • {resource.uploadDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{resource.size}</p>
                        <p className="text-xs text-muted-foreground">{resource.downloads} downloads</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 flex-wrap">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" className="hover:bg-primary/5 bg-transparent">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="hover:bg-primary/5 bg-transparent">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Bookmark
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
