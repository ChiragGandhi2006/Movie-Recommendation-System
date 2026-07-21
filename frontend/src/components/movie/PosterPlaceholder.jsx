import { FiFilm } from "react-icons/fi";

// Netflix-style deterministic gradient poster, generated from the movie title.
// Used because the current backend contract has no poster/image field.
const GRADIENTS = [
  ["#EF4444", "#020617"],
  ["#3B82F6", "#020617"],
  ["#FACC15", "#1E293B"],
  ["#EF4444", "#3B82F6"],
  ["#7C3AED", "#020617"],
  ["#0EA5E9", "#020617"],
  ["#F97316", "#1E293B"],
];

const COVER_IMAGES = [
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=700&q=85",
];

function hashTitle(title = "") {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function stripYear(title = "") {
  return title.replace(/\s*\(\d{4}\)\s*$/, "");
}

export function extractYear(title = "") {
  const match = title.match(/\((\d{4})\)\s*$/);
  return match ? match[1] : null;
}

export default function PosterPlaceholder({ title = "", className = "" }) {
  const clean = stripYear(title);
  const hash = hashTitle(clean || title);
  const [from, to] = GRADIENTS[hash % GRADIENTS.length];
  const coverImage = COVER_IMAGES[hash % COVER_IMAGES.length];
  const initials = clean
    .split(" ")
    .filter((w) => /[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundImage: `linear-gradient(160deg, ${from}33, ${to})`,
      }}
    >
      <img
        src={coverImage}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-85"
        onError={(event) => { event.currentTarget.style.display = "none"; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-black/20" />
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,white,transparent_45%)]" />
      <FiFilm className="absolute -bottom-4 -right-4 text-8xl text-white/5" />
      <span className="font-display text-4xl md:text-5xl tracking-wider text-white/90 drop-shadow-lg">
        {initials || <FiFilm />}
      </span>
    </div>
  );
}
