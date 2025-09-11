"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, BookOpen, Calendar, TrendingUp, ArrowLeft } from "lucide-react"
import { useReadArticles } from "@/hooks/use-read-articles"
import { getArticles, formatDate } from "@/lib/news"
import { ArticleCard } from "./article-card"

interface ReadArticlesDashboardProps {
  onArticleClick: (articleId: string) => void
  onBackToArticles?: () => void
}

export function ReadArticlesDashboard({ onArticleClick, onBackToArticles }: ReadArticlesDashboardProps) {
  const { readArticles, clearAllRead, markAsUnread } = useReadArticles()

  const allArticles = getArticles()
  const readArticleObjects = allArticles.filter((article) => readArticles.includes(article.id))

  const totalReadTime = readArticleObjects.reduce((sum, article) => sum + article.readTime, 0)
  const categoriesRead = [...new Set(readArticleObjects.map((article) => article.category))]
  const mostRecentRead =
    readArticleObjects.length > 0
      ? readArticleObjects.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0]
      : null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {onBackToArticles && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToArticles}
            style={{
              borderColor: "#005195",
              color: "#005195",
              backgroundColor: "transparent",
            }}
            className="hover:bg-blue-50 hover:border-blue-400 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        )}
        <div>
          <h2 className="text-3xl font-bold" style={{ color: "#414141" }}>
            Reading History
          </h2>
          <p style={{ color: "#58595b" }}>Track your reading progress and revisit articles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card style={{ borderColor: "#005195", backgroundColor: "#ffffff" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: "#414141" }}>
              Articles Read
            </CardTitle>
            <BookOpen className="h-4 w-4" style={{ color: "#005195" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "#302e7c" }}>
              {readArticles.length}
            </div>
            <p className="text-xs" style={{ color: "#58595b" }}>
              Total articles in your reading history
            </p>
          </CardContent>
        </Card>

        <Card style={{ borderColor: "#005195", backgroundColor: "#ffffff" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: "#414141" }}>
              Reading Time
            </CardTitle>
            <TrendingUp className="h-4 w-4" style={{ color: "#005195" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "#302e7c" }}>
              {totalReadTime} min
            </div>
            <p className="text-xs" style={{ color: "#58595b" }}>
              Total time spent reading
            </p>
          </CardContent>
        </Card>

        <Card style={{ borderColor: "#005195", backgroundColor: "#ffffff" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium" style={{ color: "#414141" }}>
              Categories
            </CardTitle>
            <Calendar className="h-4 w-4" style={{ color: "#005195" }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: "#302e7c" }}>
              {categoriesRead.length}
            </div>
            <p className="text-xs" style={{ color: "#58595b" }}>
              Different categories explored
            </p>
          </CardContent>
        </Card>
      </div>

      {categoriesRead.length > 0 && (
        <Card style={{ borderColor: "#005195", backgroundColor: "#ffffff" }}>
          <CardHeader>
            <CardTitle className="text-lg" style={{ color: "#414141" }}>
              Categories You've Explored
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categoriesRead.map((category) => (
                <Badge key={category} variant="secondary" style={{ backgroundColor: "#005195", color: "#ffffff" }}>
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {mostRecentRead && (
        <Card style={{ borderColor: "#005195", backgroundColor: "#ffffff" }}>
          <CardHeader>
            <CardTitle className="text-lg" style={{ color: "#414141" }}>
              Most Recently Read
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h4 className="font-semibold mb-1" style={{ color: "#414141" }}>
                  {mostRecentRead.title}
                </h4>
                <p className="text-sm mb-2" style={{ color: "#58595b" }}>
                  {mostRecentRead.summary}
                </p>
                <div className="flex items-center gap-2 text-xs" style={{ color: "#58595b" }}>
                  <Badge variant="outline" style={{ borderColor: "#005195", color: "#005195" }}>
                    {mostRecentRead.category}
                  </Badge>
                  <span>{formatDate(mostRecentRead.publishedAt)}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onArticleClick(mostRecentRead.id)}
                style={{
                  borderColor: "#005195",
                  color: "#005195",
                  backgroundColor: "transparent",
                }}
                className="hover:bg-blue-50"
              >
                Read Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold" style={{ color: "#414141" }}>
          Your Read Articles
        </h3>
        {readArticles.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllRead}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 bg-transparent"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {readArticleObjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {readArticleObjects.map((article) => (
            <div key={article.id} className="relative">
              <ArticleCard article={article} isRead={true} onClick={() => onArticleClick(article.id)} />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-600 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation()
                  markAsUnread(article.id)
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <Card style={{ borderColor: "#005195", backgroundColor: "#ffffff" }}>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4" style={{ color: "#58595b" }} />
            <h4 className="text-lg font-semibold mb-2" style={{ color: "#414141" }}>
              No articles read yet
            </h4>
            <p style={{ color: "#58595b" }}>Start reading articles to see them appear in your reading history.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
