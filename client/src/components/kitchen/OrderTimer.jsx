import { useState, useEffect } from 'react';
import { formatElapsed } from '../../utils/formatDate';

export default function OrderTimer({ startedAt, className = '' }) {
  const [elapsed, setElapsed] = useState(formatElapsed(startedAt));
  useEffect(() => {
    const id = setInterval(() => setElapsed(formatElapsed(startedAt)), 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  return <span className={className}>{elapsed}</span>;
}