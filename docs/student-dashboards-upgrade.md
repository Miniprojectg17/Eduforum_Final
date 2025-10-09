# EduForum Student Dashboards Upgrade Specification

## Overview
This document outlines the requirements to **edit and upgrade all EduForum student dashboards** in an existing project. All modules must be dynamic, fully interactive, and tightly integrated with real backend data.

## Discussion Forums
- Add dynamic, filterable lists of posts and replies, with live updating (“real-time”) for new posts and answers.
- Implement interactive actions:
  - Upvote/downvote threads and replies.
  - Add new replies and discussions with instant updates.
  - Clearly display “Verified Answer” labels as set by faculty.
  - Buttons for bookmarking threads, previewing answers, and reporting inappropriate content.
- Navigation links should allow instant movement between forum categories and related course resources.

## Course Resources
- Add real-time loading and filtering of resources by course, category, and type.
- Interactive buttons for downloading, previewing, and bookmarking each resource.
- Dynamically display download counts and file details.
- Allow students to see resource status (e.g., completion or “marked as important”).
- Only accessible resources for enrolled courses should be visible.

## Bookmarks
- Create a filterable bookmarks page for saved threads and resources.
- Actions to view, remove, and categorize bookmarks, updating the UI instantly.
- Tag and sort bookmarks (by date, course, type).
- Navigation to directly open threads or resources from the bookmarks list.

## My Courses
- Add a dynamic course list showing all enrolled courses, progress bars, and upcoming events.
- Courses should link to deeper info, assignments, materials, forums, and resources.
- Progress, student count, and material count update instantly with data changes.

## Notifications
- Real-time, dynamic feed of all notifications (replies, uploads, grades, course updates).
- Enable read/unread status, deletion, grouping, filtering, and search.
- Clicking notifications should go directly to the relevant module.

## Profile
- Display basic student info (name, email, PRN, department, enrolled courses).
- List modules accessible to the student (role-sensitive).
- Show recent activities, profile editing options, account settings.
- Provide summary statistics (forum posts, replies, upvotes, downloads, course progress).

## General Requirements
- All pages/modules must support seamless, multi-page navigation and dynamic backend integration.
- Preserve the current look and feel, only adding new features for interactivity.
- All action lists, stats, and user context update instantly and accurately.
- No existing features are to be removed; only extend and enhance.

---

**Instructions:**  
Commit this file to the repo as `docs/student-dashboards-upgrade.md` for persistent, project-wide reference.
