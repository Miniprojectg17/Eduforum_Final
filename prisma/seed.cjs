// Seed script to populate initial data
// Run with: npx prisma db seed

const { PrismaClient } = require('../lib/generated/prisma')

const prisma = new PrismaClient()

async function main() {
  // Courses
  const coursesData = [
    { code: 'CS201', name: 'Data Structures' },
    { code: 'CS301', name: 'Web Development' },
    { code: 'CS401', name: 'Database Systems' },
  ]

  const courses = {}
  for (const c of coursesData) {
    const course = await prisma.course.upsert({
      where: { code: c.code },
      update: { name: c.name },
      create: c,
    })
    courses[c.code] = course
  }

  // Threads + Replies under CS201
  const thread1 = await prisma.thread.create({
    data: {
      title: 'How to implement a binary search tree?',
      content: 'Confused about insert/search methods. Any simple example?',
      author: 'John Doe',
      courseId: courses['CS201'].id,
      replies: {
        create: [
          {
            author: 'Alice Brown',
            content:
              'A BST is a node-based structure with at most two children; left < parent < right.',
            upvotes: 8,
          },
          {
            author: 'Bob Wilson',
            content: 'Start with a Node class holding value/left/right; insert compares then recurses.',
            upvotes: 5,
          },
        ],
      },
    },
    include: { replies: true },
  })

  // Resources
  await prisma.resource.createMany({
    data: [
      {
        courseId: courses['CS201'].id,
        title: 'Lecture 5: Binary Trees and Traversals',
        description: 'Slides with examples and exercises.',
        tags: ['trees', 'traversal'],
        fileType: 'pdf',
        url: '/pdf-document.png',
        downloads: 45,
      },
      {
        courseId: courses['CS301'].id,
        title: 'React Hooks Tutorial Video',
        description: 'Intro to useState/useEffect/useMemo',
        tags: ['react', 'hooks'],
        fileType: 'video',
        url: '/video-production-setup.png',
        downloads: 38,
      },
    ],
    skipDuplicates: true,
  })

  // Announcements
  const now = new Date()
  const an1 = await prisma.announcement.upsert({
    where: { id: 'an1' },
    update: {},
    create: {
      id: 'an1',
      title: 'Midterm Schedule',
      content: 'Midterms for CS201 will be held next Tuesday 10am.',
      pinned: true,
      scheduledAt: null,
      createdAt: now,
      courses: {
        create: [{ courseId: courses['CS201'].id }],
      },
    },
  })
  const an2 = await prisma.announcement.upsert({
    where: { id: 'an2' },
    update: {},
    create: {
      id: 'an2',
      title: 'Project Milestone',
      content: 'Project Part 1 due this Friday at 5pm.',
      pinned: false,
      scheduledAt: null,
      createdAt: now,
      courses: {
        create: [
          { courseId: courses['CS301'].id },
          { courseId: courses['CS401'].id },
        ],
      },
    },
  })

  // Profiles
  await prisma.studentProfile.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      prn: '12345678',
      department: 'Computer Science',
      year: 'Third',
      posts: 15,
      replies: 27,
      upvotes: 124,
      phone: '9876543210',
      avatarUrl: '',
      enrolledCourses: {
        connect: [
          { id: courses['CS201'].id },
          { id: courses['CS301'].id },
        ],
      },
    },
  })

  await prisma.facultyProfile.upsert({
    where: { email: 'alice@kitcoek.in' },
    update: {},
    create: {
      name: 'Prof. Alice Brown',
      email: 'alice@kitcoek.in',
      department: 'Computer Science',
      designation: 'Assistant Professor',
      phone: '020-123456',
      office: 'Block A-204',
      avatarUrl: '',
      studentsManaged: 62,
      resourcesUploaded: 18,
      announcementsMade: 9,
      postsVerified: 21,
      managedCourses: {
        connect: [
          { id: courses['CS201'].id },
          { id: courses['CS401'].id },
        ],
      },
    },
  })

  console.log('Seed complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
