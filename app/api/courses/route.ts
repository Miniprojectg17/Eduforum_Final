import { NextResponse } from "next/server"

// Mock database - in production, this would be a real database
const coursesDB = [
  {
    id: 1,
    code: "CS201",
    name: "Data Structures",
    instructor: "Prof. Smith",
    students: 45,
    progress: 65,
    nextClass: "Mon, 10:00 AM",
    description: "Learn fundamental data structures and algorithms",
  },
  {
    id: 2,
    code: "CS301",
    name: "Web Development",
    instructor: "Prof. Johnson",
    students: 38,
    progress: 80,
    nextClass: "Tue, 2:00 PM",
    description: "Modern web development with React and Next.js",
  },
  {
    id: 3,
    code: "CS401",
    name: "Database Systems",
    instructor: "Prof. Williams",
    students: 42,
    progress: 45,
    nextClass: "Wed, 11:00 AM",
    description: "Relational and NoSQL database design",
  },
  {
    id: 4,
    code: "CS302",
    name: "Algorithms",
    instructor: "Prof. Davis",
    students: 35,
    progress: 55,
    nextClass: "Thu, 3:00 PM",
    description: "Advanced algorithm design and analysis",
  },
  {
    id: 5,
    code: "CS501",
    name: "Machine Learning",
    instructor: "Prof. Brown",
    students: 50,
    progress: 30,
    nextClass: "Fri, 1:00 PM",
    description: "Introduction to ML algorithms and applications",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get("role")

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json({ courses: coursesDB })
}
