"use client"

import { useEffect, useState } from "react"
import useSWR, { mutate } from "swr"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, Upload, Megaphone, BarChart3, User, File, Trash2, Pencil, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type ResourceItem = {
  id: string
  courseId: string
  title: string
  description?: string
  tags?: string[]
  fileType: "pdf" | "video" | "doc" | "zip" | "link" | "ppt" | "other"
  url?: string
  uploadedAt: string
  downloads: number
}

export function FacultyResources() {
  const [user, setUser] = useState<any>(null)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [filters, setFilters] = useState<{ course: string; fileType: string; search: string; sort: string }>({
    course: "all",
    fileType: "all",
    search: "",
    sort: "date",
  })
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

  const { data, isLoading } = useSWR(
    `/api/faculty/resources?course=${filters.course}&fileType=${filters.fileType}&search=${encodeURIComponent(filters.search)}&sort=${filters.sort}`,
    fetcher,
    { refreshInterval: 5000 },
  )
  const resources: ResourceItem[] = data?.resources || []
  const courseOptions: { id: string; name: string }[] = data?.courseOptions || []

  // Upload/Edit state
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<{
    courseId: string
    title: string
    description: string
    tags: string
    fileType: string
    url?: string
  }>({
    courseId: "",
    title: "",
    description: "",
    tags: "",
    fileType: "pdf",
    url: "",
  })

  const openCreate = () => {
    setEditId(null)
    setForm({ courseId: "", title: "", description: "", tags: "", fileType: "pdf", url: "" })
    setShowUploadForm(true)
  }
  const openEdit = (r: ResourceItem) => {
    setEditId(r.id)
    setForm({
      courseId: r.courseId,
      title: r.title,
      description: r.description || "",
      tags: (r.tags || []).join(", "),
      fileType: r.fileType,
      url: r.url || "",
    })
    setShowUploadForm(true)
  }

  const save = async () => {
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    }
    if (!form.title.trim() || !form.courseId) return
    if (editId) {
      await fetch(`/api/faculty/resources/${editId}`, { method: "PATCH", body: JSON.stringify(payload) })
    } else {
      await fetch(`/api/faculty/resources`, { method: "POST", body: JSON.stringify(payload) })
    }
    setShowUploadForm(false)
    mutate((key: string) => key.startsWith("/api/faculty/resources"), undefined, { revalidate: true })
  }

  const remove = async (id: string) => {
    // optimistic
    mutate(
      `/api/faculty/resources?course=${filters.course}&fileType=${filters.fileType}&search=${encodeURIComponent(filters.search)}&sort=${filters.sort}`,
      (curr: any) => ({ ...curr, resources: (curr?.resources || []).filter((r: ResourceItem) => r.id !== id) }),
      false,
    )
    await fetch(`/api/faculty/resources/${id}`, { method: "DELETE" })
    mutate((key: string) => key.startsWith("/api/faculty/resources"), undefined, { revalidate: true })
  }

  const incrementDownload = async (id: string) => {
    // optimistic increment
    mutate(
      `/api/faculty/resources?course=${filters.course}&fileType=${filters.fileType}&search=${encodeURIComponent(filters.search)}&sort=${filters.sort}`,
      (curr: any) => ({
        ...curr,
        resources: (curr?.resources || []).map((r: ResourceItem) =>
          r.id === id ? { ...r, downloads: r.downloads + 1 } : r,
        ),
      }),
      false,
    )
    await fetch(`/api/faculty/resources/${id}/download`, { method: "POST" })
    mutate((key: string) => key.startsWith("/api/faculty/resources"), undefined, { revalidate: true })
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Resource Management</h1>
            <p className="text-muted-foreground text-lg">Upload and manage course materials</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={openCreate}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Resource
          </Button>
        </div>

        {/* Filters/Search */}
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
              <Label>File Type</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={filters.fileType}
                onChange={(e) => setFilters((f) => ({ ...f, fileType: e.target.value }))}
              >
                <option value="all">All</option>
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="doc">Doc</option>
                <option value="ppt">PPT</option>
                <option value="zip">ZIP</option>
                <option value="link">Link</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Sort By</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={filters.sort}
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
              >
                <option value="date">Newest</option>
                <option value="downloads">Downloads</option>
                <option value="title">Title</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search title, tags..."
                  value={filters.search}
                  onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload / Edit Modal-like card */}
        {showUploadForm && (
          <Card className="border-2 border-primary/40">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardTitle>{editId ? "Edit Resource" : "Upload New Resource"}</CardTitle>
              <CardDescription>Add lecture materials, assignments, or study guides</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Course</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={form.courseId}
                    onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
                  >
                    <option value="">Select course</option>
                    {courseOptions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>File Type</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={form.fileType}
                    onChange={(e) => setForm((f) => ({ ...f, fileType: e.target.value }))}
                  >
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                    <option value="doc">Doc</option>
                    <option value="ppt">PPT</option>
                    <option value="zip">ZIP</option>
                    <option value="link">Link</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <textarea
                  className="w-full min-h-24 rounded-md border border-input bg-background p-3"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} />
              </div>

              {/* Simple drag & drop area (metadata only) */}
              <div
                className="border-2 border-dashed rounded-md p-6 text-sm text-muted-foreground"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files?.[0]
                  if (file) {
                    setForm((f) => ({ ...f, title: f.title || file.name }))
                  }
                }}
              >
                Drag & drop a file here (metadata only for demo), or paste a link URL below
              </div>
              <div className="space-y-2">
                <Label>Link URL (optional)</Label>
                <Input
                  value={form.url}
                  onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-3">
                <Button className="bg-primary hover:bg-primary/90" onClick={save}>
                  {editId ? "Save Changes" : "Upload Resource"}
                </Button>
                <Button variant="outline" onClick={() => setShowUploadForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resources List */}
        <div className="grid gap-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6">Loading resources...</CardContent>
            </Card>
          ) : (
            resources.map((resource) => (
              <Card key={resource.id} className="border-2 hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <File className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <Badge variant="secondary" className="mb-2">
                            {courseOptions.find((c) => c.id === resource.courseId)?.name || resource.courseId}
                          </Badge>
                          <h3 className="text-lg font-semibold mb-1 break-words">{resource.title}</h3>
                          <p className="text-sm text-muted-foreground break-words">{resource.description}</p>
                          {resource.tags?.length ? (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {resource.tags.map((t) => (
                                <Badge key={t} variant="outline">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                          ) : null}
                          <p className="text-xs text-muted-foreground mt-2">
                            Uploaded {new Date(resource.uploadedAt).toLocaleString()} • Type: {resource.fileType}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{resource.downloads} downloads</p>
                          <div className="flex gap-2 mt-2 justify-end">
                            <Button size="sm" variant="outline" onClick={() => openEdit(resource)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive bg-transparent"
                              onClick={() => remove(resource.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        {resource.url ? (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
                            onClick={() => incrementDownload(resource.id)}
                          >
                            Download / Open
                          </a>
                        ) : (
                          <Button size="sm" className="bg-primary" onClick={() => incrementDownload(resource.id)}>
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
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
