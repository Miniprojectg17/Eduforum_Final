"use client"

import type React from "react"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, Menu, X, Search } from "lucide-react"

interface MenuItem {
  icon: any
  label: string
  href: string
}

interface DashboardLayoutProps {
  children: React.ReactNode
  user: any
  menuItems: MenuItem[]
  role: "student" | "faculty"
}

export function DashboardLayout({ children, user, menuItems, role }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&role=${role}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-background to-primary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b-2 border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            {/* Clickable EduForum logo to role dashboard */}
            <Link
              href={role === "student" ? "/student/dashboard" : "/faculty/dashboard"}
              className="text-2xl font-bold text-primary hover:opacity-90"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Go to dashboard"
            >
              EduForum
            </Link>
            <span className="hidden sm:inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
              {role === "student" ? "Student" : "Faculty"}
            </span>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={role === "student" ? "Search posts, resources..." : "Search posts, students..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm font-medium">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside
          className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-card border-r-2 border-border p-6 z-40
          transition-transform duration-300 lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <nav className="space-y-2">
            {menuItems.map((item, i) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={i}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left font-medium ${
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:text-primary"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
