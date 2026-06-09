export default function ProgressSteps({ steps, currentStep }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((label, idx) => (
        <div key={label} className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
              idx + 1 <= currentStep 
                ? 'bg-[var(--glow)] text-[var(--bg-dark)] shadow-[0_0_10px_var(--glow)]' 
                : 'border border-[var(--border)] text-[var(--text-muted)]'
            }`}>
              {idx + 1 <= currentStep ? '✓' : idx + 1}
            </div>
            <span className={`text-[10px] font-mono tracking-wider hidden sm:inline ${
              idx + 1 <= currentStep ? 'text-glow-primary' : 'text-[var(--text-muted)]'
            }`}>
              {label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`flex-1 h-px transition-all duration-500 ${
              idx + 1 < currentStep ? 'bg-[var(--glow)] shadow-[0_0_4px_var(--glow)]' : 'bg-[var(--border)]'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}