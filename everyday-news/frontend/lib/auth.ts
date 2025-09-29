export interface User {
  id: string;
  email: string;
  name?: string;
  token?: string;
}

export class AuthService {
  private static readonly USER_KEY = "news_reader_user";

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static async login(
    email: string,
    password: string
  ): Promise<{ user: User | null; error: string | null }> {
 
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        return { user: null, error: err.detail || "Login failed" };
      }

      const data = await res.json();
      const user = {
        id: data.user_id,
        email: data.email,
        name: data.username,
        token: data.session_token,
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));

      return { user, error: null };
    } catch (err) {
      return { user: null, error: "Invalid email or password" };
    }
  }
  static async register(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name, 
          email,
          password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        return { user: null, error: err.detail || "Signup failed" };
      }

      const data = await res.json();
      const user = {
        id: data.user_id,
        email,
        name: data.username,
        token: data.session_token,
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));

      return { user, error: null };
    } catch (err) {
      return { user: null, error: "Network error" };
    }
  }

  static async logout(): Promise<void> {
    try {
      const currentUser = this.getCurrentUser();
      if (currentUser?.token) {
        const res = await fetch("http://localhost:8000/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {

      localStorage.removeItem(this.USER_KEY);
    }
  }
}
