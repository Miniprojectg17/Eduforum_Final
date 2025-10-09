"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, Upload, Megaphone, BarChart3, User, Users, Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const mockCourses = [
  {
    id: 1,
    name: "Data Structures & Algorithms",
    code: "CS301",
    students: 45,
    pendingQuestions: 3,
    resources: 12,
    avgEngagement: 85,
  },
  {
    id: 2,
    name: "Web Development",
    code: "CS402",
    students: 38,
    pendingQuestions: 5,
    resources: 18,
    avgEngagement: 92,
  },
  {
    id: 3,
    name: "Database Systems",
    code: "CS350",
    students: 42,
    pendingQuestions: 2,
    resources: 15,
    avgEngagement: 78,
  },
]

export function FacultyCourses() {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Course Management</h1>
            <p className="text-muted-foreground text-lg">Manage your courses and enrolled students</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push("/faculty/courses/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>

        <div className="grid gap-6">
          {mockCourses.map((course) => (
            <Card key={course.id} className="border-2 hover:border-primary/40 transition-colors">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <CardDescription className="text-base mt-1">{course.code}</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Course Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Students</span>
                      </div>
                      <p className="text-2xl font-bold">{course.students}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium">Pending</span>
                      </div>
                      <p className="text-2xl font-bold text-accent">{course.pendingQuestions}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Upload className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Resources</span>
                      </div>
                      <p className="text-2xl font-bold">{course.resources}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium">Engagement</span>
                      </div>
                      <p className="text-2xl font-bold text-success">{course.avgEngagement}%</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <Link href={`/faculty/courses/${course.id}/students`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        <span className="flex items-center justify-center">
                          <Users className="h-4 w-4 mr-2" />
                          Manage Students
                        </span>
                      </Button>
                    </Link>
                    <Link href={`/faculty/courses/${course.id}/forums`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        <span className="flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          View Forums
                        </span>
                      </Button>
                    </Link>
                    <Link href={`/faculty/courses/${course.id}/resources`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        <span className="flex items-center justify-center">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Resources
                        </span>
                      </Button>
                    </Link>
                  </div>
                  <div className="pt-2">
                    <Link href={`/faculty/courses/${course.id}/manage`}>
                      <Button variant="ghost" className="px-0 text-primary hover:text-primary underline">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Course
                      </Button>
                    </Link>
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
