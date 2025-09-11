"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./use-auth"

export function useReadArticles() {
  const [readArticles, setReadArticles] = useState<string[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const storageKey = `read_articles_${user.id}`
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        setReadArticles(JSON.parse(stored))
      } else {
        setReadArticles([])
      }
    } else {
      setReadArticles([])
    }
  }, [user])

  useEffect(() => {
    if (user && readArticles.length >= 0) {
      const storageKey = `read_articles_${user.id}`
      localStorage.setItem(storageKey, JSON.stringify(readArticles))
    }
  }, [readArticles, user])

  const markAsRead = (articleId: string) => {
    setReadArticles((prev) => {
      if (!prev.includes(articleId)) {
        return [...prev, articleId]
      }
      return prev
    })
  }

  const markAsUnread = (articleId: string) => {
    setReadArticles((prev) => prev.filter((id) => id !== articleId))
  }

  const isRead = (articleId: string) => {
    return readArticles.includes(articleId)
  }

  const getReadCount = () => {
    return readArticles.length
  }

  const clearAllRead = () => {
    setReadArticles([])
  }

  return {
    readArticles,
    markAsRead,
    markAsUnread,
    isRead,
    getReadCount,
    clearAllRead,
  }
}
