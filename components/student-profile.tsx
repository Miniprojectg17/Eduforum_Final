"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, FileText, Clock, User, Award, TrendingUp, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function StudentProfile() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

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

  if (!user) return null

  const menuItems = [
    { icon: BookOpen, label: "My Courses", href: "/student/courses" },
    { icon: MessageSquare, label: "Discussion Forums", href: "/student/forums" },
    { icon: FileText, label: "Resources", href: "/student/resources" },
    { icon: BookOpen, label: "Bookmarks", href: "/student/bookmarks" },
    { icon: Clock, label: "Notifications", href: "/student/notifications" },
    { icon: User, label: "Profile", href: "/student/profile" },
  ]

  return (
    <DashboardLayout user={user} menuItems={menuItems} role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground text-lg">Manage your account and view your reputation</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-2">
              <CardHeader className="text-center bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="text-base">{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <span className="font-medium">Reputation</span>
                    </div>
                    <span className="text-xl font-bold text-primary">1,247</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="font-medium">Verified Answers</span>
                    </div>
                    <span className="text-xl font-bold text-success">8</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-accent" />
                      <span className="font-medium">Total Posts</span>
                    </div>
                    <span className="text-xl font-bold">42</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Activity Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary mb-2">12</p>
                  <p className="text-sm text-muted-foreground">days active</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={user.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input id="studentId" placeholder="STU123456" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="major">Major</Label>
                  <Input id="major" placeholder="Computer Science" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" placeholder="Tell us about yourself..." />
                </div>
                <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
              </CardContent>
            </Card>

            <Card className="border-2 mt-6">
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Your latest milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "First Verified Answer", description: "Your answer was verified by faculty", icon: Award },
                    { title: "Active Contributor", description: "Posted 10+ helpful answers", icon: MessageSquare },
                    { title: "Course Completed", description: "Finished Web Development course", icon: BookOpen },
                  ].map((achievement, i) => {
                    const Icon = achievement.icon
                    return (
                      <div key={i} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{achievement.title}</p>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
