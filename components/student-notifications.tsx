"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, MessageSquare, FileText, Clock, User, CheckCircle, Megaphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const mockNotifications = [
  {
    id: 1,
    type: "verified",
    title: "Your answer was verified!",
    message: 'Your answer in "Data Structures" was verified by Prof. Smith',
    timestamp: "2 hours ago",
    isRead: false,
    icon: CheckCircle,
    color: "text-success",
  },
  {
    id: 2,
    type: "reply",
    title: "New reply to your question",
    message: 'Someone replied to your question in "Algorithms"',
    timestamp: "5 hours ago",
    isRead: false,
    icon: MessageSquare,
    color: "text-accent",
  },
  {
    id: 3,
    type: "resource",
    title: "New resource uploaded",
    message: 'New lecture slides uploaded in "Web Development"',
    timestamp: "1 day ago",
    isRead: true,
    icon: FileText,
    color: "text-primary",
  },
  {
    id: 4,
    type: "announcement",
    title: "Course announcement",
    message: "Office hours have been rescheduled to Thursday 2-4 PM",
    timestamp: "2 days ago",
    isRead: true,
    icon: Megaphone,
    color: "text-primary",
  },
  {
    id: 5,
    type: "deadline",
    title: "Assignment deadline approaching",
    message: "Assignment 3 is due in 2 days",
    timestamp: "3 days ago",
    isRead: true,
    icon: Clock,
    color: "text-accent",
  },
]

export function StudentNotifications() {
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
    { icon: BookOpen, label: "Bookmarks", href: "/student/bookmarks" },
    { icon: Clock, label: "Notifications", href: "/student/notifications" },
    { icon: User, label: "Profile", href: "/student/profile" },
  ]

  const unreadCount = mockNotifications.filter((n) => !n.isRead).length

  return (
    <DashboardLayout user={user} menuItems={menuItems} role="student">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Notifications</h1>
            <p className="text-muted-foreground text-lg">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : "You're all caught up!"}
            </p>
          </div>
          <Button variant="outline">Mark all as read</Button>
        </div>

        <div className="space-y-3">
          {mockNotifications.map((notification) => {
            const Icon = notification.icon
            return (
              <Card
                key={notification.id}
                className={`border-2 transition-colors ${notification.isRead ? "bg-card" : "bg-primary/5 border-primary/40"}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 bg-muted rounded-lg ${notification.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className="font-semibold text-lg">{notification.title}</h3>
                        {!notification.isRead && <Badge className="bg-primary">New</Badge>}
                      </div>
                      <p className="text-base text-muted-foreground mb-2">{notification.message}</p>
                      <p className="text-sm text-muted-foreground">{notification.timestamp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}
