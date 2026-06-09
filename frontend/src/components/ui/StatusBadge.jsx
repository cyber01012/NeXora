const statusConfig = {
  PENDING: { label: 'PENDING', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
  PENDING_ADMIN: { label: 'PENDING', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
  APPROVED: { label: 'APPROVED', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' },
  ASSIGNED: { label: 'ASSIGNED', color: '#818cf8', bg: 'rgba(129,140,248,0.15)' },
  ACCEPTED: { label: 'ACCEPTED', color: '#a78bfa', bg: 'rgba(167,139,250,0.15)' },
  IN_PROGRESS: { label: 'IN PROGRESS', color: '#22d3ee', bg: 'rgba(34,211,238,0.15)' },
  COMPLETED: { label: 'COMPLETED', color: '#4ade80', bg: 'rgba(74,222,128,0.15)' },
  REJECTED: { label: 'REJECTED', color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.PENDING;
  return (
    <span 
      className="inline-flex items-center px-3 py-1 rounded-full font-mono text-[11px] font-medium tracking-wider"
      style={{ backgroundColor: config.bg, color: config.color, border: `1px solid ${config.color}40` }}
    >
      {config.label}
    </span>
  );
}