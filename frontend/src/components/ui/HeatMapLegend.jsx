export default function HeatmapLegend({ disasterMode = false }) {
  const legend = [
    { label: 'CRITICAL', color: disasterMode ? '#ff2a2a' : '#ef4444', dot: '🔴' },
    { label: 'HIGH', color: '#f97316', dot: '🟠' },
    { label: 'MEDIUM', color: '#fbbf24', dot: '🟡' },
    { label: 'LOW', color: '#4ade80', dot: '🟢' },
  ];

  return (
    <div className="flex flex-wrap gap-4 mt-3 pt-2 border-t border-[var(--border)]">
      {legend.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="text-sm">{item.dot}</span>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}