import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiSearch, FiX, FiLoader } from "react-icons/fi";
import { searchMovies } from "../../services/movieService";
import { stripYear } from "./PosterPlaceholder";

export default function SearchBar({ autoFocus = false, size = "md", onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await searchMovies(query.trim());
        setSuggestions(Array.isArray(data) ? data : []);
      } catch {
        setError("Couldn't reach MovieVerse servers. Please try again.");
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    navigate(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  const handleSelect = (movie) => {
    setOpen(false);
    setQuery("");
    if (onSelect) onSelect(movie);
    navigate(`/movie/${movie.movieId}`);
  };

  const sizes = {
    sm: "py-2.5 text-sm",
    md: "py-3.5 text-base",
    lg: "py-4 md:py-5 text-lg",
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <FiSearch className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          type="text"
          placeholder="Search for a movie title…"
          className={`w-full rounded-full glass pl-11 md:pl-14 pr-11 ${sizes[size]} text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/60 transition-all`}
        />
        {loading && (
          <FiLoader className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-slate-400 animate-spin" />
        )}
        {!loading && query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setSuggestions([]);
            }}
            className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <FiX />
          </button>
        )}
      </form>

      <AnimatePresence>
        {open && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 mt-2 w-full rounded-2xl glass shadow-2xl overflow-hidden max-h-96 overflow-y-auto"
          >
            {loading && (
              <div className="px-5 py-4 text-sm text-slate-400">Searching…</div>
            )}

            {!loading && error && (
              <div className="px-5 py-4 text-sm text-red-400">{error}</div>
            )}

            {!loading && !error && suggestions.length === 0 && (
              <div className="px-5 py-4 text-sm text-slate-400">
                No movies found for “{query}”.
              </div>
            )}

            {!loading &&
              !error &&
              suggestions.map((movie) => (
                <button
                  key={movie.movieId}
                  onClick={() => handleSelect(movie)}
                  className="w-full text-left px-5 py-3 hover:bg-white/5 transition-colors flex items-center justify-between gap-3 border-b border-white/5 last:border-0"
                >
                  <span className="text-sm text-white truncate">
                    {stripYear(movie.title)}
                  </span>
                  <span className="text-xs text-slate-500 font-mono shrink-0">
                    #{movie.movieId}
                  </span>
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
