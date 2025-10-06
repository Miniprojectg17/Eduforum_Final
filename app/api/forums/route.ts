import { NextResponse } from "next/server"

// Mock forum threads database
const threadsDB = [
  {
    id: 1,
    courseId: 1,
    course: "Data Structures",
    title: "How to implement a binary search tree?",
    content:
      "I'm working on the assignment for implementing a binary search tree, but I'm confused about how to structure the insert and search methods. Can someone explain the logic and maybe provide a simple example?",
    author: "John Doe",
    authorId: "student1",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    replies: 5,
    upvotes: 12,
    hasVerifiedAnswer: true,
    tags: ["assignments", "trees"],
  },
  {
    id: 2,
    courseId: 2,
    course: "Web Development",
    title: "Best practices for React state management?",
    content: "What are the current best practices for managing state in large React applications?",
    author: "Jane Smith",
    authorId: "student2",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    replies: 8,
    upvotes: 20,
    hasVerifiedAnswer: true,
    tags: ["doubts", "react"],
  },
  {
    id: 3,
    courseId: 4,
    course: "Algorithms",
    title: "Can someone explain dynamic programming?",
    content: "I'm struggling to understand the concept of dynamic programming and when to use it.",
    author: "Mike Johnson",
    authorId: "student3",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    replies: 12,
    upvotes: 35,
    hasVerifiedAnswer: false,
    tags: ["doubts", "algorithms"],
  },
  {
    id: 4,
    courseId: 3,
    course: "Database Systems",
    title: "SQL vs NoSQL - When to use which?",
    content: "What are the key differences and when should I choose one over the other?",
    author: "Sarah Williams",
    authorId: "student4",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    replies: 15,
    upvotes: 28,
    hasVerifiedAnswer: true,
    tags: ["resources", "databases"],
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get("courseId")

  await new Promise((resolve) => setTimeout(resolve, 300))

  let filteredThreads = threadsDB
  if (courseId) {
    filteredThreads = threadsDB.filter((t) => t.courseId === Number.parseInt(courseId))
  }

  return NextResponse.json({ threads: filteredThreads })
}

export async function POST(request: Request) {
  const body = await request.json()

  const newThread = {
    id: threadsDB.length + 1,
    courseId: body.courseId,
    course: body.course,
    title: body.title,
    content: body.content,
    author: body.author,
    authorId: body.authorId,
    timestamp: new Date().toISOString(),
    replies: 0,
    upvotes: 0,
    hasVerifiedAnswer: false,
    tags: body.tags || [],
  }

  threadsDB.push(newThread)

  return NextResponse.json({ thread: newThread })
}
