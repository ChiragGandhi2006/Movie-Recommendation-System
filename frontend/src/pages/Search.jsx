import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiAlertTriangle } from "react-icons/fi";
import SearchBar from "../components/movie/SearchBar";
import MovieCard from "../components/movie/MovieCard";
import { MovieGridSkeleton } from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { searchMovies } from "../services/movieService";
import { addActivity } from "../utils/storage";
import { useToast } from "../context/ToastContext";

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get("query") || "";

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const { data } = await searchMovies(query.trim());
        if (mounted) {
          setMovies(Array.isArray(data) ? data : []);
          addActivity("search", { label: query.trim() });
          toast("Search completed", "info");
        }
      } catch (err) {
        if (mounted) {
          if (err.code === "ERR_NETWORK") {
            setError("Can't reach MovieVerse servers. Is the backend running?");
          } else {
            setError("Something went wrong while searching. Please try again.");
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [query, toast]);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl mb-10"
      >
        <h1 className="font-display text-3xl md:text-4xl tracking-wide text-white mb-5">
          Search Results
        </h1>
        <SearchBar size="md" />
      </motion.div>

      {query.trim() && (
        <p className="text-sm text-slate-400 mb-6">
          Showing results for <span className="text-white font-medium">“{query}”</span>
        </p>
      )}

      {!query.trim() && (
        <EmptyState
          icon={FiSearch}
          title="Start typing to search"
          description="Use the search bar above to find a movie by title."
        />
      )}

      {query.trim() && loading && <MovieGridSkeleton count={10} />}

      {query.trim() && !loading && error && (
        <EmptyState icon={FiAlertTriangle} title="Search failed" description={error} />
      )}

      {query.trim() && !loading && !error && movies.length === 0 && (
        <EmptyState
          icon={FiSearch}
          title="No movies found"
          description={`We couldn't find any titles matching "${query}". Try a different spelling or a shorter phrase.`}
        />
      )}

      {query.trim() && !loading && !error && movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.map((m, i) => (
            <MovieCard key={m.movieId} movie={m} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
