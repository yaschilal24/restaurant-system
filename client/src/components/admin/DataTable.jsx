import { SkeletonRow } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';

export default function DataTable({ columns, rows, loading, emptyMessage = 'No data' }) {
  if (loading) {
    return (
      <div className="card p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={columns.length} />)}
      </div>
    );
  }

  if (!rows?.length) {
    return <EmptyState title="Nothing here yet" description={emptyMessage} />;
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-elevated">
            <tr className="text-[10px] uppercase tracking-wider text-txt-muted">
              {columns.map((col) => (
                <th key={col.key} className={`py-3 px-4 font-semibold ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id || i} className="border-t border-border/50 hover:bg-white/[0.02] transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`py-3 px-4 ${col.align === 'right' ? 'text-right' : ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}