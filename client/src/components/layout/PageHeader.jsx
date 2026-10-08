export default function PageHeader({ kicker, title, description, actions }) {
  return (
    <div className="mb-8">
      {kicker && (
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-primary font-semibold mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {kicker}
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-txt-primary tracking-tight">
            {title}
          </h1>
          {description && <p className="text-sm text-txt-secondary mt-2">{description}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  );
}