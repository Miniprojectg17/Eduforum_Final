"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, FileText, Clock, User, Bookmark, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const mockBookmarks = [
  {
    id: 1,
    type: "thread",
    course: "Data Structures",
    title: "How to implement a binary search tree?",
    timestamp: "Bookmarked 2 days ago",
    hasVerifiedAnswer: true,
  },
  {
    id: 2,
    type: "resource",
    course: "Web Development",
    title: "React Hooks Tutorial Video",
    timestamp: "Bookmarked 1 week ago",
    size: "125 MB",
  },
  {
    id: 3,
    type: "thread",
    course: "Algorithms",
    title: "Dynamic programming explained",
    timestamp: "Bookmarked 3 days ago",
    hasVerifiedAnswer: false,
  },
  {
    id: 4,
    type: "resource",
    course: "Database Systems",
    title: "SQL Query Examples and Practice",
    timestamp: "Bookmarked 5 days ago",
    size: "1.8 MB",
  },
]

export function StudentBookmarks() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

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
    { icon: Bookmark, label: "Bookmarks", href: "/student/bookmarks" },
    { icon: Clock, label: "Notifications", href: "/student/notifications" },
    { icon: User, label: "Profile", href: "/student/profile" },
  ]

  return (
    <DashboardLayout user={user} menuItems={menuItems} role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Bookmarks</h1>
          <p className="text-muted-foreground text-lg">Your saved threads and resources</p>
        </div>

        {/* Filter by Type */}
        <div className="flex gap-2 flex-wrap">
          {["All", "Threads", "Resources"].map((filter) => (
            <Badge
              key={filter}
              variant={filter === "All" ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 px-4 py-2"
            >
              {filter}
            </Badge>
          ))}
        </div>

        <div className="grid gap-4">
          {mockBookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="border-2 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{bookmark.course}</Badge>
                      <Badge variant="outline">{bookmark.type === "thread" ? "Discussion" : "Resource"}</Badge>
                      {bookmark.type === "thread" && bookmark.hasVerifiedAnswer && (
                        <Badge className="bg-success text-white">Verified Answer</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mb-2">{bookmark.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {bookmark.timestamp}
                      {bookmark.type === "resource" && ` • ${bookmark.size}`}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    View {bookmark.type === "thread" ? "Thread" : "Resource"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
