"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const mockDeadlines = [
  {
    id: 1,
    course: "Data Structures",
    title: "Assignment 3: Binary Trees",
    dueDate: "Tomorrow, 11:59 PM",
    priority: "high",
  },
  {
    id: 2,
    course: "Web Development",
    title: "Project Milestone 2",
    dueDate: "Friday, 5:00 PM",
    priority: "medium",
  },
  {
    id: 3,
    course: "Database Systems",
    title: "Quiz 2",
    dueDate: "Next Monday, 10:00 AM",
    priority: "medium",
  },
  {
    id: 4,
    course: "Machine Learning",
    title: "Final Project Proposal",
    dueDate: "Next Wednesday, 11:59 PM",
    priority: "low",
  },
]

export function CalendarWidget() {
  return (
    <Card className="border-2">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Deadlines
        </CardTitle>
        <CardDescription>Stay on top of your assignments</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {mockDeadlines.map((deadline) => (
            <div key={deadline.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border">
              <Clock
                className={`h-5 w-5 mt-0.5 ${
                  deadline.priority === "high"
                    ? "text-destructive"
                    : deadline.priority === "medium"
                      ? "text-accent"
                      : "text-muted-foreground"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {deadline.course}
                  </Badge>
                  {deadline.priority === "high" && <Badge className="bg-destructive text-white text-xs">Urgent</Badge>}
                </div>
                <p className="font-medium text-sm">{deadline.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{deadline.dueDate}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
