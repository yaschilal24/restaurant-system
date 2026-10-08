export default function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="text-4xl mb-3 opacity-40">{icon}</div>
      <h3 className="text-lg font-bold text-txt-primary mb-1">{title}</h3>
      {description && <p className="text-sm text-txt-muted max-w-sm mb-5">{description}</p>}
      {action}
    </div>
  );
}