export interface User {
  id: string
  email: string
  name: string
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
    await new Promise((resolve) => setTimeout(resolve, 500))

    const users = this.getStoredUsers()
    const user = users.find((u) => u.email === email && u.password === password)

    if (user) {
      const { password: _, ...userWithoutPassword } = user
      localStorage.setItem(this.USER_KEY, JSON.stringify(userWithoutPassword))
      return { user: userWithoutPassword, error: null }
    }

    return { user: null, error: "Invalid email or password" }
  }

  static async register(
    name: string,
    email: string,
    password: string,
  ): Promise<{ user: User | null; error: string | null }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const users = this.getStoredUsers()

    if (users.find((u) => u.email === email)) {
      return { user: null, error: "Email already exists" }
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
    }

    users.push(newUser)
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))

    const { password: _, ...userWithoutPassword } = newUser
    localStorage.setItem(this.USER_KEY, JSON.stringify(userWithoutPassword))

    return { user: userWithoutPassword, error: null }
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
