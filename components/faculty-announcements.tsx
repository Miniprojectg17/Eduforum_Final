"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR, { mutate } from "swr"
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
  Plus,
  Trash2,
  Pin,
  Pencil,
  Calendar,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Announcement = {
  id: string
  title: string
  content: string
  courseIds: string[]
  pinned: boolean
  scheduledAt?: string | null
  createdAt: string
  updatedAt: string
}

export function FacultyAnnouncements() {
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

  // Filters
  const [filters, setFilters] = useState<{
    course: string
    pinned: "all" | "true" | "false"
    from: string
    to: string
  }>({ course: "all", pinned: "all", from: "", to: "" })

  const query = useMemo(() => {
    const qs = new URLSearchParams()
    if (filters.course) qs.set("course", filters.course)
    if (filters.pinned !== "all") qs.set("pinned", filters.pinned)
    if (filters.from) qs.set("from", filters.from)
    if (filters.to) qs.set("to", filters.to)
    return `/api/faculty/announcements?${qs.toString()}`
  }, [filters])

  const { data, isLoading } = useSWR(query, fetcher, { refreshInterval: 5000 })
  const announcements: Announcement[] = data?.announcements || []
  const courseOptions: { id: string; name: string }[] = data?.courseOptions || []

  // Selection for bulk actions
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const allSelected = useMemo(
    () => announcements.length > 0 && announcements.every((a) => selected[a.id]),
    [announcements, selected],
  )
  const toggleSelectAll = () => {
    const next: Record<string, boolean> = {}
    if (!allSelected) {
      announcements.forEach((a) => (next[a.id] = true))
    }
    setSelected(next)
  }
  const selectedIds = useMemo(
    () =>
      Object.entries(selected)
        .filter(([, v]) => v)
        .map(([k]) => k),
    [selected],
  )

  // Create/Edit Form
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<{
    title: string
    content: string
    courseIds: string[]
    pinned: boolean
    scheduledAt: string
  }>({ title: "", content: "", courseIds: [], pinned: false, scheduledAt: "" })

  const openCreate = () => {
    setEditId(null)
    setForm({ title: "", content: "", courseIds: [], pinned: false, scheduledAt: "" })
    setShowForm(true)
  }
  const openEdit = (a: Announcement) => {
    setEditId(a.id)
    setForm({
      title: a.title,
      content: a.content,
      courseIds: a.courseIds,
      pinned: a.pinned,
      scheduledAt: a.scheduledAt ? a.scheduledAt.slice(0, 16) : "",
    })
    setShowForm(true)
  }

  const save = async () => {
    if (!form.title.trim()) return
    const payload = {
      title: form.title,
      content: form.content,
      courseIds: form.courseIds,
      pinned: form.pinned,
      scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
    }

    // Optimistic: for create, prepend; for edit, map update
    if (editId) {
      mutate(
        query,
        (curr: any) => ({
          ...curr,
          announcements: (curr?.announcements || []).map((a: Announcement) =>
            a.id === editId ? { ...a, ...payload, updatedAt: new Date().toISOString() } : a,
          ),
        }),
        false,
      )
      await fetch(`/api/faculty/announcements/${editId}`, { method: "PATCH", body: JSON.stringify(payload) })
    } else {
      const tempId = `temp_${Date.now()}`
      const optimistic: Announcement = {
        id: tempId,
        title: payload.title,
        content: payload.content,
        courseIds: payload.courseIds,
        pinned: payload.pinned,
        scheduledAt: payload.scheduledAt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mutate(query, (curr: any) => ({ ...curr, announcements: [optimistic, ...(curr?.announcements || [])] }), false)
      await fetch(`/api/faculty/announcements`, { method: "POST", body: JSON.stringify(payload) })
    }

    setShowForm(false)
    setEditId(null)
    mutate((key: string) => typeof key === "string" && key.startsWith("/api/faculty/announcements"), undefined, {
      revalidate: true,
    })
  }

  const remove = async (id: string) => {
    mutate(
      query,
      (curr: any) => ({ ...curr, announcements: (curr?.announcements || []).filter((a: Announcement) => a.id !== id) }),
      false,
    )
    await fetch(`/api/faculty/announcements/${id}`, { method: "DELETE" })
    mutate((key: string) => typeof key === "string" && key.startsWith("/api/faculty/announcements"), undefined, {
      revalidate: true,
    })
  }

  const pinToggle = async (a: Announcement, next: boolean) => {
    // optimistic
    mutate(
      query,
      (curr: any) => ({
        ...curr,
        announcements: (curr?.announcements || []).map((x: Announcement) =>
          x.id === a.id ? { ...x, pinned: next, updatedAt: new Date().toISOString() } : x,
        ),
      }),
      false,
    )
    await fetch(`/api/faculty/announcements/${a.id}`, { method: "PATCH", body: JSON.stringify({ pinned: next }) })
    mutate((key: string) => typeof key === "string" && key.startsWith("/api/faculty/announcements"), undefined, {
      revalidate: true,
    })
  }

  const bulkAction = async (action: "delete" | "pin" | "unpin") => {
    if (selectedIds.length === 0) return
    // optimistic
    if (action === "delete") {
      mutate(
        query,
        (curr: any) => ({
          ...curr,
          announcements: (curr?.announcements || []).filter((a: Announcement) => !selectedIds.includes(a.id)),
        }),
        false,
      )
    } else if (action === "pin" || action === "unpin") {
      const nextPinned = action === "pin"
      mutate(
        query,
        (curr: any) => ({
          ...curr,
          announcements: (curr?.announcements || []).map((a: Announcement) =>
            selectedIds.includes(a.id) ? { ...a, pinned: nextPinned, updatedAt: new Date().toISOString() } : a,
          ),
        }),
        false,
      )
    }
    await fetch(`/api/faculty/announcements/bulk`, {
      method: "POST",
      body: JSON.stringify({ ids: selectedIds, action }),
    })
    setSelected({})
    mutate((key: string) => typeof key === "string" && key.startsWith("/api/faculty/announcements"), undefined, {
      revalidate: true,
    })
  }

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Announcements</h1>
            <p className="text-muted-foreground text-lg">Create and manage course announcements</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Announcement
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-2 border-primary/30">
          <CardContent className="pt-6 grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Course</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={filters.course}
                onChange={(e) => setFilters((f) => ({ ...f, course: e.target.value }))}
              >
                <option value="all">All Courses</option>
                {courseOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Pinned</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={filters.pinned}
                onChange={(e) => setFilters((f) => ({ ...f, pinned: e.target.value as any }))}
              >
                <option value="all">All</option>
                <option value="true">Pinned</option>
                <option value="false">Unpinned</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>From</Label>
              <Input
                type="datetime-local"
                value={filters.from}
                onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>To</Label>
              <Input
                type="datetime-local"
                value={filters.to}
                onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
            Select All
          </label>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => bulkAction("pin")}>
              <Pin className="h-4 w-4 mr-1" />
              Pin
            </Button>
            <Button variant="outline" size="sm" onClick={() => bulkAction("unpin")}>
              <Pin className="h-4 w-4 mr-1 rotate-45" />
              Unpin
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive bg-transparent"
              onClick={() => bulkAction("delete")}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>

        {/* Create/Edit "Modal" as Card */}
        {showForm && (
          <Card className="border-2 border-primary/40">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardTitle>{editId ? "Edit Announcement" : "Create New Announcement"}</CardTitle>
              <CardDescription>Post important updates for your students</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Courses</Label>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {courseOptions.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.courseIds.includes(c.id)}
                        onChange={(e) => {
                          const checked = e.target.checked
                          setForm((f) => ({
                            ...f,
                            courseIds: checked ? [...f.courseIds, c.id] : f.courseIds.filter((x) => x !== c.id),
                          }))
                        }}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Exam Schedule Update"
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Write your announcement here..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.pinned}
                    onChange={(e) => setForm((f) => ({ ...f, pinned: e.target.checked }))}
                  />
                  Pin this announcement to the top
                </label>
                <div className="space-y-2">
                  <Label>Schedule (optional)</Label>
                  <Input
                    type="datetime-local"
                    value={form.scheduledAt}
                    onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="bg-primary hover:bg-primary/90" onClick={save}>
                  <Megaphone className="h-4 w-4 mr-2" />
                  {editId ? "Save Changes" : "Post Announcement"}
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Announcements List */}
        <div className="grid gap-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6">Loading announcements...</CardContent>
            </Card>
          ) : announcements.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-muted-foreground">No announcements found.</CardContent>
            </Card>
          ) : (
            announcements.map((a) => (
              <Card key={a.id} className={`border-2 ${a.pinned ? "border-primary/40 bg-primary/5" : ""}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={!!selected[a.id]}
                            onChange={(e) =>
                              setSelected((s) => {
                                const next = { ...s }
                                if (e.target.checked) next[a.id] = true
                                else delete next[a.id]
                                return next
                              })
                            }
                          />
                          Select
                        </label>
                        {a.courseIds.map((cid) => {
                          const c = courseOptions.find((co) => co.id === cid)
                          return (
                            <Badge key={cid} variant="secondary">
                              {c?.name || cid}
                            </Badge>
                          )
                        })}
                        {a.pinned && (
                          <Badge className="bg-primary text-primary-foreground gap-1">
                            <Pin className="h-3 w-3" />
                            Pinned
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          Updated {new Date(a.updatedAt).toLocaleString()}
                        </span>
                      </div>
                      <CardTitle className="text-xl break-words">{a.title}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(a)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive bg-transparent"
                        onClick={() => remove(a.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {a.scheduledAt ? (
                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      Scheduled: {new Date(a.scheduledAt).toLocaleString()}
                    </div>
                  ) : null}
                  <p className="text-base leading-relaxed break-words whitespace-pre-wrap">{a.content}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => pinToggle(a, !a.pinned)}>
                      <Pin className="h-4 w-4 mr-1" />
                      {a.pinned ? "Unpin" : "Pin"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
