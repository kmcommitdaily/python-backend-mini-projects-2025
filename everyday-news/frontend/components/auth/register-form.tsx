"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"

interface RegisterFormProps {
  onToggleMode: () => void
}

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const { register, loading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    const { error: registerError } = await register(name, email, password)
    if (registerError) {
      setError(registerError)
    }
  }

  return (
    <Card className="w-full max-w-md" style={{ borderColor: "#005195" }}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold" style={{ color: "#302e7c" }}>
          Create Account
        </CardTitle>
        <CardDescription style={{ color: "#58595b" }}>Join our news reader community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" style={{ color: "#414141" }}>
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
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
              placeholder="Create a password"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" style={{ color: "#414141" }}>
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
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
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm" style={{ color: "#58595b" }}>
          Already have an account?{" "}
          <button onClick={onToggleMode} className="hover:underline font-medium" style={{ color: "#005195" }}>
            Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
