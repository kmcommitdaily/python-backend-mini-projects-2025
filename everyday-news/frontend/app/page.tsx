"use client"

import { useAuth } from "@/hooks/use-auth"
import { AuthPage } from "@/components/auth/auth-page"
import { NewsApp } from "@/components/news/news-app"

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return <NewsApp />
}
