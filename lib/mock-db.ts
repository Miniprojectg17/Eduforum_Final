type Course = {
  id: string
  name: string
  code: string
  students: { id: string; name: string; email: string; prn?: string; status: "enrolled" | "pending" }[]
  resources: { id: string; title: string; type: "file" | "video" | "link"; url?: string; meta?: string }[]
  threads: {
    id: string
    title: string
    author: string
    timestamp: string
    replies: Answer[]
    verifiedAnswerId?: string
  }[]
}

type Answer = {
  id: string
  author: string
  content: string
  timestamp: string
  upvotes: number
  status?: "verified" | "incorrect" | "normal"
}

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

type StudentForumActivity = {
  posts: number
  replies: number
  upvotes: number
}

type StudentProfile = {
  id: string
  name: string
  email: string
  prn: string
  department: string
  year: string
  enrolledCourseIds: string[]
  forumActivity: StudentForumActivity
  contact?: { phone?: string }
  avatarUrl?: string
}

type FacultyStats = {
  studentsManaged: number
  resourcesUploaded: number
  announcementsMade: number
  postsVerified: number
}

type FacultyProfile = {
  id: string
  name: string
  email: string
  department: string
  designation: string
  managedCourseIds: string[]
  contact?: { phone?: string; office?: string }
  avatarUrl?: string
  stats: FacultyStats
}

let seeded = false
const courses: Record<string, Course> = {}
const announcements: Record<string, Announcement> = {}
const resources: Record<string, ResourceItem> = {}

const profilesDB = {
  students: new Map<string, StudentProfile>(),
  faculty: new Map<string, FacultyProfile>(),
}

function seed() {
  if (seeded) return
  const c1: Course = {
    id: "1",
    name: "Data Structures & Algorithms",
    code: "CS301",
    students: [
      { id: "s1", name: "John Doe", email: "john@example.com", prn: "12345678", status: "enrolled" },
      { id: "s2", name: "Jane Smith", email: "jane@example.com", prn: "87654321", status: "pending" },
    ],
    resources: [],
    threads: [
      {
        id: "t1",
        title: "How to implement a binary search tree?",
        author: "John Doe",
        timestamp: "2 hours ago",
        replies: [
          {
            id: "a1",
            author: "Alice Brown",
            content:
              "A binary search tree is a node-based data structure where each node has at most two children. The left child contains values less than the parent, and the right child contains values greater than the parent.",
            timestamp: "1 hour ago",
            upvotes: 8,
            status: "normal",
          },
          {
            id: "a2",
            author: "Bob Wilson",
            content:
              "Here's a simple implementation in Python:\n\nclass Node:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None",
            timestamp: "45 minutes ago",
            upvotes: 5,
            status: "normal",
          },
        ],
      },
    ],
  }

  const c2: Course = {
    id: "2",
    name: "Web Development",
    code: "CS402",
    students: [],
    resources: [],
    threads: [],
  }

  const c3: Course = {
    id: "3",
    name: "Database Systems",
    code: "CS350",
    students: [],
    resources: [],
    threads: [],
  }

  courses[c1.id] = c1
  courses[c2.id] = c2
  courses[c3.id] = c3
  seeded = true
}

function seedAnnouncementsAndResources() {
  // seed a few announcements/resources only once
  if (Object.keys(announcements).length || Object.keys(resources).length) return
  const now = new Date().toISOString()
  announcements["an1"] = {
    id: "an1",
    title: "Midterm Schedule",
    content: "Midterms for CS301 will be held next Tuesday 10am.",
    courseIds: ["1"],
    pinned: true,
    scheduledAt: null,
    createdAt: now,
    updatedAt: now,
  }
  announcements["an2"] = {
    id: "an2",
    title: "Project Milestone",
    content: "Project Part 1 due this Friday at 5pm.",
    courseIds: ["2", "3"],
    pinned: false,
    scheduledAt: null,
    createdAt: now,
    updatedAt: now,
  }

  resources["r1"] = {
    id: "r1",
    courseId: "1",
    title: "Lecture 5: Binary Trees and Traversals",
    description: "Slides with examples and exercises.",
    tags: ["trees", "traversal"],
    fileType: "pdf",
    url: "/pdf-document.png", // placeholder
    uploadedAt: now,
    downloads: 45,
  }
  resources["r2"] = {
    id: "r2",
    courseId: "2",
    title: "React Hooks Tutorial Video",
    description: "Intro to useState/useEffect/useMemo",
    tags: ["react", "hooks"],
    fileType: "video",
    url: "/video-production-setup.png",
    uploadedAt: now,
    downloads: 38,
  }
}

function seedProfiles() {
  // seed exactly once alongside other seeders
  if (profilesDB.students.size || profilesDB.faculty.size) return
  profilesDB.students.set("student1", {
    id: "student1",
    name: "John Doe",
    email: "john@example.com",
    prn: "12345678",
    department: "Computer Science",
    year: "Third",
    enrolledCourseIds: ["1", "2"],
    forumActivity: { posts: 15, replies: 27, upvotes: 124 },
    contact: { phone: "9876543210" },
    avatarUrl: "",
  })
  profilesDB.faculty.set("faculty1", {
    id: "faculty1",
    name: "Prof. Alice Brown",
    email: "alice@kitcoek.in",
    department: "Computer Science",
    designation: "Assistant Professor",
    managedCourseIds: ["1", "3"],
    contact: { phone: "020-123456", office: "Block A-204" },
    avatarUrl: "",
    stats: { studentsManaged: 62, resourcesUploaded: 18, announcementsMade: 9, postsVerified: 21 },
  })
}

export function getCoursesByIds(ids: string[]) {
  return ids.map((id) => courses[id]).filter(Boolean)
}

export function upsertStudentProfile(p: StudentProfile) {
  profilesDB.students.set(p.id, p)
  return p
}

export function upsertFacultyProfile(p: FacultyProfile) {
  profilesDB.faculty.set(p.id, p)
  return p
}

// hook seeders into db() init
export function db() {
  seed()
  seedAnnouncementsAndResources()
  seedProfiles() // ensure profiles are available
  return {
    courses,
    announcements,
    resources,
  }
}

export { profilesDB } // export profiles DB for API routes

export function jsonResponse(data: any, init?: number | ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
    ...(typeof init === "number" ? { status: init } : init),
  })
}
