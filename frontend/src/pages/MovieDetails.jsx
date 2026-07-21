import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiZap,
  FiAlertTriangle,
  FiCalendar,
  FiHash,
  FiInfo,
} from "react-icons/fi";
import PosterPlaceholder, { stripYear, extractYear } from "../components/movie/PosterPlaceholder";
import { Spinner } from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { getMovieDetails } from "../services/movieService";

export default function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const { data } = await getMovieDetails(movieId);
        if (mounted) setMovie(data);
      } catch (err) {
        if (mounted) {
          if (err.response?.status === 404) {
            setError("not_found");
          } else if (err.code === "ERR_NETWORK") {
            setError("network");
          } else {
            setError("server");
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size={48} />
      </div>
    );
  }

  if (error) {
    const copy = {
      not_found: {
        title: "Movie not found",
        description: "This title doesn't exist in the MovieVerse catalog.",
      },
      network: {
        title: "Can't reach MovieVerse servers",
        description: "Check that your backend is running and try again.",
      },
      server: {
        title: "Something went wrong",
        description: "We couldn't load this movie's details right now.",
      },
    }[error];

    return (
      <div className="max-w-3xl mx-auto px-5 py-24">
        <EmptyState icon={FiAlertTriangle} title={copy.title} description={copy.description} />
        <div className="mt-6 flex justify-center">
          <Button variant="ghost" icon={FiArrowLeft} onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const genreList = movie.genres
    ? String(movie.genres).split("|").filter((g) => g && g !== "(no genres listed)")
    : [];
  const year = extractYear(movie.title);
  const title = stripYear(movie.title);

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <FiArrowLeft /> Back
      </button>
      <p className="md:hidden -mt-5 mb-6 text-xs text-slate-500">Swipe left anywhere to go back.</p>

      <div className="grid md:grid-cols-[340px_1fr] gap-8 md:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5 aspect-[2/3] w-full max-w-sm mx-auto md:mx-0"
        >
          <PosterPlaceholder title={movie.title} className="h-full w-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="font-display text-4xl md:text-6xl tracking-wide text-white leading-tight">
            {title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            {year && (
              <span className="inline-flex items-center gap-1.5 font-mono">
                <FiCalendar /> {year}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 font-mono">
              <FiHash /> {movie.movieId}
            </span>
          </div>

          {genreList.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {genreList.map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs font-medium text-slate-300"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 rounded-2xl bg-surface/60 border border-white/5 p-6">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2">
              <FiInfo /> Overview
            </div>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              A detailed synopsis isn't available from the backend catalog yet.
              What we do know: this title carries the{" "}
              {genreList.length > 0
                ? genreList.slice(0, 3).join(", ").toLowerCase()
                : "listed"}{" "}
              genre signature our recommendation engine uses to find similar movies.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              icon={FiZap}
              onClick={() =>
                navigate(`/recommendations?type=content&movie=${encodeURIComponent(movie.title)}`)
              }
            >
              Get Recommendations
            </Button>
            <Link to="/home">
              <Button variant="ghost">Back to Home</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
