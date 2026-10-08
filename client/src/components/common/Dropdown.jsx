import { useState, useRef, useEffect } from 'react';

export default function Dropdown({ trigger, children, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-2 min-w-[160px] bg-bg-elevated border border-border rounded-xl shadow-card py-1 z-50 animate-fade-in`}>
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-sm transition-colors ${danger ? 'text-danger hover:bg-danger/10' : 'text-txt-secondary hover:text-txt-primary hover:bg-white/5'}`}
    >
      {children}
    </button>
  );
}