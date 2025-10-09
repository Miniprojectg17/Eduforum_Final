"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, Upload, Megaphone, BarChart3, User, CheckCircle, X, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function FacultyForums() {
  const [user, setUser] = useState<any>(null)
  const [selectedThread, setSelectedThread] = useState<number | null>(null)
  const [facultyReply, setFacultyReply] = useState("")
  const [courseId] = useState<string>("1")
  const router = useRouter()
  const [posting, setPosting] = useState(false)

  const { data: courseThreads, mutate } = useSWR(`/api/faculty/courses/${courseId}/forums`, fetcher, {
    refreshInterval: 10000,
  })

  const { data: threadDetail, mutate: mutateThread } = useSWR(
    selectedThread !== null ? `/api/faculty/courses/${courseId}/forums/${selectedThread}` : null,
    fetcher,
  )

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

  const currentThread =
    selectedThread !== null
      ? (threadDetail || courseThreads || []).find(
          (t: any) => t.id === (selectedThread?.toString?.() || selectedThread),
        )
      : null

  const handleVerify = async (answerId: string) => {
    if (!currentThread) return
    const optimistic = { ...(currentThread as any) }
    optimistic.verifiedAnswerId = answerId
    optimistic.replies = optimistic.replies.map((r: any) => (r.id === answerId ? { ...r, status: "verified" } : r))
    await mutateThread(
      async () => {
        await fetch(`/api/faculty/forums/answers/${answerId}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "verify", courseId, threadId: currentThread.id }),
        })
        return (await fetch(`/api/faculty/courses/${courseId}/forums`).then((r) => r.json())) as any
      },
      { revalidate: true },
    )
  }

  const handleIncorrect = async (answerId: string) => {
    if (!currentThread) return
    await mutateThread(
      async () => {
        await fetch(`/api/faculty/forums/answers/${answerId}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "incorrect", courseId, threadId: currentThread.id }),
        })
        return (await fetch(`/api/faculty/courses/${courseId}/forums`).then((r) => r.json())) as any
      },
      { revalidate: true },
    )
  }

  const handleDelete = async (answerId: string) => {
    if (!currentThread) return
    const ok = confirm("Are you sure you want to delete this answer?")
    if (!ok) return
    await mutateThread(
      async () => {
        await fetch(`/api/faculty/forums/answers/${answerId}?courseId=${courseId}&threadId=${currentThread.id}`, {
          method: "DELETE",
        })
        return (await fetch(`/api/faculty/courses/${courseId}/forums`).then((r) => r.json())) as any
      },
      { revalidate: true },
    )
  }

  const postVerifiedAnswer = async () => {
    if (!currentThread || !facultyReply.trim()) return
    setPosting(true)
    await fetch(`/api/faculty/forums/${currentThread.id}/verified-answer`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ courseId, content: facultyReply }),
    })
    setFacultyReply("")
    setPosting(false)
    await mutateThread()
  }

  return (
    <DashboardLayout user={user} menuItems={menuItems} role="faculty">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Discussion Forums</h1>
          <p className="text-muted-foreground text-lg">Moderate discussions and verify student answers</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {["All Questions", "Needs Review", "Data Structures", "Web Development", "Database Systems"].map((tab) => (
            <Badge
              key={tab}
              variant={tab === "All Questions" ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/10 px-4 py-2"
            >
              {tab}
            </Badge>
          ))}
        </div>

        {selectedThread === null ? (
          /* Thread List View */
          <div className="grid gap-4">
            {(courseThreads || []).map((thread: any) => (
              <Card
                key={thread.id}
                className="border-2 hover:border-primary/40 transition-colors cursor-pointer"
                onClick={() => setSelectedThread(thread.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">Course {courseId}</Badge>
                        {thread.verifiedAnswerId ? <Badge className="bg-success text-white">Has Verified</Badge> : null}
                      </div>
                      <CardTitle className="text-xl mb-2">{thread.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <span>by {thread.author}</span>
                        <span>•</span>
                        <span>{thread.timestamp}</span>
                        <span>•</span>
                        <span>{thread.replies?.length || 0} replies</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          /* Thread Detail View with Moderation */
          <div className="space-y-6">
            <Button variant="outline" onClick={() => setSelectedThread(null)} className="mb-4">
              ← Back to Forums
            </Button>

            {/* Original Question */}
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">Course {courseId}</Badge>
                      {currentThread?.verifiedAnswerId ? (
                        <Badge className="bg-success text-white">Verified Answer Present</Badge>
                      ) : null}
                    </div>
                    <CardTitle className="text-2xl">{currentThread?.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-base mt-2">
                      <span>by {currentThread?.author}</span>
                      <span>•</span>
                      <span>{currentThread?.timestamp}</span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive bg-transparent"
                    onClick={() => handleDelete(currentThread.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-base leading-relaxed">
                  {"View and moderate answers below. Post an official verified answer using the form at the end."}
                </p>
              </CardContent>
            </Card>

            {/* Student Answers */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Student Answers ({currentThread?.replies?.length || 0})</h2>
              {(currentThread?.replies || []).map((answer: any) => {
                const isVerified = currentThread?.verifiedAnswerId === answer.id || answer.status === "verified"
                return (
                  <Card key={answer.id} className={`border-2 ${isVerified ? "border-success/60" : ""}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{answer.author}</span>
                            <span className="text-sm text-muted-foreground">• {answer.timestamp}</span>
                            <Badge variant="outline">{answer.upvotes} upvotes</Badge>
                            {answer.status === "incorrect" && (
                              <Badge className="bg-destructive text-white">Incorrect</Badge>
                            )}
                            {isVerified && <Badge className="bg-success text-white">Verified</Badge>}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-base leading-relaxed whitespace-pre-wrap">{answer.content}</p>
                      <div className="flex gap-3 pt-4 border-t">
                        <Button
                          className="bg-success hover:bg-success/90 text-white"
                          onClick={() => handleVerify(answer.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify Answer
                        </Button>
                        <Button
                          variant="outline"
                          className="text-destructive hover:text-destructive bg-transparent"
                          onClick={() => handleIncorrect(answer.id)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Mark Incorrect
                        </Button>
                        <Button
                          variant="outline"
                          className="text-destructive hover:text-destructive bg-transparent"
                          onClick={() => handleDelete(answer.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Faculty Reply Form */}
            <Card className="border-2 border-primary/40">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle>Post Faculty Answer</CardTitle>
                <CardDescription>Your answer will be automatically marked as verified</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <Textarea
                  placeholder="Provide your expert answer to help students..."
                  value={facultyReply}
                  onChange={(e) => setFacultyReply(e.target.value)}
                  className="min-h-[120px]"
                />
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={postVerifiedAnswer}
                  disabled={posting || !facultyReply.trim()}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {posting ? "Posting..." : "Post Verified Answer"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
