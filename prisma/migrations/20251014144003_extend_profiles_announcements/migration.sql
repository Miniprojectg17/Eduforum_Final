-- CreateTable
CREATE TABLE "StudentProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "prn" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "posts" INTEGER NOT NULL DEFAULT 0,
    "replies" INTEGER NOT NULL DEFAULT 0,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "phone" TEXT,
    "avatarUrl" TEXT,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacultyProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "phone" TEXT,
    "office" TEXT,
    "avatarUrl" TEXT,
    "studentsManaged" INTEGER NOT NULL DEFAULT 0,
    "resourcesUploaded" INTEGER NOT NULL DEFAULT 0,
    "announcementsMade" INTEGER NOT NULL DEFAULT 0,
    "postsVerified" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FacultyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnnouncementOnCourse" (
    "announcementId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,

    CONSTRAINT "AnnouncementOnCourse_pkey" PRIMARY KEY ("announcementId","courseId")
);

-- CreateTable
CREATE TABLE "_StudentEnrolledCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StudentEnrolledCourses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ManagedCourses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ManagedCourses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_email_key" ON "StudentProfile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FacultyProfile_email_key" ON "FacultyProfile"("email");

-- CreateIndex
CREATE INDEX "_StudentEnrolledCourses_B_index" ON "_StudentEnrolledCourses"("B");

-- CreateIndex
CREATE INDEX "_ManagedCourses_B_index" ON "_ManagedCourses"("B");

-- AddForeignKey
ALTER TABLE "AnnouncementOnCourse" ADD CONSTRAINT "AnnouncementOnCourse_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnouncementOnCourse" ADD CONSTRAINT "AnnouncementOnCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentEnrolledCourses" ADD CONSTRAINT "_StudentEnrolledCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentEnrolledCourses" ADD CONSTRAINT "_StudentEnrolledCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ManagedCourses" ADD CONSTRAINT "_ManagedCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ManagedCourses" ADD CONSTRAINT "_ManagedCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "FacultyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
