
import { AuthService } from "@/lib/auth" 

export interface Article {
  id: number
  title: string
  summary: string
  content: string
  author: string
  publishedAt: string
  imageUrl: string
 
}




export async function getArticles(): Promise<Article[]> {
  try {
    const currentUser = AuthService.getCurrentUser();
    const token = currentUser?.token;

    if (!token) {
      throw new Error("No auth token found. Please log in.");
    }

    const res = await fetch("http://localhost:8000/news", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,  
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch news");
    }

    const data: Article[] = await res.json();
    return data;
  } catch (err) {
    console.error("Error in getArticles:", err);
    throw new Error("error fetching news");
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
