"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, Upload, Megaphone, BarChart3, User } from "lucide-react"

export function FacultyDashboard() {
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Faculty Dashboard</h1>
          <p className="text-muted-foreground text-lg">Manage courses and engage with students</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>My Courses</CardTitle>
              <CardDescription>3 active courses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage courses, enroll students, and track progress</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Pending Reviews</CardTitle>
              <CardDescription>8 answers to verify</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Review and verify student answers in forums</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>156 active students</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View engagement metrics and insights</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardTitle>Recent Questions</CardTitle>
              <CardDescription>Unanswered student questions</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  {
                    course: "Data Structures",
                    question: "How do I implement a binary search tree?",
                    student: "John Doe",
                    time: "1 hour ago",
                  },
                  {
                    course: "Algorithms",
                    question: "Can you explain dynamic programming?",
                    student: "Jane Smith",
                    time: "3 hours ago",
                  },
                  {
                    course: "Web Development",
                    question: "What is the difference between REST and GraphQL?",
                    student: "Mike Johnson",
                    time: "5 hours ago",
                  },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-semibold text-primary">{item.course}</span>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="text-sm font-medium mb-1">{item.question}</p>
                    <p className="text-xs text-muted-foreground">Asked by {item.student}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-secondary/10">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {[
                  { icon: Upload, label: "Upload New Resource", color: "text-primary" },
                  { icon: Megaphone, label: "Create Announcement", color: "text-accent" },
                  { icon: MessageSquare, label: "Verify Student Answers", color: "text-success" },
                  { icon: BookOpen, label: "Add New Course", color: "text-primary" },
                ].map((action, i) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={i}
                      className="w-full flex items-center gap-3 p-4 rounded-lg bg-card border-2 border-border hover:border-primary/40 transition-colors text-left"
                    >
                      <Icon className={`h-5 w-5 ${action.color}`} />
                      <span className="font-medium">{action.label}</span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
