"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, FileText, Bookmark, Bell, User } from "lucide-react"
import { CalendarWidget } from "@/components/calendar-widget"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function StudentDashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  const { data: coursesData } = useSWR("/api/courses?role=student", fetcher)
  const { data: forumsData } = useSWR("/api/forums", fetcher)
  const { data: resourcesData } = useSWR("/api/resources", fetcher)
  const { data: notificationsData } = useSWR("/api/notifications", fetcher)

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
    { icon: Bell, label: "Notifications", href: "/student/notifications" },
    { icon: User, label: "Profile", href: "/student/profile" },
  ]

  const activeCourses = coursesData?.courses?.length || 0
  const newReplies = forumsData?.threads?.reduce((sum: number, t: any) => sum + t.replies, 0) || 0
  const newResources = resourcesData?.resources?.length || 0
  const unreadNotifications = notificationsData?.notifications?.filter((n: any) => !n.read).length || 0

  return (
    <DashboardLayout user={user} menuItems={menuItems} role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground text-lg">Your learning dashboard</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all hover:shadow-md cursor-pointer">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle>My Courses</CardTitle>
              <CardDescription>{activeCourses} active courses</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View your enrolled courses and track progress</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 hover:border-accent/40 transition-all hover:shadow-md cursor-pointer">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Discussion Forums</CardTitle>
              <CardDescription>{newReplies} total replies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Engage in course discussions and get answers</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-all hover:shadow-md cursor-pointer">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Resources</CardTitle>
              <CardDescription>{newResources} available files</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Access course materials and downloads</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {notificationsData?.notifications?.slice(0, 3).map((activity: any, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div
                    className={`h-2 w-2 rounded-full mt-2 ${
                      activity.type === "verified"
                        ? "bg-success"
                        : activity.type === "reply"
                          ? "bg-accent"
                          : "bg-primary"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <CalendarWidget />
      </div>
    </DashboardLayout>
  )
}
