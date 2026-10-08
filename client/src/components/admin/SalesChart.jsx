import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesChart({ data = [] }) {
  if (!data.length) return <div className="h-64 flex items-center justify-center text-txt-muted text-sm">No data</div>;
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="date" tick={{ fill: '#6F7078', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.07)' }} tickLine={false} />
          <YAxis tick={{ fill: '#6F7078', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: '#1B1B20', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
          <Line type="monotone" dataKey="orders" stroke="#FF1744" strokeWidth={2} dot={{ fill: '#FF1744', r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}