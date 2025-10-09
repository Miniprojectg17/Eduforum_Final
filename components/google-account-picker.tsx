"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface GoogleAccount {
  id: string
  name: string
  email: string
  picture?: string
}

interface GoogleAccountPickerProps {
  open: boolean
  onClose: () => void
  onSelectAccount: (account: GoogleAccount) => void
  accountType: "faculty" | "student"
}

const MOCK_FACULTY_ACCOUNTS: GoogleAccount[] = [
  {
    id: "faculty1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@kitcoek",
  },
  {
    id: "faculty2",
    name: "Prof. Michael Chen",
    email: "michael.chen@kitcoek",
  },
  {
    id: "faculty3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@kitcoek",
  },
]

const MOCK_STUDENT_ACCOUNTS: GoogleAccount[] = [
  {
    id: "student1",
    name: "Alex Kumar",
    email: "alex.kumar@student.edu",
  },
  {
    id: "student2",
    name: "Jessica Williams",
    email: "jessica.williams@student.edu",
  },
  {
    id: "student3",
    name: "David Park",
    email: "david.park@student.edu",
  },
]

export function GoogleAccountPicker({ open, onClose, onSelectAccount, accountType }: GoogleAccountPickerProps) {
  const accounts = accountType === "faculty" ? MOCK_FACULTY_ACCOUNTS : MOCK_STUDENT_ACCOUNTS

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Choose an account</DialogTitle>
          <p className="text-center text-sm text-muted-foreground">to continue to EduForum</p>
        </DialogHeader>
        <div className="space-y-2 py-4">
          {accounts.map((account) => (
            <Button
              key={account.id}
              variant="ghost"
              className="w-full h-auto p-4 justify-start hover:bg-accent/50 transition-colors"
              onClick={() => {
                onSelectAccount(account)
                onClose()
              }}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {account.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="font-medium text-base">{account.name}</span>
                <span className="text-sm text-muted-foreground">{account.email}</span>
              </div>
            </Button>
          ))}
        </div>
        <div className="border-t pt-4">
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
