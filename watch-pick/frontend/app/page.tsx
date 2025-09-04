"use client";

import { useEffect, useState } from "react";
import { Search, Heart, Star, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Movie {
  imdbID: string; 
  Title: string; 
  Year: string; 
  Type: string;
  Poster: string;
}

export default function MovieFavoritesApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);

  // load saved favorites from backend on mount

  async function loadFavorites() {
    try {
      const res = await fetch("http://localhost:8000/favorites");
      if (!res.ok) {
        console.error("Failed to load favorites", res.status);
        return;
      }
      const data: Movie[] = await res.json();
      setFavorites(data);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  }

  // useEffect calls it on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    async function fetchMovies() {
      if (!searchTerm) return;

      const res = await fetch(
        `http://localhost:8000/movies?title=${encodeURIComponent(searchTerm)}`
      );
      if (!res.ok) {
        console.log("failed to fetch");
        return;
      }

      const data = await res.json();
      setMovies(data);
    }
    fetchMovies();
  }, [searchTerm]);

  const filteredMovies = movies.filter(
    (movie) =>
      movie.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.Type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToFavorites = async (movie: Movie) => {
    try {
      const res = await fetch("http://localhost:8000/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movie), // send the whole movie object
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to add favorite:", err);
        return;
      }

      await loadFavorites(); // update state with the saved movie
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  const removeFromFavorites = async (movieId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/favorites/${movieId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to remove favorite:", err);
        return;
      }

      // update state only if backend delete worked
      await loadFavorites();
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const MovieCard = ({
    movie,
    isFavorite = false,
  }: {
    movie: Movie;
    isFavorite?: boolean;
  }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={movie.Poster || "/placeholder.svg"}
            alt={movie.Title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
    
        </div>
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-balance leading-tight">
              {movie.Title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {movie.Year}
              </span>
            
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {movie.Type}
          </Badge>
          {isFavorite ? (
            <Button
              onClick={() => removeFromFavorites(movie.imdbID)}
              variant="destructive"
              size="sm"
              className="w-full"
            >
              Remove from Favorites
            </Button>
          ) : (
            <Button
              onClick={() => addToFavorites(movie)}
              variant="default"
              size="sm"
              className="w-full"
              disabled={favorites.some((fav) => fav.imdbID === movie.imdbID)}
            >
              <Heart className="w-4 h-4 mr-2" />
              {favorites.some((fav) => fav.imdbID === movie.imdbID)
                ? "Added"
                : "Add to Favorites"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">MovieFaves</h1>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background text-foreground"
                />
              </div>
            </div>

            <Button
              onClick={() => setShowFavorites(!showFavorites)}
              variant="outline"
              className="flex items-center gap-2 text-gray-700"
            >
              <Heart className="w-4 h-4 text-gray-700" />
              Favorites ({favorites.length})
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {showFavorites ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">My Favorites</h2>
              <Button onClick={() => setShowFavorites(false)} variant="outline">
                Back to Search
              </Button>
            </div>

            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground">
                  Start adding movies to your favorites list!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favorites.map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    isFavorite={true}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">Discover Movies</h2>
              <p className="text-muted-foreground">
                {searchTerm
                  ? `Search results for "${searchTerm}"`
                  : "Browse our collection of movies"}
              </p>
            </div>

            {filteredMovies.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No movies found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.imdbID} movie={movie} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
