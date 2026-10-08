import { formatTime } from '../../utils/formatDate';

const STEPS = [
  { key: 'pending', label: 'Order Placed', desc: 'Order received by the system' },
  { key: 'confirmed', label: 'Kitchen Confirmed', desc: 'Awaiting staff review' },
  { key: 'preparing', label: 'Preparing', desc: 'Chef is working their magic' },
  { key: 'ready', label: 'Ready to Serve', desc: 'Heading to your table' },
  { key: 'completed', label: 'Completed', desc: 'Enjoy your meal!' },
];

const ORDER = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];

export default function OrderStepper({ status, createdAt }) {
  const idx = ORDER.indexOf(status);
  const cancelled = status === 'cancelled';
  const isCompleted = status === 'completed';
  

  return (
    <div>
      {STEPS.map((step, i) => {
        const done = !cancelled && (i < idx || (isCompleted && i <= idx));
        const active = !cancelled && i === idx && !isCompleted;
        return (
          <div key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500
                ${done ? 'bg-success/20 border-success text-success'
                : active ? 'bg-primary/20 border-primary text-primary animate-pulse'
                : 'bg-bg-elevated border-border text-txt-disabled'}`}>
                {done ? '✓' : active ? '●' : ''}
              </div>
              {i < STEPS.length - 1 && <div className={`w-0.5 h-14 transition-colors ${done ? 'bg-success/40' : 'bg-border'}`} />}
            </div>
            <div className="pt-1.5 pb-6">
              <h4 className={`text-sm font-semibold ${active ? 'text-primary' : done ? 'text-success' : 'text-txt-muted'}`}>{step.label}</h4>
              <p className="text-xs text-txt-muted mt-0.5">
                {i === 0 && createdAt ? formatTime(createdAt) : step.desc}
              </p>
            </div>
          </div>
        );
      })}
      {cancelled && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm mt-4">
          ✕ This order was cancelled
        </div>
      )}
    </div>
  );
}