import React from 'react';

const GradientText = ({ text, className, style }) => {
  return (
    <div style={style} className={`relative inline-flex select-none ${className}`}>
      {/* Main text - static, no movement */}
      <span
        className="font-title relative z-10"
        style={{
          backgroundImage: 'linear-gradient(135deg, #00ffee 0%, #00d4ff 35%, #ffffff 60%, #7ffcff 100%)',
          backgroundSize: '300% 300%',
          animation: 'gradientMove 6s ease infinite',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          filter: 'drop-shadow(0 0 25px rgba(0,240,255,0.55)) drop-shadow(0 0 60px rgba(0,220,255,0.2))',
        }}
      >
        {text}
      </span>

      {/* Visible white glitch overlay slice */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 font-title pointer-events-none text-white z-20"
        style={{
          opacity: 0.8,
          textShadow: '0 0 10px rgba(255,255,255,0.8), 0 0 20px #00ffee',
          animation: 'glitch-overlay 3s infinite linear alternate-reverse',
        }}
      >
        {text}
      </span>

      <style>{`
        @keyframes gradientMove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes glitch-overlay {
          0% { clip-path: inset(10% 0 85% 0); transform: translate(-3px, 2px); }
          10% { clip-path: inset(80% 0 5% 0); transform: translate(3px, -2px); }
          20% { clip-path: inset(30% 0 60% 0); transform: translate(-3px, 0); }
          30% { clip-path: inset(100% 0 0 0); transform: translate(0, 0); } /* fully hidden for the rest */
          100% { clip-path: inset(100% 0 0 0); transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
};

export default GradientText;
