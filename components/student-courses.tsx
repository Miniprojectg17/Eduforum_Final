"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, FileText, Users, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function StudentCourses() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const { data: coursesData, error } = useSWR("/api/courses?role=student", fetcher, {
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
    { icon: Users, label: "Profile", href: "/student/profile" },
  ]

  const courses = coursesData?.courses || []

  return (
    <DashboardLayout user={user} menuItems={menuItems} role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">My Courses</h1>
          <p className="text-muted-foreground text-lg">Enrolled courses and progress tracking</p>
        </div>

        {!coursesData && !error && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading courses...</p>
          </div>
        )}

        <div className="grid gap-6">
          {courses.map((course: any) => (
            <Card key={course.id} className="border-2 hover:border-primary/40 transition-all hover:shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-balance">{course.name}</CardTitle>
                    <CardDescription className="text-base mt-1">
                      {course.code} • {course.instructor}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm bg-secondary text-secondary-foreground">
                    {course.progress}% Complete
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Course Progress</span>
                      <span className="text-muted-foreground">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{course.students} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{course.nextClass}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="text-sm">Active</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2 flex-wrap">
                    <button className="flex-1 min-w-[120px] px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm">
                      View Course
                    </button>
                    <button className="px-4 py-2 border-2 border-border rounded-lg hover:border-primary/40 hover:bg-primary/5 transition-colors font-medium text-sm">
                      Forums
                    </button>
                    <button className="px-4 py-2 border-2 border-border rounded-lg hover:border-primary/40 hover:bg-primary/5 transition-colors font-medium text-sm">
                      Resources
                    </button>
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
