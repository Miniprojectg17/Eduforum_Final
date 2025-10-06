"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  MessageSquare,
  Upload,
  Megaphone,
  BarChart3,
  User,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function FacultyAnalytics() {
  const [user, setUser] = useState<any>(null)
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
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground text-lg">Track student engagement and course performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-3xl font-bold">156</CardTitle>
              <CardDescription>Active Students</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-accent mb-2" />
              <CardTitle className="text-3xl font-bold">342</CardTitle>
              <CardDescription>Total Discussions</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-success mb-2" />
              <CardTitle className="text-3xl font-bold">87%</CardTitle>
              <CardDescription>Avg Engagement Rate</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <AlertCircle className="h-8 w-8 text-accent mb-2" />
              <CardTitle className="text-3xl font-bold">12</CardTitle>
              <CardDescription>Unanswered Questions</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Top Discussions */}
        <Card className="border-2">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle>Top Discussions This Week</CardTitle>
            <CardDescription>Most active forum threads</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[
                { course: "Data Structures", title: "Binary Search Tree Implementation", replies: 24, views: 156 },
                { course: "Web Development", title: "React State Management Best Practices", replies: 18, views: 142 },
                { course: "Database Systems", title: "SQL vs NoSQL Comparison", replies: 31, views: 198 },
                { course: "Machine Learning", title: "Neural Network Basics", replies: 15, views: 123 },
              ].map((discussion, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-2">
                      {discussion.course}
                    </Badge>
                    <p className="font-semibold">{discussion.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {discussion.replies} replies • {discussion.views} views
                    </p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Engagement by Course */}
        <Card className="border-2">
          <CardHeader className="bg-gradient-to-r from-accent/5 to-secondary/5">
            <CardTitle>Student Engagement by Course</CardTitle>
            <CardDescription>Average participation rates</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[
                { course: "Web Development", students: 38, engagement: 92 },
                { course: "Data Structures", students: 45, engagement: 85 },
                { course: "Database Systems", students: 42, engagement: 78 },
              ].map((course, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{course.course}</p>
                      <p className="text-sm text-muted-foreground">{course.students} students</p>
                    </div>
                    <Badge className="bg-success text-white">{course.engagement}%</Badge>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                      style={{ width: `${course.engagement}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
