"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import useSWR, { mutate } from "swr"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, FileText, ThumbsUp, ThumbsDown, CheckCircle, Clock, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function StudentForums() {
  const [user, setUser] = useState<any>(null)
  const [selectedThread, setSelectedThread] = useState<number | null>(null)
  const [newReply, setNewReply] = useState("")
  const [showNewQuestion, setShowNewQuestion] = useState(false)
  const [newQuestion, setNewQuestion] = useState({ title: "", content: "", course: "", tags: "" })
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTag = searchParams?.get("tag") || "All"
  const initialCourse = searchParams?.get("course") || ""
  const threadIdParam = searchParams?.get("threadId")
  const threadTitleParam = searchParams?.get("threadTitle")
  const [activeTag, setActiveTag] = useState<string>(initialTag)
  const [courseFilter, setCourseFilter] = useState<string>(initialCourse)

  // local bookmarks for threads
  const [bookmarkedThreads, setBookmarkedThreads] = useState<Set<number>>(new Set())

  const { data: threadsData, error: threadsError } = useSWR("/api/forums", fetcher, {
    refreshInterval: 5000, // Refresh every 5 seconds
  })

  const { data: repliesData } = useSWR(selectedThread ? `/api/forums/${selectedThread}` : null, fetcher, {
    refreshInterval: 3000,
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

  useEffect(() => {
    const saved = localStorage.getItem("bookmarkedThreads")
    if (saved) {
      try {
        setBookmarkedThreads(new Set(JSON.parse(saved)))
      } catch (_) {}
    }
  }, [])

  useEffect(() => {
    if (threadIdParam) {
      const idNum = Number(threadIdParam)
      if (!Number.isNaN(idNum)) setSelectedThread(idNum)
    }
  }, [threadIdParam])

  useEffect(() => {
    if (threadTitleParam && threadsData) {
      const match = threadsData.threads.find((t: any) => t.title === threadTitleParam)
      if (match) setSelectedThread(match.id)
    }
  }, [threadTitleParam, threadsData])

  const toggleBookmarkThread = (threadId: number) => {
    setBookmarkedThreads((prev) => {
      const next = new Set(prev)
      if (next.has(threadId)) next.delete(threadId)
      else next.add(threadId)
      localStorage.setItem("bookmarkedThreads", JSON.stringify(Array.from(next)))
      return next
    })
  }

  const handlePostReply = async () => {
    if (!newReply.trim() || !selectedThread) return

    try {
      await fetch(`/api/forums/${selectedThread}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: user.name,
          authorId: user.email,
          content: newReply,
        }),
      })

      setNewReply("")
      mutate(`/api/forums/${selectedThread}`)
    } catch (error) {
      console.error("[v0] Error posting reply:", error)
    }
  }

  const handlePostQuestion = async () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) return

    try {
      await fetch("/api/forums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newQuestion,
          author: user.name,
          authorId: user.email,
          courseId: 1,
          tags: newQuestion.tags.split(",").map((t) => t.trim()),
        }),
      })

      setNewQuestion({ title: "", content: "", course: "", tags: "" })
      setShowNewQuestion(false)
      mutate("/api/forums")
    } catch (error) {
      console.error("[v0] Error posting question:", error)
    }
  }

  const handleVote = async (replyId: number, voteType: "up" | "down") => {
    try {
      await fetch(`/api/forums/${selectedThread}/replies/${replyId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteType }),
      })

      mutate(`/api/forums/${selectedThread}`)
    } catch (error) {
      console.error("[v0] Error voting:", error)
    }
  }

  const handleThreadVote = async (threadId: number, voteType: "up" | "down") => {
    try {
      // Optimistic: trigger a revalidation after request
      await fetch(`/api/forums/${threadId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteType }),
      })
    } catch (e) {
      console.error("[v0] Thread vote failed", e)
    } finally {
      mutate("/api/forums")
    }
  }

  const handleReportThread = async (threadId: number) => {
    try {
      await fetch(`/api/forums/${threadId}/report`, { method: "POST" })
    } catch (e) {
      console.log("[v0] Report thread fallback log:", threadId, e)
    }
  }

  if (!user) return null

  const menuItems = [
    { icon: BookOpen, label: "My Courses", href: "/student/courses" },
    { icon: MessageSquare, label: "Discussion Forums", href: "/student/forums" },
    { icon: FileText, label: "Resources", href: "/student/resources" },
    { icon: BookOpen, label: "Bookmarks", href: "/student/bookmarks" },
    { icon: Clock, label: "Notifications", href: "/student/notifications" },
    { icon: User, label: "Profile", href: "/student/profile" },
  ]

  const threads = threadsData?.threads || []
  const replies = repliesData?.replies || []

  // Apply tag/course filters for list view
  const allThreads = threadsData?.threads || []
  const filteredThreads = allThreads.filter((thread: any) => {
    const matchTag = activeTag === "All" || (thread.tags || []).includes(activeTag)
    const matchCourse = !courseFilter || thread.course === courseFilter
    return matchTag && matchCourse
  })

  return (
    <DashboardLayout user={user} menuItems={menuItems} role="student">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Discussion Forums</h1>
            <p className="text-muted-foreground text-lg">Ask questions and engage with peers</p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => setShowNewQuestion(!showNewQuestion)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {showNewQuestion ? "Cancel" : "New Question"}
          </Button>
        </div>

        {showNewQuestion && (
          <Card className="border-2 border-primary/40">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
              <CardTitle>Ask a Question</CardTitle>
              <CardDescription>Get help from your peers and faculty</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="title">Question Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., How to implement a binary search tree?"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="course">Course</Label>
                <Input
                  id="course"
                  placeholder="e.g., Data Structures"
                  value={newQuestion.course}
                  onChange={(e) => setNewQuestion({ ...newQuestion, course: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="content">Question Details</Label>
                <Textarea
                  id="content"
                  placeholder="Provide more details about your question..."
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                  className="min-h-[120px]"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., assignments, trees, algorithms"
                  value={newQuestion.tags}
                  onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handlePostQuestion}>
                Post Question
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filters: Tags + Course quick filter */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {["All", "assignments", "exams", "doubts", "resources"].map((tag) => (
              <Badge
                key={tag}
                variant={activeTag === tag ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 px-4 py-2 transition-colors"
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          {Boolean(allThreads.length) && (
            <div className="flex items-center gap-2">
              <Label htmlFor="forumCourseFilter" className="text-sm">
                Course
              </Label>
              <Input
                id="forumCourseFilter"
                placeholder="Filter by course"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-[200px]"
              />
            </div>
          )}
        </div>

        {selectedThread === null ? (
          /* Thread List View */
          <div className="grid gap-4">
            {filteredThreads.map((thread: any) => (
              <Card
                key={thread.id}
                className="border-2 hover:border-primary/40 transition-all cursor-pointer hover:shadow-md"
                onClick={() => setSelectedThread(thread.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs bg-secondary text-secondary-foreground">
                          {thread.course}
                        </Badge>
                        {thread.hasVerifiedAnswer && (
                          <Badge className="bg-success text-white text-xs gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Verified Answer
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-2 text-balance">{thread.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm flex-wrap">
                        <span>by {thread.author}</span>
                        <span>•</span>
                        <span>{new Date(thread.timestamp).toLocaleString()}</span>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-center gap-1 min-w-[60px]">
                      <button
                        type="button"
                        className="flex flex-col items-center"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleThreadVote(thread.id, "up")
                        }}
                        aria-label="Upvote thread"
                      >
                        <ThumbsUp className="h-5 w-5 text-primary" />
                        <span className="font-bold text-lg text-primary">{thread.upvotes}</span>
                        <span className="text-xs text-muted-foreground">upvotes</span>
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex gap-2 flex-wrap">
                      {thread.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>{thread.replies} replies</span>
                    </div>
                  </div>

                  {/* Thread actions */}
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-2 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedThread(thread.id)
                      }}
                    >
                      Preview Answers
                    </Button>
                    <Button
                      size="sm"
                      variant={bookmarkedThreads.has(thread.id) ? "default" : "outline"}
                      className={
                        bookmarkedThreads.has(thread.id)
                          ? "bg-primary text-primary-foreground"
                          : "border-2 bg-transparent"
                      }
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleBookmarkThread(thread.id)
                      }}
                    >
                      {bookmarkedThreads.has(thread.id) ? "Bookmarked" : "Bookmark"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-2 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleReportThread(thread.id)
                      }}
                    >
                      Report
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-2 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/student/resources?course=${encodeURIComponent(thread.course)}`)
                      }}
                    >
                      Open Course Resources
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Thread Detail View */
          <div className="space-y-6">
            <Button variant="outline" onClick={() => setSelectedThread(null)} className="mb-4">
              ← Back to Forums
            </Button>

            {/* Original Question */}
            {threads
              .filter((t: any) => t.id === selectedThread)
              .map((thread: any) => (
                <Card key={thread.id} className="border-2">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                        {thread.course}
                      </Badge>
                      {thread.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="text-2xl text-balance">{thread.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-base mt-2 flex-wrap">
                      <span>by {thread.author}</span>
                      <span>•</span>
                      <span>{new Date(thread.timestamp).toLocaleString()}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-base leading-relaxed mb-4">{thread.content}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                        <ThumbsUp className="h-4 w-4 text-primary" />
                        <span className="font-medium text-primary">{thread.upvotes}</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {/* Replies */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Answers ({replies.length})</h2>

              {replies.map((reply: any) => (
                <Card
                  key={reply.id}
                  className={`border-2 transition-all ${reply.isVerified ? "border-success/40 bg-success/5" : ""}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-semibold">{reply.author}</span>
                          <span className="text-sm text-muted-foreground">
                            • {new Date(reply.timestamp).toLocaleString()}
                          </span>
                          {reply.isVerified && (
                            <Badge className="bg-success text-white gap-1 ml-2">
                              <CheckCircle className="h-3 w-3" />
                              Verified by {reply.verifiedBy}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-primary/10 transition-colors"
                          onClick={() => handleVote(reply.id, "up")}
                        >
                          <ThumbsUp className="h-4 w-4 text-primary" />
                          <span className="font-medium text-primary">{reply.upvotes}</span>
                        </button>
                        <button
                          className="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-muted transition-colors"
                          onClick={() => handleVote(reply.id, "down")}
                        >
                          <ThumbsDown className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{reply.downvotes}</span>
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Reply Form */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle>Your Answer</CardTitle>
                <CardDescription>Share your knowledge and help your peers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Share your knowledge and help your peers..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  className="min-h-[120px]"
                />
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handlePostReply}>
                  Post Answer
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
