export type AppView = "landing" | "admin" | "ngo" | "responder";

type DemoNavigationProps = {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
};

const navItems: { view: AppView; label: string }[] = [
  { view: "landing", label: "Landing / Auth" },
  { view: "admin", label: "Admin Portal" },
  { view: "ngo", label: "NGO Portal" },
  { view: "responder", label: "Responder Portal" },
];

export function DemoNavigation({ currentView, onNavigate }: DemoNavigationProps) {
  return (
    <div className="fixed bottom-4 left-4 z-[100]">
      <div className="rounded-lg border border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.8)] p-4 shadow-lg backdrop-blur-sm">
        <p className="mb-3 font-['Inter:Medium',sans-serif] text-[14px] font-medium text-[rgba(255,255,255,0.6)]">
          Demo Navigation
        </p>
        <div className="flex flex-col gap-2">
          {navItems.map(({ view, label }) => (
            <button
              key={view}
              type="button"
              onClick={() => onNavigate(view)}
              className={`rounded-lg px-4 py-2 font-['Inter:Medium',sans-serif] text-[14px] font-medium transition-colors ${
                currentView === view
                  ? "bg-gradient-to-r from-[#00b8db] to-[#2b7fff] text-white"
                  : "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.8)] hover:bg-[rgba(255,255,255,0.1)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
