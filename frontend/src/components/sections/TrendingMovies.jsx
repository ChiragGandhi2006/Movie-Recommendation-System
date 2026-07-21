import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { searchMovies } from "../../services/movieService";
import { MovieGridSkeleton } from "../ui/Loader";
import EmptyState from "../ui/EmptyState";
import MovieCard from "../movie/MovieCard";
import { FiFilm } from "react-icons/fi";

// The backend has no dedicated "trending" endpoint, so this section pulls
// real titles from /movies/search using a curated set of popular seed terms.
const SEED_TERMS = ["Star Wars", "Toy Story", "Batman", "Matrix", "Godfather"];

export default function TrendingMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const results = await Promise.allSettled(
          SEED_TERMS.map((term) => searchMovies(term))
        );

        const merged = [];
        const seen = new Set();

        results.forEach((res) => {
          if (res.status === "fulfilled" && Array.isArray(res.value.data)) {
            res.value.data.forEach((m) => {
              if (!seen.has(m.movieId)) {
                seen.add(m.movieId);
                merged.push(m);
              }
            });
          }
        });

        if (mounted) {
          setMovies(merged.slice(0, 10));
          setFailed(merged.length === 0);
        }
      } catch {
        if (mounted) setFailed(true);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-end justify-between mb-10"
      >
        <div>
          <span className="text-xs font-semibold tracking-widest text-gold uppercase">
            Live from the backend
          </span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl tracking-wide text-white">
            Trending in the MovieVerse
          </h2>
        </div>
        <Link
          to="/signup"
          className="hidden sm:inline-block text-sm font-semibold text-primary hover:text-white transition-colors"
        >
          Explore all →
        </Link>
      </motion.div>

      {loading && <MovieGridSkeleton count={10} />}

      {!loading && failed && (
        <EmptyState
          icon={FiFilm}
          title="Trending titles are warming up"
          description="We couldn't reach the movie catalog just now. Once your backend is running, real trending titles will appear here."
        />
      )}

      {!loading && !failed && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.map((movie, i) => (
            <MovieCard key={movie.movieId} movie={movie} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
