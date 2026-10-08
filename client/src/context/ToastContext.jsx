// import { createContext, useState, useCallback } from 'react';

// export const ToastContext = createContext(null);

// let idSeq = 0;

// export function ToastProvider({ children }) {
//   const [toasts, setToasts] = useState([]);

//   const push = useCallback((message, type = 'info', duration = 3200) => {
//     const id = ++idSeq;
//     setToasts((prev) => [...prev, { id, message, type }]);
//     setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
//   }, []);

//   const toast = {
//     success: (m) => push(m, 'success'),
//     error: (m) => push(m, 'error'),
//     info: (m) => push(m, 'info'),
//     warning: (m) => push(m, 'warning'),
//   };

//   const colors = {
//     success: 'bg-success/15 border-success/30 text-success',
//     error: 'bg-danger/15 border-danger/30 text-danger',
//     warning: 'bg-warning/15 border-warning/30 text-warning',
//     info: 'bg-info/15 border-info/30 text-info',
//   };

//   const icons = { success: '✓', error: '×', warning: '!', info: 'i' };

//   return (
//     <ToastContext.Provider value={toast}>
//       {children}
//       <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
//         {toasts.map((t) => (
//           <div
//             key={t.id}
//             className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-lg text-sm font-medium shadow-card animate-slide-in ${colors[t.type]}`}
//           >
//             <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-[11px] font-bold">
//               {icons[t.type]}
//             </span>
//             {t.message}
//           </div>
//         ))}
//       </div>
//     </ToastContext.Provider>
//   );
// }


import { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext(null);

let idSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++idSeq;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const toast = {
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error'),
    info: (m) => push(m, 'info'),
    warning: (m) => push(m, 'warning'),
  };

  const colors = {
    success: 'bg-success/15 border-success/30 text-success',
    error: 'bg-danger/15 border-danger/30 text-danger',
    warning: 'bg-warning/15 border-warning/30 text-warning',
    info: 'bg-info/15 border-info/30 text-info',
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-lg text-sm font-medium shadow-card animate-slide-in ${colors[t.type]}`}
          >
            <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : '!'}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}