import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlay, FiCompass } from "react-icons/fi";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">
      {/* Cinematic background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(239,68,68,0.18), transparent), radial-gradient(ellipse 60% 50% at 85% 30%, rgba(59,130,246,0.14), transparent)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,#020617_95%)]" />
        {/* film strip texture */}
        <div className="absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(90deg,white_0px,white_1px,transparent_1px,transparent_60px)]" />
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 right-[8%] h-64 w-64 rounded-full bg-primary/20 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-16 left-[6%] h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-5 md:px-8 py-24 w-full"
      >
        <motion.span
          variants={item}
          className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold tracking-widest text-gold uppercase mb-6"
        >
          Content · Collaborative · Hybrid AI
        </motion.span>

        <motion.h1
          variants={item}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] leading-[0.95] tracking-wide text-gradient"
        >
          MovieVerse AI
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-lg md:text-xl text-slate-300 font-medium"
        >
          Discover movies you'll love with AI-powered recommendations —
          tuned to your taste, your history, and what the crowd already knows.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-4 font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-dark transition-colors"
          >
            <FiPlay className="group-hover:scale-110 transition-transform" />
            Get Started
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl glass px-7 py-4 font-semibold text-white hover:bg-white/10 transition-colors"
          >
            <FiCompass />
            Explore Movies
          </Link>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 text-sm text-slate-400"
        >
          <div>
            <span className="font-display text-3xl text-white block">3</span>
            AI recommendation engines
          </div>
          <div>
            <span className="font-display text-3xl text-white block">JWT</span>
            Secured authentication
          </div>
          <div>
            <span className="font-display text-3xl text-white block">FastAPI</span>
            Powered backend
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
