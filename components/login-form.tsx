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
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"

function decodeJWT(token: string) {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("[v0] Error decoding JWT:", error)
    return null
  }
}

export function LoginForm() {
  const [facultyEmail, setFacultyEmail] = useState("")
  const [facultyPassword, setFacultyPassword] = useState("")
  const [studentPrn, setStudentPrn] = useState("")
  const [studentPassword, setStudentPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("student")
  const router = useRouter()

  const handleFacultyGoogleLogin = async (credentialResponse: CredentialResponse) => {
    setError("")
    setIsLoading(true)

    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google")
      }

      const decoded = decodeJWT(credentialResponse.credential)
      console.log("[v0] Decoded Google credential:", decoded)

      if (!decoded || !decoded.email) {
        throw new Error("Failed to decode Google credential")
      }

      // Validate @kitcoek email for faculty
      if (!decoded.email.toLowerCase().endsWith("@kitcoek")) {
        setError("Faculty must sign in with a @kitcoek email address")
        setIsLoading(false)
        return
      }

      // Store user info
      const user = {
        email: decoded.email,
        role: "faculty",
        name: decoded.name || decoded.email.split("@")[0],
        picture: decoded.picture,
      }
      localStorage.setItem("user", JSON.stringify(user))

      router.push("/faculty/dashboard")
    } catch (err) {
      console.error("[v0] Google login error:", err)
      setError(err instanceof Error ? err.message : "Failed to sign in with Google")
      setIsLoading(false)
    }
  }

  const handleStudentGoogleLogin = async (credentialResponse: CredentialResponse) => {
    setError("")
    setIsLoading(true)

    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google")
      }

      const decoded = decodeJWT(credentialResponse.credential)
      console.log("[v0] Decoded Google credential:", decoded)

      if (!decoded || !decoded.email) {
        throw new Error("Failed to decode Google credential")
      }

      // Store user info
      const user = {
        email: decoded.email,
        role: "student",
        name: decoded.name || decoded.email.split("@")[0],
        picture: decoded.picture,
        prn: "GOOGLE_" + decoded.sub.slice(0, 8), // Generate PRN from Google ID
      }
      localStorage.setItem("user", JSON.stringify(user))

      router.push("/student/dashboard")
    } catch (err) {
      console.error("[v0] Google login error:", err)
      setError(err instanceof Error ? err.message : "Failed to sign in with Google")
      setIsLoading(false)
    }
  }

  const handleFacultyLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validate @kitcoek email
    if (!facultyEmail.toLowerCase().endsWith("@kitcoek")) {
      setError("Faculty email must be a @kitcoek email address")
      setIsLoading(false)
      return
    }

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

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Store user info
    const user = {
      prn: studentPrn,
      role: "student",
      name: `Student ${studentPrn}`,
    }
    localStorage.setItem("user", JSON.stringify(user))

    router.push("/student/dashboard")
  }

  return (
    <Card className="border-2 border-border shadow-xl">
      <CardHeader className="space-y-1 bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription className="text-base">Enter your credentials to access your dashboard</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
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
            <div className="mb-6">
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleStudentGoogleLogin}
                  onError={() => {
                    setError("Failed to sign in with Google")
                  }}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="100%"
                />
              </div>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
            </div>

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
            <div className="mb-6">
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleFacultyGoogleLogin}
                  onError={() => {
                    setError("Failed to sign in with Google")
                  }}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="100%"
                />
              </div>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleFacultyLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="faculty-email">Email</Label>
                <Input
                  id="faculty-email"
                  type="email"
                  placeholder="faculty@kitcoek"
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

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
