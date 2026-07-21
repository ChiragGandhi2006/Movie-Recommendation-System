export function Spinner({ size = 40, className = "" }) {
  return (
    <div
      className={`rounded-full border-4 border-white/10 border-t-primary animate-spin ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-card/60 border border-white/5">
      <div className="aspect-[2/3] shimmer-bg animate-shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 w-4/5 rounded shimmer-bg animate-shimmer" />
        <div className="h-3 w-1/2 rounded shimmer-bg animate-shimmer" />
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function FullPageLoader({ label = "Loading MovieVerse AI…" }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
      <Spinner size={48} />
      <p className="font-mono text-sm tracking-wide">{label}</p>
    </div>
  );
}
