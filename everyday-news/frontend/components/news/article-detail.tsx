"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Calendar } from "lucide-react"
import { type Article, formatDate } from "@/lib/news"
import Image from "next/image"

interface ArticleDetailProps {
  article: Article
  isRead: boolean
  onBack: () => void
  onMarkAsRead: () => void
}

export function ArticleDetail({ article, isRead, onBack, onMarkAsRead }: ArticleDetailProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Articles
        </Button>

        <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-lg mb-6">
          <Image
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          {isRead && (
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-800 border-blue-300"
            >
              Read
            </Badge>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-balance">
          {article.title}
        </h1>

        <p className="text-lg text-muted-foreground mb-6 text-pretty">
          {article.summary}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>

        {!isRead && (
          <Button
            onClick={onMarkAsRead}
            className="mb-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Mark as Read
          </Button>
        )}
      </div>

      <div className="prose prose-lg max-w-none">
        {article.content.split("\n\n").map((paragraph, index) => (
          <p key={index} className="mb-4 leading-relaxed text-pretty">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  )
}
