export default function Input({ label, error, hint, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="text-xs text-txt-secondary mb-1.5 block font-medium">{label}</label>}
      <input className={`input-base ${error ? 'border-danger' : ''}`} {...props} />
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
      {hint && !error && <p className="text-xs text-txt-muted mt-1">{hint}</p>}
    </div>
  );
}