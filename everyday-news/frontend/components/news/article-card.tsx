"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { type Article, formatDate } from "@/lib/news";


interface ArticleCardProps {
  article: Article;
  isRead?: boolean;
  onClick: () => void;
}

export function ArticleCard({
  article,
  isRead = false,
  onClick,
}: ArticleCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isRead ? "opacity-70" : ""
      }`}
      style={{
        borderColor: isRead ? "#58595b" : "#005195",
        backgroundColor: isRead ? "#f8f9fa" : "#ffffff",
      }}
      onClick={onClick}
    >
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />

          {isRead && (
            <div className="absolute top-3 right-3">
              <Badge
                variant="outline"
                style={{
                  backgroundColor: "#58595b",
                  color: "#ffffff",
                  borderColor: "#58595b",
                }}
              >
                Read
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3
          className="font-bold text-lg leading-tight mb-2 line-clamp-2"
          style={{ color: "#414141" }}
        >
          {article.title}
        </h3>
        <p className="text-sm mb-3 line-clamp-2" style={{ color: "#58595b" }}>
          {article.summary}
        </p>
        <div
          className="flex items-center justify-between text-xs"
          style={{ color: "#58595b" }}
        >
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{article.author}</span>
          </div>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
