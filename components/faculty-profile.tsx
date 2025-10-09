"use client"

import useSWR from "swr"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  MessageSquare,
  Upload,
  Megaphone,
  BarChart3,
  User,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function FacultyProfile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [contact, setContact] = useState<{ phone?: string; office?: string }>({})
  const [avatarUrl, setAvatarUrl] = useState<string>("")

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

  const { data, isLoading, mutate } = useSWR<{ profile: any; courses: any[] }>("/api/profile/faculty", fetcher, {
    refreshInterval: 5000,
  })
  const { data: stats } = useSWR<{
    stats: {
      studentsManaged: number
      resourcesUploaded: number
      announcementsMade: number
      postsVerified: number
    }
  }>("/api/faculty/stats", fetcher, { refreshInterval: 5000 })

  if (!user || isLoading || !data) {
    return <div className="text-muted-foreground p-8">Loading profile...</div>
  }

  const { profile, courses } = data

  async function handleSave() {
    const res = await fetch("/api/profile/faculty", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact, avatarUrl }),
    })
    const json = await res.json()
    if (!res.ok) {
      console.error("[v0] Save faculty error", json)
      return
    }
    mutate()
  }

  const menuItems = [
    { icon: BookOpen, label: "Course Management", href: "/faculty/courses" },
    { icon: MessageSquare, label: "Discussion Forums", href: "/faculty/forums" },
    { icon: Upload, label: "Upload Resources", href: "/faculty/resources" },
    { icon: Megaphone, label: "Announcements", href: "/faculty/announcements" },
    { icon: BarChart3, label: "Analytics", href: "/faculty/analytics" },
    { icon: User, label: "Profile", href: "/faculty/profile" },
  ]

  const modules = [
    { name: "Course Management", href: "/faculty/courses" },
    { name: "Discussion Forums", href: "/faculty/forums" },
    { name: "Upload Resources", href: "/faculty/resources" },
    { name: "Announcements", href: "/faculty/announcements" },
    { name: "Analytics", href: "/faculty/analytics" },
  ]

  return (
    <DashboardLayout user={user} menuItems={menuItems} role="faculty">
      <div className="p-8 space-y-6">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Faculty Profile</h1>
            <p className="text-muted-foreground">Manage your details and jump to modules.</p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Avatar URL"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-48"
            />
            <Input
              placeholder="Phone"
              value={contact.phone ?? ""}
              onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
              className="w-48"
            />
            <Input
              placeholder="Office"
              value={contact.office ?? ""}
              onChange={(e) => setContact((c) => ({ ...c, office: e.target.value }))}
              className="w-48"
            />
            <Button onClick={handleSave}>Save</Button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Basic Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium">{profile.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{profile.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Department</div>
                <div className="font-medium">{profile.department}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Designation</div>
                <div className="font-medium">{profile.designation}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Students</div>
                <div className="text-2xl font-bold">{stats?.stats.studentsManaged ?? 0}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Resources</div>
                <div className="text-2xl font-bold">{stats?.stats.resourcesUploaded ?? 0}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Announcements</div>
                <div className="text-2xl font-bold">{stats?.stats.announcementsMade ?? 0}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Posts Verified</div>
                <div className="text-2xl font-bold">{stats?.stats.postsVerified ?? 0}</div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Managed Courses</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {courses.map((c: any) => (
                <a
                  key={c.id}
                  href={`/faculty/courses?course=${c.id}`}
                  className="block border rounded-md p-3 hover:bg-muted"
                >
                  <div className="font-medium">{c.name || c.title}</div>
                  <div className="text-sm text-muted-foreground">{c.code}</div>
                </a>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Modules</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {modules.map((m) => (
                <a
                  key={m.name}
                  href={m.href}
                  className="block border rounded-md p-3 text-center hover:bg-muted"
                >
                  {m.name}
                </a>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  )
}
