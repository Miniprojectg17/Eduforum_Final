"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LoginForm() {
  const [facultyEmail, setFacultyEmail] = useState("")
  const [facultyPassword, setFacultyPassword] = useState("")
  const [studentPrn, setStudentPrn] = useState("")
  const [studentEmail, setStudentEmail] = useState("")
  const [studentPassword, setStudentPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("student")
  const router = useRouter()

  const handleFacultyLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const email = facultyEmail.trim().toLowerCase()
    if (!email.endsWith("@kitcoek.in")) {
      setError("Faculty email must end with @kitcoek.in")
      setIsLoading(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 800))

    const user = {
      email: facultyEmail,
      role: "faculty",
      name: facultyEmail.split("@")[0],
    }
    localStorage.setItem("user", JSON.stringify(user))
    router.push("/faculty/dashboard")
  }

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const prn = studentPrn.trim()
    const email = studentEmail.trim().toLowerCase()
    if (prn.length !== 10) {
      setError("PRN must be exactly 10 characters")
      setIsLoading(false)
      return
    }
    if (!email.endsWith("@gmail.com")) {
      setError("Student email must end with @gmail.com")
      setIsLoading(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 800))

    const user = {
      prn,
      email: studentEmail,
      role: "student",
      name: `Student ${prn}`,
    }
    localStorage.setItem("user", JSON.stringify(user))
    router.push("/student/dashboard")
  }

  return (
    <div className="flex justify-center items-start mt-8 min-h-screen bg-transparent">
      <Card className="border-2 border-border shadow-xl rounded-lg w-full max-w-md">
        <CardHeader className="space-y-1 rounded-t-lg pb-0 pt-8">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-base text-center">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="student" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="faculty">Faculty</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-prn">PRN (Permanent Registration Number)</Label>
                  <Input
                    id="student-prn"
                    type="text"
                    placeholder="Enter your PRN"
                    value={studentPrn}
                    onChange={(e) => setStudentPrn(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input
                    id="student-email"
                    type="email"
                    placeholder="student@gmail.com"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <Input
                    id="student-password"
                    type="password"
                    placeholder="Enter your password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In as Student"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="faculty">
              <form onSubmit={handleFacultyLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty-email">Email</Label>
                  <Input
                    id="faculty-email"
                    type="email"
                    placeholder="faculty@kitcoek.in"
                    value={facultyEmail}
                    onChange={(e) => setFacultyEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faculty-password">Password</Label>
                  <Input
                    id="faculty-password"
                    type="password"
                    placeholder="Enter your password"
                    value={facultyPassword}
                    onChange={(e) => setFacultyPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In as Faculty"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
