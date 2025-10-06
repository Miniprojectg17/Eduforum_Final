"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, Upload, Megaphone, BarChart3, User, CheckCircle, X, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const mockThreads = [
  {
    id: 1,
    course: "Data Structures",
    title: "How to implement a binary search tree?",
    author: "John Doe",
    timestamp: "2 hours ago",
    replies: 5,
    needsReview: true,
  },
  {
    id: 2,
    course: "Web Development",
    title: "Best practices for React state management?",
    author: "Jane Smith",
    timestamp: "5 hours ago",
    replies: 8,
    needsReview: false,
  },
  {
    id: 3,
    course: "Database Systems",
    title: "SQL vs NoSQL - When to use which?",
    author: "Mike Johnson",
    timestamp: "1 day ago",
    replies: 12,
    needsReview: true,
  },
]

const mockAnswers = [
  {
    id: 1,
    author: "Alice Brown",
    content:
      "A binary search tree is a node-based data structure where each node has at most two children. The left child contains values less than the parent, and the right child contains values greater than the parent.",
    timestamp: "1 hour ago",
    upvotes: 8,
    isVerified: false,
  },
  {
    id: 2,
    author: "Bob Wilson",
    content:
      "Here's a simple implementation in Python:\n\nclass Node:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None",
    timestamp: "45 minutes ago",
    upvotes: 5,
    isVerified: false,
  },
]

export function FacultyForums() {
  const [user, setUser] = useState<any>(null)
  const [selectedThread, setSelectedThread] = useState<number | null>(null)
  const [facultyReply, setFacultyReply] = useState("")
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
            {mockThreads.map((thread) => (
              <Card
                key={thread.id}
                className="border-2 hover:border-primary/40 transition-colors cursor-pointer"
                onClick={() => setSelectedThread(thread.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{thread.course}</Badge>
                        {thread.needsReview && <Badge className="bg-accent text-white">Needs Review</Badge>}
                      </div>
                      <CardTitle className="text-xl mb-2">{thread.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 text-sm">
                        <span>by {thread.author}</span>
                        <span>•</span>
                        <span>{thread.timestamp}</span>
                        <span>•</span>
                        <span>{thread.replies} replies</span>
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
                      <Badge variant="secondary">Data Structures</Badge>
                    </div>
                    <CardTitle className="text-2xl">How to implement a binary search tree?</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-base mt-2">
                      <span>by John Doe</span>
                      <span>•</span>
                      <span>2 hours ago</span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive bg-transparent"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-base leading-relaxed">
                  I'm working on the assignment for implementing a binary search tree, but I'm confused about how to
                  structure the insert and search methods. Can someone explain the logic and maybe provide a simple
                  example?
                </p>
              </CardContent>
            </Card>

            {/* Student Answers with Verification Controls */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Student Answers ({mockAnswers.length})</h2>

              {mockAnswers.map((answer) => (
                <Card key={answer.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{answer.author}</span>
                          <span className="text-sm text-muted-foreground">• {answer.timestamp}</span>
                          <Badge variant="outline">{answer.upvotes} upvotes</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-base leading-relaxed whitespace-pre-wrap">{answer.content}</p>

                    {/* Faculty Moderation Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button className="bg-success hover:bg-success/90 text-white">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify Answer
                      </Button>
                      <Button variant="outline" className="text-destructive hover:text-destructive bg-transparent">
                        <X className="h-4 w-4 mr-2" />
                        Mark Incorrect
                      </Button>
                      <Button variant="outline" className="text-destructive hover:text-destructive bg-transparent">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                <Button className="bg-primary hover:bg-primary/90">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Post Verified Answer
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
