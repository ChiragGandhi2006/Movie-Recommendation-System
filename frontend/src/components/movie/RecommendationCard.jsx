import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiZap, FiUsers, FiLayers, FiHeart } from "react-icons/fi";
import PosterPlaceholder, { stripYear, extractYear } from "./PosterPlaceholder";
import FavoriteButton from "./FavoriteButton";

const TYPE_META = {
  content: { label: "Content-Based", icon: FiZap, color: "text-accent" },
  collaborative: { label: "Collaborative", icon: FiUsers, color: "text-primary" },
  hybrid: { label: "Hybrid AI", icon: FiLayers, color: "text-gold" },
  personalized: { label: "Your Genres", icon: FiHeart, color: "text-primary" },
};

function getExplanation(type, similarity, predictedRating) {
  if (type === "hybrid") return { label: "Hybrid recommendation", detail: "Blends content similarity with collaborative signals." };
  if (type === "collaborative") return { label: "Similar users enjoyed this", detail: "Based on viewing patterns close to yours." };
  if (similarity != null) return { label: "High similarity score", detail: "Matches the themes and attributes of your selection." };
  if (predictedRating != null) return { label: "Strong predicted match", detail: "The model estimates this fits your taste." };
  return { label: "Similar genres", detail: "Selected because it shares genre signals with your preferences." };
}

export default function RecommendationCard({ item, index = 0 }) {
  const { movieId, title, predicted_rating, similarity, type = "content" } = item;
  const meta = TYPE_META[type] || TYPE_META.content;
  const Icon = meta.icon;
  const year = extractYear(title);

  // Convert a 0-5 predicted rating into a Netflix-style match percentage
  const matchPercent =
    predicted_rating != null ? Math.round((predicted_rating / 5) * 100) : null;
  const confidence = matchPercent ?? (similarity != null ? Math.round(Number(similarity) * 100) : null);
  const explanation = getExplanation(type, similarity, predicted_rating);

  const CardInner = (
    <>
      <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl">
        <FavoriteButton movie={item} />
        <PosterPlaceholder title={title} className="h-full w-full transition-transform duration-500 group-hover:scale-110" />
        <div className={`absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-[11px] font-semibold ${meta.color}`}>
          <Icon /> {meta.label}
        </div>
      </div>
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-sm md:text-base text-white leading-snug line-clamp-2">
          {stripYear(title)}
        </h3>
        <div className="mt-1 text-xs text-slate-400 font-mono">{year || "—"}</div>

        {matchPercent != null && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gold font-semibold">{matchPercent}% Match</span>
              <span className="text-slate-500 font-mono">{predicted_rating}/5</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${matchPercent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-accent to-gold"
              />
            </div>
          </div>
        )}

        {similarity != null && (
          <div className="mt-2 text-xs text-slate-400">
            Similarity Score:{" "}
            <span className="font-mono text-accent">{similarity}</span>
          </div>
        )}
        <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.03] p-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Why recommended?</p>
          <p className="mt-1 text-xs font-semibold text-slate-200">{explanation.label}</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{explanation.detail}</p>
          {confidence != null && <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><motion.div initial={{ width: 0 }} whileInView={{ width: `${Math.min(confidence, 100)}%` }} viewport={{ once: true }} className="h-full rounded-full bg-gradient-to-r from-primary to-gold" /></div>}
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -8 }}
      className="group rounded-2xl overflow-hidden bg-card border border-white/5 shadow-lg shadow-black/30 hover:shadow-2xl hover:shadow-accent/20 transition-shadow duration-300"
    >
      {movieId != null ? (
        <Link to={`/movie/${movieId}`}>{CardInner}</Link>
      ) : (
        <div className="cursor-default">{CardInner}</div>
      )}
    </motion.div>
  );
}
