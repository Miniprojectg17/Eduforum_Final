"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, Upload, Megaphone, BarChart3, User, Plus, Trash2, Pin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const mockAnnouncements = [
  {
    id: 1,
    course: "All Courses",
    title: "Office Hours Update",
    content: "Office hours will be moved to Thursdays 2-4 PM starting next week.",
    timestamp: "2 days ago",
    isPinned: true,
  },
  {
    id: 2,
    course: "Data Structures",
    title: "Assignment 3 Due Date Extended",
    content: "Due to popular request, Assignment 3 deadline has been extended to Friday.",
    timestamp: "5 days ago",
    isPinned: false,
  },
  {
    id: 3,
    course: "Web Development",
    title: "Guest Lecture Next Week",
    content: "We'll have a guest speaker from Google discussing React best practices.",
    timestamp: "1 week ago",
    isPinned: true,
  },
]

export function FacultyAnnouncements() {
  const [user, setUser] = useState<any>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Announcements</h1>
            <p className="text-muted-foreground text-lg">Create and manage course announcements</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        </div>

        {/* Create Announcement Form */}
        {showCreateForm && (
          <Card className="border-2 border-primary/40">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardTitle>Create New Announcement</CardTitle>
              <CardDescription>Post important updates for your students</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="announcementCourse">Target Course</Label>
                <select
                  id="announcementCourse"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option>All Courses</option>
                  <option>Data Structures & Algorithms</option>
                  <option>Web Development</option>
                  <option>Database Systems</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="announcementTitle">Title</Label>
                <Input id="announcementTitle" placeholder="e.g., Exam Schedule Update" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="announcementContent">Content</Label>
                <Textarea
                  id="announcementContent"
                  placeholder="Write your announcement here..."
                  className="min-h-[120px]"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pinAnnouncement" className="h-4 w-4" />
                <Label htmlFor="pinAnnouncement" className="cursor-pointer">
                  Pin this announcement to the top
                </Label>
              </div>
              <div className="flex gap-3">
                <Button className="bg-primary hover:bg-primary/90">
                  <Megaphone className="h-4 w-4 mr-2" />
                  Post Announcement
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Announcements List */}
        <div className="grid gap-4">
          {mockAnnouncements.map((announcement) => (
            <Card
              key={announcement.id}
              className={`border-2 ${announcement.isPinned ? "border-primary/40 bg-primary/5" : ""}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{announcement.course}</Badge>
                      {announcement.isPinned && (
                        <Badge className="bg-primary text-white gap-1">
                          <Pin className="h-3 w-3" />
                          Pinned
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">{announcement.timestamp}</span>
                    </div>
                    <CardTitle className="text-xl">{announcement.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed">{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
