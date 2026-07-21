import { motion } from "framer-motion";
import { FiZap, FiUsers, FiLayers } from "react-icons/fi";

const features = [
  {
    icon: FiZap,
    title: "Content-Based Recommendation",
    description:
      "Finds movies with similar DNA — genre, tone, and theme — to the title you already love, using cosine similarity across a trained feature space.",
    color: "text-accent",
    glow: "group-hover:shadow-accent/20",
  },
  {
    icon: FiUsers,
    title: "Collaborative Filtering",
    description:
      "Learns from patterns across thousands of viewers with similar taste to yours, powered by a trained SVD matrix-factorization model.",
    color: "text-primary",
    glow: "group-hover:shadow-primary/20",
  },
  {
    icon: FiLayers,
    title: "Hybrid Recommendation",
    description:
      "Blends content similarity with collaborative predictions to surface picks that are both relevant to the title and personalized to you.",
    color: "text-gold",
    glow: "group-hover:shadow-gold/20",
  },
];

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mb-14"
      >
        <span className="text-xs font-semibold tracking-widest text-primary uppercase">
          How the engine thinks
        </span>
        <h2 className="mt-3 font-display text-4xl md:text-5xl tracking-wide text-white">
          Three ways MovieVerse understands you
        </h2>
        <p className="mt-4 text-slate-400 text-base md:text-lg">
          Every recommendation on this platform is produced by a real,
          trained machine learning model running on your FastAPI backend.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className={`group relative rounded-2xl border border-white/5 bg-card/60 p-8 shadow-lg transition-shadow duration-300 ${f.glow}`}
          >
            <div
              className={`h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl ${f.color} mb-6 group-hover:scale-110 transition-transform`}
            >
              <f.icon />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {f.title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {f.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
