export default function KitchenHeader({ activeCount, avgTime = '12:45', itemCount = 0 }) {
  return (
    <header className="px-6 py-5 border-b border-border">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-success font-semibold mb-1">
        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        System Live • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-txt-primary tracking-tight">
          Kitchen Ops<span className="text-primary">.</span>
        </h1>
        <div className="flex gap-6">
          <div><p className="text-[10px] uppercase tracking-wider text-txt-muted">Active</p><p className="text-xl font-bold text-txt-primary">{activeCount}</p></div>
          <div><p className="text-[10px] uppercase tracking-wider text-txt-muted">Avg Time</p><p className="text-xl font-bold text-txt-primary">{avgTime}</p></div>
          <div><p className="text-[10px] uppercase tracking-wider text-txt-muted">Items</p><p className="text-xl font-bold text-primary">{itemCount}</p></div>
        </div>
      </div>
    </header>
  );
}