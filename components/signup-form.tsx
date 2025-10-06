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

export function SignUpForm() {
  const [facultyEmail, setFacultyEmail] = useState("")
  const [facultyPassword, setFacultyPassword] = useState("")
  const [facultyConfirmPassword, setFacultyConfirmPassword] = useState("")

  const [studentName, setStudentName] = useState("")
  const [studentEmail, setStudentEmail] = useState("")
  const [studentPrn, setStudentPrn] = useState("")
  const [studentPassword, setStudentPassword] = useState("")
  const [studentConfirmPassword, setStudentConfirmPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleFacultySignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate @kitcoek email
    if (!facultyEmail.toLowerCase().endsWith("@kitcoek")) {
      setError("Faculty email must be a @kitcoek email address")
      return
    }

    // Validate passwords match
    if (facultyPassword !== facultyConfirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password length
    if (facultyPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    setIsLoading(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Store user info
    const user = {
      email: facultyEmail,
      role: "faculty",
      name: facultyEmail.split("@")[0],
    }
    localStorage.setItem("user", JSON.stringify(user))

    router.push("/faculty/dashboard")
  }

  const handleStudentSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (studentPassword !== studentConfirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password length
    if (studentPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    // Validate PRN format (assuming 8 digits)
    if (!/^\d{8}$/.test(studentPrn)) {
      setError("PRN must be 8 digits")
      return
    }

    setIsLoading(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Store user info
    const user = {
      name: studentName,
      email: studentEmail,
      prn: studentPrn,
      role: "student",
    }
    localStorage.setItem("user", JSON.stringify(user))

    router.push("/student/dashboard")
  }

  return (
    <Card className="border-2 border-border shadow-xl">
      <CardHeader className="space-y-1 bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
        <CardDescription className="text-base">Create your account to get started</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="student" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <form onSubmit={handleStudentSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-name">Full Name</Label>
                <Input
                  id="student-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-email">Email</Label>
                <Input
                  id="student-email"
                  type="email"
                  placeholder="student@university.edu"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-prn-signup">PRN (Permanent Registration Number)</Label>
                <Input
                  id="student-prn-signup"
                  type="text"
                  placeholder="Enter your 8-digit PRN"
                  value={studentPrn}
                  onChange={(e) => setStudentPrn(e.target.value)}
                  required
                  className="h-11"
                  maxLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-password-signup">Create Password</Label>
                <Input
                  id="student-password-signup"
                  type="password"
                  placeholder="Create a password (min. 6 characters)"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-confirm-password">Confirm Password</Label>
                <Input
                  id="student-confirm-password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={studentConfirmPassword}
                  onChange={(e) => setStudentConfirmPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up as Student"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="faculty">
            <form onSubmit={handleFacultySignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="faculty-email-signup">Email</Label>
                <Input
                  id="faculty-email-signup"
                  type="email"
                  placeholder="faculty@kitcoek"
                  value={facultyEmail}
                  onChange={(e) => setFacultyEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty-password-signup">Create Password</Label>
                <Input
                  id="faculty-password-signup"
                  type="password"
                  placeholder="Create a password (min. 6 characters)"
                  value={facultyPassword}
                  onChange={(e) => setFacultyPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faculty-confirm-password">Confirm Password</Label>
                <Input
                  id="faculty-confirm-password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={facultyConfirmPassword}
                  onChange={(e) => setFacultyConfirmPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up as Faculty"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
