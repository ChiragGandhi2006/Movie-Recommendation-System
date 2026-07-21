import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiFilm, FiHeart } from "react-icons/fi";
import { savePreferences } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

const GENRES = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"];

export default function Preferences() {
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { refreshProfile } = useAuth();
  const navigate = useNavigate();

  const toggleGenre = (genre) => {
    setError("");
    setSelected((current) => current.includes(genre) ? current.filter((item) => item !== genre) : [...current, genre]);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (selected.length < 3) {
      setError("Choose at least 3 genres so we can make better picks.");
      return;
    }
    setSaving(true);
    try {
      await savePreferences(selected);
      await refreshProfile();
      navigate("/profile", { replace: true });
    } catch (err) {
      const detail = err.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail.map((item) => item.msg).filter(Boolean).join(" ")
        : detail;
      setError(message || "We could not save your preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-5 py-16">
      <form onSubmit={submit} className="w-full max-w-3xl rounded-3xl glass p-7 md:p-10 shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3 text-primary"><span className="h-11 w-11 rounded-xl bg-primary/15 flex items-center justify-center text-xl"><FiFilm /></span><span className="text-xs font-bold uppercase tracking-[0.2em]">Set up your feed</span></div>
        <h1 className="mt-7 text-3xl md:text-4xl font-bold text-white">What kinds of movies do you love?</h1>
        <p className="mt-3 text-slate-400">Pick at least three genres. Your first recommendations will be matched to these choices.</p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {GENRES.map((genre) => {
            const active = selected.includes(genre);
            return <button key={genre} type="button" onClick={() => toggleGenre(genre)} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left font-medium transition ${active ? "border-primary bg-primary/15 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30"}`}>{genre}{active && <FiCheck className="text-primary" />}</button>;
          })}
        </div>
        {error && <p className="mt-5 text-sm text-red-400">{error}</p>}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><p className="flex items-center gap-2 text-sm text-slate-400"><FiHeart className="text-primary" /> {selected.length} genre{selected.length === 1 ? "" : "s"} selected</p><Button type="submit" loading={saving}>{saving ? "Saving your taste..." : "Show my recommendations"}</Button></div>
      </form>
    </div>
  );
}
