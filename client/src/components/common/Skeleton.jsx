export function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-44 bg-bg-elevated" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-bg-elevated rounded w-3/4" />
        <div className="h-3 bg-bg-elevated rounded w-full" />
        <div className="h-3 bg-bg-elevated rounded w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-bg-elevated rounded w-16" />
          <div className="h-8 bg-bg-elevated rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

export function SkeletonRow({ cols = 5 }) {
  return (
    <div className="grid gap-4 animate-pulse" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-4 bg-bg-elevated rounded" />
      ))}
    </div>
  );
}