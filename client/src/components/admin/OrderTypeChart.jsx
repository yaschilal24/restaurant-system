import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#FF1744', '#00C896', '#F5A623'];

export default function OrderTypeChart({ data = [] }) {
  if (!data.length) return <div className="h-64 flex items-center justify-center text-txt-muted text-sm">No data</div>;
  const chartData = data.map((d) => ({ name: d.order_type?.replace('_', ' '), value: Number(d.count) }));
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: '#1B1B20', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
          <Legend wrapperStyle={{ color: '#A7A7AF', fontSize: '11px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}