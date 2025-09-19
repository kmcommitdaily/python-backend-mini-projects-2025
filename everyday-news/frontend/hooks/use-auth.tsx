"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { AuthService, type User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error: string | null }>
  register: (name: string, email: string, password: string) => Promise<{ error: string | null }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    const { user: loggedInUser, error } = await AuthService.login(email, password)

    if (loggedInUser) {
      setUser(loggedInUser)
    }

    setLoading(false)
    return { error }
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    const { user: registeredUser, error } = await AuthService.register(name, email, password)

    if (registeredUser) {
      setUser(registeredUser)
    }

    setLoading(false)
    return { error }
  }

  const logout = async () => {
    await AuthService.logout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
