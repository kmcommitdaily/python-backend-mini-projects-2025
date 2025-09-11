"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"

interface LoginFormProps {
  onToggleMode: () => void
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const { error: loginError } = await login(email, password)
    if (loginError) {
      setError(loginError)
    }
  }

  return (
    <Card className="w-full max-w-md" style={{ borderColor: "#005195" }}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold" style={{ color: "#302e7c" }}>
          Welcome Back
        </CardTitle>
        <CardDescription style={{ color: "#58595b" }}>Sign in to your news reader account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" style={{ color: "#414141" }}>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" style={{ color: "#414141" }}>
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && (
            <div className="text-sm p-3 rounded-md" style={{ color: "#dc2626", backgroundColor: "#fef2f2" }}>
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full text-white hover:opacity-90"
            style={{ backgroundColor: "#005195" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm" style={{ color: "#58595b" }}>
          {"Don't have an account? "}
          <button onClick={onToggleMode} className="hover:underline font-medium" style={{ color: "#005195" }}>
            Sign up
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
