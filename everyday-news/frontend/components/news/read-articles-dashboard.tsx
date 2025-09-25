
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Trash2, ArrowLeft } from "lucide-react";
import { ArticleCard } from "./article-card";
import { HistoryEntry } from "@/lib/history";



interface ReadArticlesDashboardProps {
  history: HistoryEntry[];
  removeHistory: (historyId: number) => void;
  onArticleClick: (articleId: number) => void;
  onBackToArticles?: () => void;
}

export function ReadArticlesDashboard({
  history,
  removeHistory,
  onArticleClick,
  onBackToArticles,
}: ReadArticlesDashboardProps) {
  return (
    <div className="space-y-6">
     
      <div className="flex items-center gap-4">
        {onBackToArticles && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBackToArticles}
            className="hover:bg-blue-50 hover:border-blue-400"
            style={{ borderColor: "#005195", color: "#005195" }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Articles
          </Button>
        )}
        <div>
          <h2 className="text-3xl font-bold" style={{ color: "#414141" }}>
            Reading History
          </h2>
          <p style={{ color: "#58595b" }}>
            Track your reading progress and revisit articles
          </p>
        </div>
      </div>

     
      {history.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((entry) => (
            <div key={entry.history_id} className="relative">
              <ArticleCard
                article={{
                  id: entry.news_id,
                  title: entry.title ?? "",
                  summary: entry.summary ?? "",
                  content: "",
                  author: entry.author ?? "",
                  publishedAt: entry.read_at,
                  imageUrl: entry.imageUrl ?? "",
                }}
                isRead={true}
                onClick={() => onArticleClick(entry.news_id)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-600 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  removeHistory(entry.history_id);
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
            <BookOpen
              className="h-12 w-12 mx-auto mb-4"
              style={{ color: "#58595b" }}
            />
            <h4
              className="text-lg font-semibold mb-2"
              style={{ color: "#414141" }}
            >
              No articles read yet
            </h4>
            <p style={{ color: "#58595b" }}>
              Start reading articles to see them appear in your reading history.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
