"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, Upload, Megaphone, BarChart3, User, File, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const mockResources = [
  {
    id: 1,
    course: "Data Structures",
    title: "Lecture 5: Binary Trees and Traversals",
    type: "pdf",
    size: "2.4 MB",
    uploadedAt: "2 days ago",
    downloads: 45,
  },
  {
    id: 2,
    course: "Web Development",
    title: "React Hooks Tutorial Video",
    type: "video",
    size: "125 MB",
    uploadedAt: "1 week ago",
    downloads: 38,
  },
  {
    id: 3,
    course: "Database Systems",
    title: "SQL Query Examples and Practice",
    type: "pdf",
    size: "1.8 MB",
    uploadedAt: "3 days ago",
    downloads: 52,
  },
]

export function FacultyResources() {
  const [user, setUser] = useState<any>(null)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "faculty") {
      router.push("/student/dashboard")
      return
    }
    setUser(parsedUser)
  }, [router])

  if (!user) return null

  const menuItems = [
    { icon: BookOpen, label: "Course Management", href: "/faculty/courses" },
    { icon: MessageSquare, label: "Discussion Forums", href: "/faculty/forums" },
    { icon: Upload, label: "Upload Resources", href: "/faculty/resources" },
    { icon: Megaphone, label: "Announcements", href: "/faculty/announcements" },
    { icon: BarChart3, label: "Analytics", href: "/faculty/analytics" },
    { icon: User, label: "Profile", href: "/faculty/profile" },
  ]

  return (
    <DashboardLayout user={user} menuItems={menuItems} role="faculty">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Resource Management</h1>
            <p className="text-muted-foreground text-lg">Upload and manage course materials</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowUploadForm(!showUploadForm)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Resource
          </Button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <Card className="border-2 border-primary/40">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardTitle>Upload New Resource</CardTitle>
              <CardDescription>Add lecture materials, assignments, or study guides</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <select id="course" className="w-full h-10 px-3 rounded-md border border-input bg-background">
                  <option>Data Structures & Algorithms</option>
                  <option>Web Development</option>
                  <option>Database Systems</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Resource Title</Label>
                <Input id="title" placeholder="e.g., Lecture 6: Graph Algorithms" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File Upload</Label>
                <Input id="file" type="file" />
                <p className="text-xs text-muted-foreground">Supported formats: PDF, PPT, DOCX, MP4, ZIP</p>
              </div>
              <div className="flex gap-3">
                <Button className="bg-primary hover:bg-primary/90">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Resource
                </Button>
                <Button variant="outline" onClick={() => setShowUploadForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resources List */}
        <div className="grid gap-4">
          {mockResources.map((resource) => (
            <Card key={resource.id} className="border-2 hover:border-primary/40 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <File className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-2">
                          {resource.course}
                        </Badge>
                        <h3 className="text-lg font-semibold mb-1">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Uploaded {resource.uploadedAt} • {resource.size}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{resource.downloads} downloads</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive bg-transparent"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
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
