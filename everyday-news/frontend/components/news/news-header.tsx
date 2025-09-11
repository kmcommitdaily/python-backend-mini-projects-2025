"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, BookOpen, Newspaper } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface NewsHeaderProps {
  currentView: "all" | "read"
  onViewChange: (view: "all" | "read") => void
  readCount: number
}

export function NewsHeader({ currentView, onViewChange, readCount }: NewsHeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="border-b sticky top-0 z-10 shadow-lg" style={{ backgroundColor: "#302e7c" }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Newspaper className="h-8 w-8" style={{ color: "#ffffff" }} />
            <h1 className="text-2xl font-bold" style={{ color: "#ffffff" }}>
              NewsReader
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={currentView === "all" ? "secondary" : "outline"}
                size="sm"
                onClick={() => onViewChange("all")}
                style={
                  currentView === "all"
                    ? { backgroundColor: "#ffffff", color: "#302e7c" }
                    : { borderColor: "#ffffff", color: "#ffffff", backgroundColor: "transparent" }
                }
                className="hover:opacity-90"
              >
                All Articles
              </Button>
              <Button
                variant={currentView === "read" ? "secondary" : "outline"}
                size="sm"
                onClick={() => onViewChange("read")}
                style={
                  currentView === "read"
                    ? { backgroundColor: "#ffffff", color: "#302e7c" }
                    : { borderColor: "#ffffff", color: "#ffffff", backgroundColor: "transparent" }
                }
                className="relative hover:opacity-90"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                History
                {readCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 px-1.5 text-xs"
                    style={{ backgroundColor: "#005195", color: "#ffffff" }}
                  >
                    {readCount}
                  </Badge>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: "#ffffff" }}>
                Welcome, {user?.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="hover:opacity-90"
                style={{ color: "#ffffff", backgroundColor: "transparent" }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
