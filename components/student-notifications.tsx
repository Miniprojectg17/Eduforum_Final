"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, MessageSquare, FileText, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import useSWR, { mutate } from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

// Map string names to actual icons
const ICONS: Record<string, any> = {
  BookOpen,
  MessageSquare,
  FileText,
  Clock,
  User,
}

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

  const { data, error } = useSWR(
    user ? `/api/notifications?userId=${encodeURIComponent(user.email)}` : null,
    fetcher,
    { refreshInterval: 10000 }
  )

  if (!user) return null

  const menuItems = [
    { icon: BookOpen, label: "My Courses", href: "/student/courses" },
    { icon: MessageSquare, label: "Discussion Forums", href: "/student/forums" },
    { icon: FileText, label: "Resources", href: "/student/resources" },
    { icon: BookOpen, label: "Bookmarks", href: "/student/bookmarks" },
    { icon: Clock, label: "Notifications", href: "/student/notifications" },
    { icon: User, label: "Profile", href: "/student/profile" },
  ]

  const notifications = data?.notifications || []
  const unreadCount = notifications.filter((n: any) => !n.read && !n.isRead).length

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
          <Button
            variant="outline"
            onClick={async () => {
              try {
                await fetch("/api/notifications", { method: "PATCH" })
              } catch (e) {
                console.log("[v0] Mark-all fallback", e)
              } finally {
                mutate(`/api/notifications?userId=${encodeURIComponent(user.email)}`)
              }
            }}
          >
            Mark all as read
          </Button>
        </div>

        <div className="space-y-3">
          {notifications.map((notification: any) => {
            // Resolve icon safely
            const Icon = typeof notification.icon === "string" ? ICONS[notification.icon] || BookOpen : BookOpen
            const isRead = notification.read ?? notification.isRead

            return (
              <Card
                key={notification.id}
                className={`border-2 transition-colors ${
                  isRead ? "bg-card" : "bg-primary/5 border-primary/40"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 bg-muted rounded-lg ${notification.color || ""}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className="font-semibold text-lg">{notification.title}</h3>
                        {!isRead && <Badge className="bg-primary">New</Badge>}
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
