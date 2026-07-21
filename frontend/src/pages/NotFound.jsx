import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiFilm, FiHome } from "react-icons/fi";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mx-auto h-20 w-20 rounded-2xl bg-primary/15 flex items-center justify-center text-primary text-4xl mb-6">
          <FiFilm />
        </div>
        <h1 className="font-display text-7xl md:text-8xl tracking-wide text-white">404</h1>
        <p className="mt-4 text-lg text-slate-400">
          This scene didn't make the final cut. The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="inline-block mt-8">
          <Button icon={FiHome}>Back to Home</Button>
        </Link>
      </motion.div>
    </div>
  );
}
