import { SignUpForm } from "@/components/signup-form"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent/20 via-background to-primary/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-foreground mb-2 tracking-tight">EduForum</h1>
          <p className="text-muted-foreground text-lg">Discussion & Collaboration Platform</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}
