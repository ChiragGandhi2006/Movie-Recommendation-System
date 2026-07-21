import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiArrowUpRight } from "react-icons/fi";
import PosterPlaceholder, { stripYear, extractYear } from "./PosterPlaceholder";
import FavoriteButton from "./FavoriteButton";

export default function MovieCard({ movie, index = 0 }) {
  const { movieId, title, genres, predicted_rating } = movie;
  const year = extractYear(title);
  const genreList = genres
    ? genres.split("|").filter((g) => g && g !== "(no genres listed)")
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -8 }}
      className="group relative rounded-2xl overflow-hidden bg-card border border-white/5 shadow-lg shadow-black/30 hover:shadow-2xl hover:shadow-primary/20 transition-shadow duration-300"
    >
      <Link to={`/movie/${movieId}`} className="block">
        <div className="relative aspect-[2/3] overflow-hidden">
          <FavoriteButton movie={movie} />
          <PosterPlaceholder
            title={title}
            className="h-full w-full transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-lg">
              View Details <FiArrowUpRight />
            </span>
          </div>
          {predicted_rating != null && (
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-xs font-mono text-gold">
              <FiStar className="text-gold" /> {predicted_rating}
            </div>
          )}
        </div>
        <div className="p-3 md:p-4">
          <h3 className="font-semibold text-sm md:text-base text-white leading-snug line-clamp-2">
            {stripYear(title)}
          </h3>
          <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
            {year && <span className="font-mono">{year}</span>}
            {genreList.length > 0 && year && <span>·</span>}
            {genreList.length > 0 && (
              <span className="truncate">{genreList.slice(0, 2).join(", ")}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
