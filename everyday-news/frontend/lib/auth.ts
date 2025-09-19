export interface User {
  id: string
  email: string
  name?: string
  token?: string
}

export class AuthService {
  private static readonly USER_KEY = "news_reader_user"
  private static readonly USERS_KEY = "news_reader_users"

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    const userStr = localStorage.getItem(this.USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  }

  static async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    // Simulate API delay
   try{
    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
          email,
          password,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      return   { user: null, error: err.detail || "Login failed" }
    }

    const data = await res.json()
    const user = {
        id: data.user_id,
        email: data.email,
        token: data.session_token
    }

    return {user, error: null}

   } catch(err) {
    return { user: null, error: "Invalid email or password" }
   }
  }
  static async register(
    name: string,
    email: string,
    password: string,
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          username: name,  // ✅ backend expects "username"
          email,
          password,
      }),
      })
      
      if (!res.ok) {
        const err = await res.json()
        return   { user: null, error: err.detail || "Signup failed" }
      }

     const data = await res.json()
     const user = {
        id: data.user_id,
        email,
        name: data.username,
    }
     localStorage.setItem(this.USER_KEY, JSON.stringify(user))

     return { user, error: null }

    } catch (err) {
    return { user: null, error: "Network error" }
  }
  }

  static logout(): void {
    localStorage.removeItem(this.USER_KEY)
  }

  private static getStoredUsers(): Array<{ id: string; name: string; email: string; password: string }> {
    if (typeof window === "undefined") return []

    const usersStr = localStorage.getItem(this.USERS_KEY)
    return usersStr ? JSON.parse(usersStr) : []
  }
}
