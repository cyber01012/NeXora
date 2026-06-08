export default function HUDCard({ title, children, className = '', onClick }) {
  return (
    <div 
      className={`bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-[var(--border-bright)] hover:shadow-[0_0_20px_rgba(var(--glow-rgb),0.1)] ${className}`}
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--glow)] to-transparent opacity-40" />
      {title && (
        <h3 className="font-title text-glow-primary text-sm tracking-wider mb-4 uppercase">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}