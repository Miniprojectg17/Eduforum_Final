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
  const [facultyName, setFacultyName] = useState("")
  const [facultyEmail, setFacultyEmail] = useState("")
  const [facultyDepartment, setFacultyDepartment] = useState("")
  const [facultyDesignation, setFacultyDesignation] = useState("")
  const [facultyPassword, setFacultyPassword] = useState("")
  const [facultyConfirmPassword, setFacultyConfirmPassword] = useState("")

  const [studentName, setStudentName] = useState("")
  const [studentEmail, setStudentEmail] = useState("")
  const [studentPrn, setStudentPrn] = useState("")
  const [studentDepartment, setStudentDepartment] = useState("")
  const [studentYear, setStudentYear] = useState("")
  const [studentPassword, setStudentPassword] = useState("")
  const [studentConfirmPassword, setStudentConfirmPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleFacultySignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate @kitcoek.in email
    if (!facultyEmail.toLowerCase().endsWith("@kitcoek.in")) {
      setError("Faculty email must end with @kitcoek.in")
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

    // Validate required faculty fields
    if (!facultyName || !facultyDepartment || !facultyDesignation) {
      setError("Please fill all required fields")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/profile/faculty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: facultyName,
          email: facultyEmail,
          department: facultyDepartment,
          designation: facultyDesignation,
          password: facultyPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Failed to create profile")
      }
      localStorage.setItem(
        "user",
        JSON.stringify({
          role: "faculty",
          email: facultyEmail,
          name: facultyName,
        }),
      )
      router.push("/faculty/dashboard")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStudentSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate student email
    if (!studentEmail.toLowerCase().endsWith("@gmail.com")) {
      setError("Student email must end with @gmail.com")
      return
    }

    // Validate PRN format (exactly 10 characters)
    if (studentPrn.length !== 10) {
      setError("PRN must be exactly 10 characters")
      return
    }

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

    // Validate required student fields
    if (!studentDepartment || !studentYear) {
      setError("Please fill all required fields")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/profile/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName,
          email: studentEmail,
          prn: studentPrn,
          department: studentDepartment,
          year: studentYear,
          password: studentPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || "Failed to create profile")
      }
      localStorage.setItem(
        "user",
        JSON.stringify({
          role: "student",
          email: studentEmail,
          prn: studentPrn,
          name: studentName,
        }),
      )
      router.push("/student/dashboard")
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-start mt-8 min-h-screen bg-transparent">
      <Card className="border-2 border-border shadow-xl rounded-lg w-full max-w-md">
        <CardHeader className="space-y-1 rounded-t-lg pb-0 pt-8">
          <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-base text-center">Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
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
                    placeholder="student@gmail.com"
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
                    placeholder="Enter your 10-character PRN"
                    value={studentPrn}
                    onChange={(e) => setStudentPrn(e.target.value)}
                    required
                    className="h-11"
                    maxLength={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-department">Department</Label>
                  <Input
                    id="student-department"
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={studentDepartment}
                    onChange={(e) => setStudentDepartment(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-year">Year</Label>
                  <Input
                    id="student-year"
                    type="text"
                    placeholder="e.g. First, Second, Third, Final"
                    value={studentYear}
                    onChange={(e) => setStudentYear(e.target.value)}
                    required
                    className="h-11"
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
                  <Label htmlFor="faculty-name">Full Name</Label>
                  <Input
                    id="faculty-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faculty-email-signup">Email</Label>
                  <Input
                    id="faculty-email-signup"
                    type="email"
                    placeholder="faculty@kitcoek.in"
                    value={facultyEmail}
                    onChange={(e) => setFacultyEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faculty-department">Department</Label>
                  <Input
                    id="faculty-department"
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={facultyDepartment}
                    onChange={(e) => setFacultyDepartment(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faculty-designation">Designation</Label>
                  <Input
                    id="faculty-designation"
                    type="text"
                    placeholder="e.g. Assistant Professor"
                    value={facultyDesignation}
                    onChange={(e) => setFacultyDesignation(e.target.value)}
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
    </div>
  )
}