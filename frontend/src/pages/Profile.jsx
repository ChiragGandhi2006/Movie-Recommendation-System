import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart, Bar, Cell, PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FiBarChart2, FiClock, FiEdit3, FiFilm, FiHeart, FiLogOut, FiSearch, FiTrash2, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { clearActivity, getActivity, getFavorites, getUserSettings, removeActivity, saveUserSettings, toggleFavorite } from "../utils/storage";
import { useToast } from "../context/ToastContext";
import { useLanguage } from "../context/LanguageContext";

const COLORS = ["#ef4444", "#3b82f6", "#facc15", "#8b5cf6", "#10b981"];
const Stat = ({ icon: Icon, label, value, color = "text-primary" }) => <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/5 bg-surface/60 p-5"><Icon className={`text-xl ${color}`} /><p className="mt-3 text-2xl font-bold text-white">{value}</p><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p></motion.div>;

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { language, setLanguage, t } = useLanguage();
  const email = user?.sub || "guest";
  const [editing, setEditing] = useState(false);
  const [settings, setSettings] = useState(() => getUserSettings(email));
  const [favorites, setFavorites] = useState(getFavorites);
  const [searches, setSearches] = useState(() => getActivity("search"));
  const [recommendations, setRecommendations] = useState(() => getActivity("recommendation"));
  const refresh = () => { setFavorites(getFavorites()); setSearches(getActivity("search")); setRecommendations(getActivity("recommendation")); };

  useEffect(() => { window.addEventListener("mv-storage", refresh); return () => window.removeEventListener("mv-storage", refresh); }, []);
  const genreData = useMemo(() => Object.entries(favorites.flatMap((movie) => (movie.genres || "").split("|")).filter(Boolean).reduce((all, genre) => ({ ...all, [genre]: (all[genre] || 0) + 1 }), {})).map(([name, value]) => ({ name, value })).slice(0, 5), [favorites]);
  const typeData = useMemo(() => Object.entries(recommendations.reduce((all, activity) => ({ ...all, [activity.type || "Personalized"]: (all[activity.type || "Personalized"] || 0) + 1 }), {})).map(([name, value]) => ({ name, value })), [recommendations]);
  const favoriteGenre = genreData[0]?.name || user?.preferences?.[0] || "Not set";
  const favoriteType = typeData[0]?.name || "Not explored";
  const removeFavorite = (movie) => { toggleFavorite(movie); toast("Removed from favorites", "info"); };
  const clear = (kind) => { clearActivity(kind); refresh(); toast("History cleared", "info"); };
  const remove = (kind, label) => { removeActivity(kind, label); refresh(); };
  const handleLogout = () => { logout(); navigate("/login"); };
  const displayName = settings.displayName || email.split("@")[0];
  const saveProfile = (event) => { event.preventDefault(); saveUserSettings(email, settings); setLanguage(settings.language || language); setEditing(false); toast("Profile updated", "success"); };

  return <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16 space-y-10">
    <section className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{t("dashboard")}</p><h1 className="mt-2 font-display text-4xl md:text-5xl tracking-wide text-white">{t("welcome")}, {displayName}</h1><p className="mt-2 text-slate-400">Your taste, activity, and saved movies in one place.</p></div><div className="flex gap-3"><Button variant="ghost" icon={FiEdit3} onClick={() => setEditing((value) => !value)}>{t("editProfile")}</Button><Button variant="outline" icon={FiLogOut} onClick={handleLogout}>{t("logout")}</Button></div></section>
    {editing && <motion.form initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} onSubmit={saveProfile} className="grid gap-4 rounded-3xl border border-primary/20 bg-primary/5 p-6 md:grid-cols-[1fr_220px_auto] md:items-end"><label className="block text-sm text-slate-300">Display name<input value={settings.displayName || ""} onChange={(event) => setSettings((current) => ({ ...current, displayName: event.target.value }))} placeholder={email.split("@")[0]} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white" /></label><label className="block text-sm text-slate-300">{t("language")}<select value={settings.language || language} onChange={(event) => setSettings((current) => ({ ...current, language: event.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white"><option value="en">English</option><option value="hi">हिन्दी (Hindi)</option><option value="mr">मराठी (Marathi)</option></select></label><Button type="submit">{t("save")}</Button></motion.form>}
    <section className="grid grid-cols-2 lg:grid-cols-5 gap-4"><Stat icon={FiSearch} label="Searches" value={searches.length} color="text-accent" /><Stat icon={FiBarChart2} label="Recommendations" value={recommendations.length} color="text-gold" /><Stat icon={FiHeart} label="Favorites" value={favorites.length} /><Stat icon={FiFilm} label="Favorite genre" value={favoriteGenre} color="text-emerald-400" /><Stat icon={FiUser} label="Top engine" value={favoriteType} color="text-violet-400" /></section>
    <section className="grid lg:grid-cols-2 gap-6"><div className="rounded-3xl border border-white/5 bg-surface/60 p-6"><h2 className="font-semibold text-white">Genre distribution</h2><div className="mt-5 h-64">{genreData.length ? <ResponsiveContainer><PieChart><Pie data={genreData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={88} paddingAngle={4}>{genreData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} /></PieChart></ResponsiveContainer> : <EmptyState icon={FiHeart} title="No favorite genres yet" description="Save a few movies to reveal your taste profile." />}</div></div><div className="rounded-3xl border border-white/5 bg-surface/60 p-6"><h2 className="font-semibold text-white">Recommendation activity</h2><div className="mt-5 h-64">{typeData.length ? <ResponsiveContainer><BarChart data={typeData}><XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} /><YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 11 }} /><Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 12 }} /><Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#ef4444" /></BarChart></ResponsiveContainer> : <EmptyState icon={FiBarChart2} title="No recommendation activity" description="Explore an engine to start building this chart." />}</div></div></section>
    <section className="rounded-3xl border border-white/5 bg-surface/60 p-6"><div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-bold text-white">Favorite movies</h2><p className="mt-1 text-sm text-slate-400">Saved on this device.</p></div></div>{favorites.length ? <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{favorites.map((movie) => <div key={movie.movieId} className="flex gap-4 rounded-2xl bg-white/[0.03] p-3"><div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-primary/20"><img src={`https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=150&q=70`} alt="" className="h-full w-full object-cover" /></div><div className="min-w-0 flex-1"><p className="truncate font-semibold text-white">{movie.title}</p><p className="mt-1 truncate text-xs text-slate-400">{movie.genres?.split("|").slice(0, 2).join(", ") || "MovieVerse pick"}</p><div className="mt-3 flex gap-3 text-xs"><Link className="font-semibold text-accent" to={`/movie/${movie.movieId}`}>View details</Link><button onClick={() => removeFavorite(movie)} className="font-semibold text-primary">Remove</button></div></div></div>)}</div> : <div className="mt-6"><EmptyState icon={FiHeart} title="No favorites yet" description="Tap the heart on any movie to build your collection." action={<Link to="/home"><Button size="sm">Discover movies</Button></Link>} /></div>}</section>
    <section className="grid lg:grid-cols-2 gap-6"><History title="Recent searches" icon={FiSearch} items={searches} kind="search" onRemove={remove} onClear={clear} /><History title="Recent recommendations" icon={FiClock} items={recommendations} kind="recommendation" onRemove={remove} onClear={clear} /></section>
  </div>;
}

function History({ title, icon: Icon, items, kind, onRemove, onClear }) { return <section className="rounded-3xl border border-white/5 bg-surface/60 p-6"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-xl font-bold text-white"><Icon className="text-primary" />{title}</h2>{items.length > 0 && <button onClick={() => onClear(kind)} className="text-xs font-semibold text-slate-400 hover:text-primary">Clear all</button>}</div>{items.length ? <div className="mt-4 divide-y divide-white/5">{items.map((item) => <div key={item.label} className="flex items-center gap-3 py-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-200">{item.label}</p><p className="text-xs text-slate-500">{item.type || new Date(item.createdAt).toLocaleDateString()}</p></div><button onClick={() => onRemove(kind, item.label)} className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-primary" aria-label={`Delete ${item.label}`}><FiTrash2 /></button></div>)}</div> : <div className="mt-5"><EmptyState icon={Icon} title={`No ${title.toLowerCase()} yet`} description="Your latest activity will appear here." /></div>}</section>; }
