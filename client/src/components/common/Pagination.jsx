export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-1.5 rounded-lg bg-bg-elevated border border-border text-xs text-txt-secondary disabled:opacity-40"
      >
        ← Prev
      </button>
      <span className="text-xs text-txt-muted px-3">
        Page <span className="text-txt-primary font-semibold">{page}</span> of {totalPages}
      </span>
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-3 py-1.5 rounded-lg bg-bg-elevated border border-border text-xs text-txt-secondary disabled:opacity-40"
      >
        Next →
      </button>
    </div>
  );
}