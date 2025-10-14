"use client"

import useSWR from "swr"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, FileText, Clock, User, Award, TrendingUp, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function StudentProfile() {
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

  const { data, isLoading, mutate } = useSWR<{ profile: any; courses: any[] }>(
    user?.email ? `/api/profile/student?email=${encodeURIComponent(user.email)}` : null,
    fetcher,
    {
      refreshInterval: 5000,
    },
  )
  const { data: activity } = useSWR<{ activity: { posts: number; replies: number; upvotes: number } }>(
    "/api/forums/activity",
    fetcher,
    { refreshInterval: 5000 },
  )

  const [contact, setContact] = useState<{ phone?: string }>({})
  const [avatarUrl, setAvatarUrl] = useState<string>("")

  if (!user) return null
  if (isLoading || !data) {
    return (
      <DashboardLayout
        user={user}
        role="student"
        menuItems={[
          { icon: BookOpen, label: "My Courses", href: "/student/courses" },
          { icon: MessageSquare, label: "Discussion Forums", href: "/student/forums" },
          { icon: FileText, label: "Resources", href: "/student/resources" },
          { icon: BookOpen, label: "Bookmarks", href: "/student/bookmarks" },
          { icon: Clock, label: "Notifications", href: "/student/notifications" },
          { icon: User, label: "Profile", href: "/student/profile" },
        ]}
      >
        <div className="text-muted-foreground">Loading profile...</div>
      </DashboardLayout>
    )
  }

  const { profile, courses } = data

  async function handleSave() {
    const res = await fetch(`/api/profile/student?email=${encodeURIComponent(user.email)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact, avatarUrl }),
    })
    const json = await res.json()
    if (!res.ok) {
      console.log("[v0] Save student error", json)
      return
    }
    mutate()
  }

  const menuItems = [
    { icon: BookOpen, label: "My Courses", href: "/student/courses" },
    { icon: MessageSquare, label: "Discussion Forums", href: "/student/forums" },
    { icon: FileText, label: "Resources", href: "/student/resources" },
    { icon: BookOpen, label: "Bookmarks", href: "/student/bookmarks" },
    { icon: Clock, label: "Notifications", href: "/student/notifications" },
    { icon: User, label: "Profile", href: "/student/profile" },
  ]

  return (
    <DashboardLayout user={user} menuItems={menuItems} role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground text-lg">Manage your account and view your activity</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2">
              <CardHeader className="text-center bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center">
                  {profile.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatarUrl || "/placeholder.svg"}
                      alt="Avatar"
                      className="w-24 h-24 object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-primary" />
                  )}
                </div>
                <CardTitle className="text-2xl">{profile.name}</CardTitle>
                <CardDescription className="text-base">{profile.email}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <span className="font-medium">Upvotes</span>
                    </div>
                    <span className="text-xl font-bold text-primary">{activity?.activity.upvotes ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="font-medium">Replies</span>
                    </div>
                    <span className="text-xl font-bold text-success">{activity?.activity.replies ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-accent" />
                      <span className="font-medium">Posts</span>
                    </div>
                    <span className="text-xl font-bold">{activity?.activity.posts ?? 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    PRN: <span className="font-medium text-foreground">{profile.prn}</span>
                  </div>
                  <div>
                    Department: <span className="font-medium text-foreground">{profile.department}</span>
                  </div>
                  <div>
                    Year: <span className="font-medium text-foreground">{profile.year}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form + Modules */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Profile Photo URL</Label>
                    <Input
                      id="avatarUrl"
                      placeholder="https://..."
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="9876543210"
                      value={contact.phone ?? ""}
                      onChange={(e) => setContact({ phone: e.target.value })}
                    />
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Modules</CardTitle>
                <CardDescription>Quick access to student modules</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {[
                  { name: "My Courses", href: "/student/courses" },
                  { name: "Discussion Forums", href: "/student/forums" },
                  { name: "Resources", href: "/student/resources" },
                  { name: "Bookmarks", href: "/student/bookmarks" },
                  { name: "Notifications", href: "/student/notifications" },
                  { name: "Announcements", href: "/faculty/announcements" },
                ].map((m) => (
                  <Link key={m.name} href={m.href} className="border rounded-md p-3 text-center hover:bg-muted">
                    {m.name}
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Enrolled Courses</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {courses.map((c: any) => (
                  <Link
                    key={c.id}
                    href={`/student/courses?course=${c.id}`}
                    className="border rounded-md p-3 hover:bg-muted"
                  >
                    <div className="font-medium">{c.name || c.title}</div>
                    <div className="text-sm text-muted-foreground">{c.code}</div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
