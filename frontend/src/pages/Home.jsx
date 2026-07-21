import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiFilm, FiTrendingUp, FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import SearchBar from "../components/movie/SearchBar";
import MovieCard from "../components/movie/MovieCard";
import RecommendationCard from "../components/movie/RecommendationCard";
import { MovieGridSkeleton } from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { searchMovies, getPersonalizedRecommendations } from "../services/movieService";

const POPULAR_SEEDS = ["Avengers", "Harry Potter", "Lord of the Rings", "Jurassic", "Inception"];

function useSeededMovies(seeds) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const results = await Promise.allSettled(seeds.map((s) => searchMovies(s)));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { movies, loading, failed };
}

export default function Home() {
  const { user } = useAuth();
  const trending = useSeededMovies(["Star Wars", "Toy Story", "Batman", "Matrix", "Godfather"]);
  const popular = useSeededMovies(POPULAR_SEEDS);

  const [recs, setRecs] = useState([]);
  const [recommendationGenres, setRecommendationGenres] = useState([]);
  const [recsLoading, setRecsLoading] = useState(true);
  const [recsFailed, setRecsFailed] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setRecsLoading(false);
      setRecsFailed(true);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const { data } = await getPersonalizedRecommendations();
        if (mounted) {
          setRecs(Array.isArray(data.recommendations) ? data.recommendations : []);
          setRecommendationGenres(Array.isArray(data.genres) ? data.genres : []);
        }
      } catch {
        if (mounted) setRecsFailed(true);
      } finally {
        if (mounted) setRecsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  return (
    <div>
      {/* Compact hero banner */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(239,68,68,0.16), transparent)",
          }}
        />
        <div className="max-w-7xl mx-auto px-5 md:px-8 pt-14 pb-10 md:pt-20 md:pb-14 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wide text-white"
          >
            Welcome back{user?.sub ? `, ${user.sub.split("@")[0]}` : ""}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-slate-400 max-w-xl mx-auto"
          >
            Search a title, or scroll down for picks tuned to your taste.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 max-w-xl mx-auto"
          >
            <SearchBar size="lg" autoFocus />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 md:px-8 space-y-16 md:space-y-20 pb-20">
        {/* Recommended for you */}
        <section>
          <div className="flex items-center gap-2.5 mb-8">
            <span className="h-9 w-9 rounded-xl bg-gold/15 flex items-center justify-center text-gold">
              <FiTrendingUp />
            </span>
            <h2 className="font-display text-3xl md:text-4xl tracking-wide text-white">
              Picked For Your Taste
            </h2>
            {recommendationGenres.length > 0 && <span className="text-sm text-slate-400">Because you chose {recommendationGenres.join(", ")}</span>}
          </div>

          {recsLoading && <MovieGridSkeleton count={5} />}

          {!recsLoading && recsFailed && (
            <EmptyState
              icon={FiTrendingUp}
              title="Personalized picks aren't ready yet"
              description="Rate a few movies or check back soon — your collaborative recommendations will appear here once the model has data on your taste."
            />
          )}

          {!recsLoading && !recsFailed && recs.length === 0 && (
            <EmptyState
              icon={FiTrendingUp}
              title="No recommendations found"
              description="The recommendation engine didn't return any picks for your account right now."
            />
          )}

          {!recsLoading && !recsFailed && recs.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {recs.slice(0, 10).map((item, i) => (
                <RecommendationCard
                  key={item.movieId}
                  index={i}
                  item={{ ...item, type: "personalized" }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Trending */}
        <section>
          <div className="flex items-center gap-2.5 mb-8">
            <span className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
              <FiFilm />
            </span>
            <h2 className="font-display text-3xl md:text-4xl tracking-wide text-white">
              Trending Movies
            </h2>
          </div>
          {trending.loading && <MovieGridSkeleton count={10} />}
          {!trending.loading && trending.failed && (
            <EmptyState icon={FiSearch} title="Couldn't load trending titles" description="Check that your backend is running and reachable." />
          )}
          {!trending.loading && !trending.failed && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {trending.movies.map((m, i) => (
                <MovieCard key={m.movieId} movie={m} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* Popular */}
        <section>
          <div className="flex items-center gap-2.5 mb-8">
            <span className="h-9 w-9 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
              <FiFilm />
            </span>
            <h2 className="font-display text-3xl md:text-4xl tracking-wide text-white">
              Popular Movies
            </h2>
          </div>
          {popular.loading && <MovieGridSkeleton count={10} />}
          {!popular.loading && popular.failed && (
            <EmptyState icon={FiSearch} title="Couldn't load popular titles" description="Check that your backend is running and reachable." />
          )}
          {!popular.loading && !popular.failed && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {popular.movies.map((m, i) => (
                <MovieCard key={m.movieId} movie={m} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
