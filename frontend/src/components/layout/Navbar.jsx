import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiFilm, FiGlobe, FiMenu, FiX, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

const linkBase =
  "text-sm font-medium transition-colors hover:text-primary";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const { isAuthenticated, logout, user } = useAuth();
  const { language, languages, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeAccount = (event) => {
      if (!accountRef.current?.contains(event.target)) setAccountOpen(false);
    };
    const closeOnEscape = (event) => { if (event.key === "Escape") setAccountOpen(false); };
    document.addEventListener("mousedown", closeAccount);
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("mousedown", closeAccount); document.removeEventListener("keydown", closeOnEscape); };
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setAccountOpen(false);
    navigate("/login");
  };

  const navLinks = isAuthenticated
    ? [
        { to: "/home", label: t("home") },
        { to: "/recommendations", label: t("recommendations") },
        { to: "/profile", label: t("dashboard") },
      ]
    : [];

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg shadow-black/20" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 py-4">
        <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2 group">
          <span className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center text-primary text-xl group-hover:rotate-12 transition-transform">
            <FiFilm />
          </span>
          <span className="font-display text-2xl tracking-wide text-white">
            MovieVerse <span className="text-primary">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "text-primary" : "text-slate-300"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((open) => !open)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-slate-200 hover:border-primary hover:text-white transition-colors"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary"><FiUser /></span>
                <span className="max-w-24 truncate">{user?.sub?.split("@")[0] || t("account")}</span>
                <FiChevronDown className={`transition-transform ${accountOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {accountOpen && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.16 }} role="menu" className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
                  <Link to="/profile" onClick={() => setAccountOpen(false)} role="menuitem" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-200 hover:bg-white/5 hover:text-white"><FiUser className="text-primary" />{t("profile")}</Link>
                  <label className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300"><FiGlobe className="text-accent" /><span className="flex-1">{t("language")}</span><select value={language} onChange={(event) => setLanguage(event.target.value)} className="max-w-28 bg-transparent text-right text-xs text-white outline-none">{languages.map((item) => <option className="bg-slate-950" key={item.code} value={item.code}>{item.label}</option>)}</select></label>
                  <button onClick={handleLogout} role="menuitem" className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-300 hover:bg-primary/10 hover:text-primary"><FiLogOut /> {t("logout")}</button>
                </motion.div>}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                {t("login")}
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
              >
                <FiUser /> {t("getStarted")}
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-2xl text-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass border-t border-white/5 overflow-hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `py-2.5 text-sm font-medium ${
                      isActive ? "text-primary" : "text-slate-300"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="mt-2 inline-flex items-center gap-2 py-2.5 text-sm font-medium text-slate-300"><FiUser /> {t("profile")}</Link>
                  <label className="flex items-center gap-2 py-2 text-sm text-slate-300"><FiGlobe className="text-accent" /> {t("language")}<select value={language} onChange={(event) => setLanguage(event.target.value)} className="ml-auto rounded-lg bg-white/5 px-2 py-1 text-xs text-white">{languages.map((item) => <option className="bg-slate-950" key={item.code} value={item.code}>{item.label}</option>)}</select></label>
                  <button onClick={handleLogout} className="mt-2 inline-flex items-center gap-2 py-2.5 text-sm font-medium text-slate-300"><FiLogOut /> {t("logout")}</button>
                </>
              ) : (
                <div className="mt-2 flex flex-col gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm font-medium text-slate-300 py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    {t("getStarted")}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
