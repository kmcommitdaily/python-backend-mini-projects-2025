// history.ts
export interface HistoryResponse {
  ok: boolean
  message?: string
  history_id?: number
}

export async function addToHistory(newsId: string, token: string): Promise<HistoryResponse> {
  const res = await fetch("http://localhost:8000/history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // ✅ attach user token
    },
    body: JSON.stringify({ news_id: newsId }),
  })

  if (!res.ok) {
    throw new Error(`Failed to add to history: ${res.statusText}`)
  }

  return res.json()
}

export async function getHistory(token: string) {
  const res = await fetch("http://localhost:8000/history", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch history: ${res.statusText}`)
  }

  return res.json()
}

export async function deleteHistory(historyId: number, token: string) {
  const res = await fetch(`http://localhost:8000/history/${historyId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to delete history: ${res.statusText}`)
  }

  return res.json()
}
