import { NextResponse } from "next/server"

const notificationsDB = [
  {
    id: 1,
    type: "verified",
    title: "Answer Verified",
    message: 'Your answer in "Data Structures" was verified by Prof. Smith',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    link: "/student/forums",
  },
  {
    id: 2,
    type: "reply",
    title: "New Reply",
    message: 'New reply to your question in "Algorithms"',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
    link: "/student/forums",
  },
  {
    id: 3,
    type: "resource",
    title: "New Resource",
    message: 'New lecture slides uploaded in "Web Development"',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    link: "/student/resources",
  },
  {
    id: 4,
    type: "announcement",
    title: "Course Announcement",
    message: 'Prof. Johnson posted an announcement in "Web Development"',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    link: "/student/courses",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json({ notifications: notificationsDB })
}
