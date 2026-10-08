export default function PaymentMethod({ value, onChange }) {
  const CHAPA_ENABLED = true; 
  const methods = [
    { key: 'cash', label: 'Cash', emoji: '💵', desc: 'Pay on delivery/pickup' },
    { key: 'chapa', label: 'Chapa', emoji: '💳', desc: 'Pay online (test mode)' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {methods.map((m) => (
        <button
          key={m.key}
          type="button"
          onClick={() => onChange(m.key)}
          className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all text-left
            ${value === m.key ? 'border-primary bg-primary/10' : 'border-border bg-bg-elevated hover:border-primary/30'}`}
        >
          <span className="text-2xl">{m.emoji}</span>
          <div>
            <p className="text-sm font-semibold text-txt-primary">{m.label}</p>
            <p className="text-[11px] text-txt-muted mt-0.5">{m.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
}