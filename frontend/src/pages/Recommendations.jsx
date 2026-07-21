import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiZap, FiUsers, FiLayers, FiSearch, FiAlertTriangle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import RecommendationCard from "../components/movie/RecommendationCard";
import { MovieGridSkeleton } from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { addActivity } from "../utils/storage";
import { useToast } from "../context/ToastContext";
import {
  getContentRecommendations,
  getCollaborativeRecommendations,
  getHybridRecommendations,
  searchMovies,
} from "../services/movieService";

const TABS = [
  { id: "content", label: "Content-Based", icon: FiZap },
  { id: "collaborative", label: "Collaborative", icon: FiUsers },
  { id: "hybrid", label: "Hybrid", icon: FiLayers },
];

export default function Recommendations() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();

  const initialTab = params.get("type") || "content";
  const [tab, setTab] = useState(TABS.some((t) => t.id === initialTab) ? initialTab : "content");
  const [movieName, setMovieName] = useState(params.get("movie") || "");
  const [inputValue, setInputValue] = useState(params.get("movie") || "");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(Boolean(params.get("movie")));
  const toast = useToast();

  const needsMovieName = tab === "content" || tab === "hybrid";

  useEffect(() => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("type", tab);
      if (movieName) next.set("movie", movieName);
      else next.delete("movie");
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, movieName]);

  const runQuery = useMemo(
    () => async () => {
      setError(null);
      setLoading(true);
      setItems([]);
      try {
        if (tab === "content") {
          const { data } = await getContentRecommendations(movieName.trim());
          const titles = data?.recommendations || [];

          // Enrich bare titles with movieId via a best-effort search lookup
          const enriched = await Promise.all(
            titles.map(async (title) => {
              try {
                const { data: matches } = await searchMovies(title);
                const found = matches?.find((m) => m.title === title) || matches?.[0];
                return { movieId: found?.movieId, title, type: "content" };
              } catch {
                return { title, type: "content" };
              }
            })
          );
          setItems(enriched);
          addActivity("recommendation", { label: movieName.trim(), type: "Content-Based" });
        } else if (tab === "collaborative") {
          if (!user?.id) throw { custom: "no_user" };
          const { data } = await getCollaborativeRecommendations(user.id);
          setItems((data || []).map((d) => ({ ...d, type: "collaborative" })));
          addActivity("recommendation", { label: "Personalized collaborative feed", type: "Collaborative" });
        } else if (tab === "hybrid") {
          if (!user?.id) throw { custom: "no_user" };
          const { data } = await getHybridRecommendations(user.id, movieName.trim());
          setItems((Array.isArray(data) ? data : []).map((d) => ({ ...d, type: "hybrid" })));
          addActivity("recommendation", { label: movieName.trim(), type: "Hybrid" });
        }
        toast("Recommendations generated", "success");
      } catch (err) {
        if (err?.custom === "no_user") {
          setError("We couldn't determine your user ID. Try logging out and back in.");
        } else if (err.response?.status === 404) {
          setError(`We couldn't find "${movieName}" in the movie catalog.`);
        } else if (err.code === "ERR_NETWORK") {
          setError("Can't reach MovieVerse servers. Is the backend running?");
        } else {
          setError("Something went wrong while fetching recommendations.");
        }
      } finally {
        setLoading(false);
      }
    },
    [tab, movieName, user?.id, toast]
  );

  useEffect(() => {
    if (tab === "collaborative") {
      setHasSearched(true);
      runQuery();
    } else if (movieName.trim()) {
      setHasSearched(true);
      runQuery();
    } else {
      setItems([]);
      setHasSearched(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, movieName, user?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setMovieName(inputValue.trim());
  };

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-4xl md:text-5xl tracking-wide text-white">
          Recommendations
        </h1>
        <p className="mt-3 text-slate-400 max-w-xl">
          Pick an engine below. Content and Hybrid need a movie title to work from —
          Collaborative uses your account's rating history automatically.
        </p>
      </motion.div>

      <div className="mt-8 flex flex-wrap gap-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-primary text-white shadow-lg shadow-primary/30"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <t.icon /> {t.label}
          </button>
        ))}
      </div>
      <p className="md:hidden mt-3 text-xs text-slate-500">Swipe left anywhere to return to the previous page.</p>

      {needsMovieName && (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-wrap gap-3 max-w-xl">
          <div className="relative flex-1 min-w-[220px]">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a movie title, e.g. Toy Story"
              className="w-full rounded-xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/60 transition-all"
            />
          </div>
          <Button type="submit" size="md">
            Find
          </Button>
        </form>
      )}

      <div className="mt-10">
        {loading && <MovieGridSkeleton count={5} />}

        {!loading && error && (
          <EmptyState icon={FiAlertTriangle} title="Couldn't get recommendations" description={error} />
        )}

        {!loading && !error && needsMovieName && !hasSearched && (
          <EmptyState
            icon={FiSearch}
            title="Enter a movie title to begin"
            description="Recommendations are generated from an exact title match in the catalog — try copying a title from a movie's details page."
          />
        )}

        {!loading && !error && hasSearched && items.length === 0 && (
          <EmptyState
            icon={FiSearch}
            title="No recommendations found"
            description="Try a different title, or double-check the exact spelling and year."
          />
        )}

        {!loading && !error && items.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {items.map((item, i) => (
              <RecommendationCard key={`${item.movieId ?? item.title}-${i}`} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
