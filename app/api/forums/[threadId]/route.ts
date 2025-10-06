import { NextResponse } from "next/server"

// Mock replies database
const repliesDB: any = {
  1: [
    {
      id: 1,
      threadId: 1,
      author: "Alice Brown",
      authorId: "student5",
      content:
        "A binary search tree is a node-based data structure where each node has at most two children. The left child contains values less than the parent, and the right child contains values greater than the parent.",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      upvotes: 8,
      downvotes: 0,
      isVerified: true,
      verifiedBy: "Prof. Smith",
    },
    {
      id: 2,
      threadId: 1,
      author: "Bob Wilson",
      authorId: "student6",
      content:
        "Here's a simple implementation in Python:\n\nclass Node:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      upvotes: 5,
      downvotes: 1,
      isVerified: false,
    },
    {
      id: 3,
      threadId: 1,
      author: "Carol Davis",
      authorId: "student7",
      content: "Don't forget to handle edge cases like duplicate values and balancing!",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      upvotes: 3,
      downvotes: 0,
      isVerified: false,
    },
  ],
}

export async function GET(request: Request, { params }: { params: { threadId: string } }) {
  const threadId = Number.parseInt(params.threadId)

  await new Promise((resolve) => setTimeout(resolve, 300))

  const replies = repliesDB[threadId] || []

  return NextResponse.json({ replies })
}

export async function POST(request: Request, { params }: { params: { threadId: string } }) {
  const threadId = Number.parseInt(params.threadId)
  const body = await request.json()

  if (!repliesDB[threadId]) {
    repliesDB[threadId] = []
  }

  const newReply = {
    id: repliesDB[threadId].length + 1,
    threadId,
    author: body.author,
    authorId: body.authorId,
    content: body.content,
    timestamp: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
    isVerified: body.isVerified || false,
    verifiedBy: body.verifiedBy,
  }

  repliesDB[threadId].push(newReply)

  return NextResponse.json({ reply: newReply })
}
