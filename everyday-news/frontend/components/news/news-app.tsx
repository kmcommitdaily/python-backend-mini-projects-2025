"use client"

import { useState } from "react"
import { getArticles, getArticleById, type Article } from "@/lib/news"
import { NewsHeader } from "./news-header"
import { CategoryFilter } from "./category-filter"
import { ArticleCard } from "./article-card"
import { ArticleDetail } from "./article-detail"
import { ReadArticlesDashboard } from "./read-articles-dashboard"
import { useReadArticles } from "@/hooks/use-read-articles"

export function NewsApp() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [currentView, setCurrentView] = useState<"all" | "read">("all")
  const { readArticles, markAsRead, isRead } = useReadArticles()

  const articles = getArticles(selectedCategory === "All" ? undefined : selectedCategory)
  const displayedArticles = currentView === "read" ? articles.filter((article) => isRead(article.id)) : articles

  const handleArticleClick = (articleId: string) => {
    const article = getArticleById(articleId)
    if (article) {
      setSelectedArticle(article)
    }
  }

  const handleMarkAsRead = () => {
    if (selectedArticle) {
      markAsRead(selectedArticle.id)
    }
  }

  const handleViewChange = (view: "all" | "read") => {
    setCurrentView(view)
    setSelectedArticle(null) // Clear selected article when switching views
  }

  const handleBackToArticles = () => {
    setSelectedArticle(null)
    setCurrentView("all")
  }

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NewsHeader currentView={currentView} onViewChange={handleViewChange} readCount={readArticles.length} />
        <main className="container mx-auto px-4 py-8">
          <ArticleDetail
            article={selectedArticle}
            isRead={isRead(selectedArticle.id)}
            onBack={() => setSelectedArticle(null)}
            onMarkAsRead={handleMarkAsRead}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NewsHeader currentView={currentView} onViewChange={handleViewChange} readCount={readArticles.length} />
      <main className="container mx-auto px-4 py-8">
        {currentView === "read" ? (
          <ReadArticlesDashboard onArticleClick={handleArticleClick} onBackToArticles={handleBackToArticles} />
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 text-gray-900">Most Recent Headlines</h2>
              <p className="text-muted-foreground">Stay updated with the latest news and insights</p>
            </div>

            <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  isRead={isRead(article.id)}
                  onClick={() => handleArticleClick(article.id)}
                />
              ))}
            </div>

            {displayedArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No articles found in this category.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
