import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

export default function RevenueChart({ data = [] }) {
  if (!data.length) {
    return <div className="h-64 flex items-center justify-center text-txt-muted text-sm">No revenue data available.</div>;
  }
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6F7078', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.07)' }}
            tickLine={false}
            tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
          />
          <YAxis
            tick={{ fill: '#6F7078', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{ background: '#1B1B20', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
            formatter={(v) => [formatCurrency(v), 'Revenue']}
          />
          <Bar dataKey="revenue" fill="#FF1744" radius={[6, 6, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}