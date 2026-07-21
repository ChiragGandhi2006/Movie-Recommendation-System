import { FiFilm, FiGithub, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface/60 mt-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary">
            <FiFilm />
          </span>
          <span className="font-display text-xl tracking-wide text-white">
            MovieVerse <span className="text-primary">AI</span>
          </span>
        </div>

        <p className="text-xs md:text-sm text-slate-500 text-center">
          Discover movies you'll love with AI-powered recommendations.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 hover:text-primary hover:bg-white/10 transition-colors"
          >
            <FiGithub />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 hover:text-accent hover:bg-white/10 transition-colors"
          >
            <FiLinkedin />
          </a>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} MovieVerse AI. All rights reserved.
      </div>
    </footer>
  );
}
