export interface HistoryResponse {
  ok: boolean
  message?: string
  history_id?: number
}

export interface HistoryEntry {
  history_id: number;
  news_id: number;
  title: string;
  summary: string;
  author: string;
  imageUrl: string;
  read_at: string;
}


const BASE_URL = "http://localhost:8000/history"


export async function addToHistory(newsId: number, token: string): Promise<HistoryResponse> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ news_id: newsId }),
  })
  if (!res.ok) throw new Error("Failed to add to history")
  return res.json()
}


export async function getHistory(token: string): Promise<HistoryEntry[]> {
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Failed to fetch history")
  return res.json()
}

export async function deleteHistory(historyId: number, token: string): Promise<{ ok: boolean; message: string }> {
  const res = await fetch(`${BASE_URL}/${historyId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error("Failed to delete history entry")
  return res.json()
}
