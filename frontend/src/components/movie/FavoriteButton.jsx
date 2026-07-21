import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";
import { getFavorites, toggleFavorite } from "../../utils/storage";
import { useToast } from "../../context/ToastContext";

export default function FavoriteButton({ movie, className = "" }) {
  const [saved, setSaved] = useState(() => getFavorites().some((item) => item.movieId === movie.movieId));
  const toast = useToast();
  useEffect(() => { const sync = () => setSaved(getFavorites().some((item) => item.movieId === movie.movieId)); window.addEventListener("mv-storage", sync); return () => window.removeEventListener("mv-storage", sync); }, [movie.movieId]);
  const handleClick = (event) => { event.preventDefault(); event.stopPropagation(); const added = toggleFavorite(movie); setSaved(added); toast(added ? "Added to favorites" : "Removed from favorites", added ? "success" : "info"); };
  return <motion.button whileTap={{ scale: 0.82 }} whileHover={{ scale: 1.08 }} onClick={handleClick} aria-label={saved ? "Remove from favorites" : "Add to favorites"} className={`absolute z-10 top-2 left-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur text-lg transition-colors ${saved ? "text-primary" : "text-white"} ${className}`}><FiHeart fill={saved ? "currentColor" : "none"} /></motion.button>;
}
