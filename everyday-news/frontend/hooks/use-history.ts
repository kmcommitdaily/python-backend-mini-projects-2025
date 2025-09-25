"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"
import { addToHistory, getHistory, deleteHistory, HistoryEntry } from "@/lib/history"

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const { user } = useAuth()


  useEffect(() => {
    if (user?.token) {
      getHistory(user.token)
        .then(setHistory)
        .catch((err) => console.error("Failed to fetch history:", err))
    } else {
      setHistory([])
    }
  }, [user])


  const markAsRead = async (newsId: number) => {
    if (!user?.token) return
    try {
      await addToHistory(newsId, user.token)
      const updated = await getHistory(user.token)
      setHistory(updated)
    } catch (err) {
      console.error("Failed to add to history:", err)
    }
  }


  const removeHistory = async (historyId: number) => {
    if (!user?.token) return
    try {
      await deleteHistory(historyId, user.token)
      setHistory((prev) => prev.filter((h) => h.history_id !== historyId))
    } catch (err) {
      console.error("Failed to delete history entry:", err)
    }
  }


  const isRead = (newsId: number) => {
    return history.some((entry) => entry.news_id === newsId)
  }

  return {
    history,
    markAsRead,
    removeHistory,
    isRead,
    count: history.length,
  }
}
