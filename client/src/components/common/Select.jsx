export default function Select({ label, error, options = [], className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="text-xs text-txt-secondary mb-1.5 block font-medium">{label}</label>}
      <select className={`input-base ${error ? 'border-danger' : ''}`} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-danger mt-1">{error}</p>}
    </div>
  );
}