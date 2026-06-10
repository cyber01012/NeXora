import { useState } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  "Fire Emergency",
  "Medical Emergency",
  "Road Accident",
  "Flood Relief",
  "Earthquake Rescue",
  "Animal Rescue",
  "Technical Support",
  "Logistics",
  "General Relief"
];

export default function WorkerOnboarding() {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleCategory = (cat) => {
    if (selected.includes(cat)) {
      setSelected(selected.filter(c => c !== cat));
    } else {
      if (selected.length < 5) {
        setSelected([...selected, cat]);
      }
    }
  };

  const handleComplete = () => {
    if (selected.length === 0) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/worker'); // redirect to dashboard
    }, 1500);
  };

  return (
    <div className="flex w-full items-center justify-center p-4 min-h-[80vh] animate-fadeIn">
      <div className="w-full max-w-2xl rounded-xl border border-cyan-500/20 bg-[#0a0a0a]/60 p-8 text-center backdrop-blur-xl shadow-[0_0_40px_rgba(34,211,238,0.05)]">
        
        <h1 className="mb-2 font-title text-2xl tracking-wider text-glow-primary">CATEGORY SELECTION</h1>
        <p className="mb-8 font-mono text-sm text-cyan-400/60">
          Please select your primary areas of expertise (1 to 5 categories).
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map((cat) => {
            const isSelected = selected.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-sm transition-all duration-300 border ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)] scale-105'
                    : 'bg-cyan-950/20 border-cyan-900/50 text-cyan-500/60 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-900/40'
                }`}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />}
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-4">
          <p className="font-mono text-xs text-cyan-500/40">
            {selected.length} / 5 selected
          </p>
          <button
            onClick={handleComplete}
            disabled={selected.length === 0 || loading}
            className={`group flex w-full max-w-sm items-center justify-center gap-2 rounded-lg px-4 py-3 font-mono text-sm transition-all duration-300 ${
              selected.length > 0
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-800 text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-500 hover:to-cyan-700'
                : 'bg-cyan-950/50 text-cyan-700 cursor-not-allowed border border-cyan-900/30'
            }`}
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <span>COMPLETE ONBOARDING</span>
                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
