import React from 'react';

const testimonials = [
  { init: 'SJ', name: 'Sarah J.', role: 'Citizen', badge: 'Flood Response',
    quote: "The SOS button got rescue teams to our street before we even finished evacuating. I didn't have to fill a single form." },
  { init: 'CR', name: 'Capt. Reynolds', role: 'Emergency Responder', badge: 'Task Assignment',
    quote: "NeXora gives me a full picture — severity, location, people affected — before I even leave the station." },
  { init: 'DV', name: 'Director Vance', role: 'City Administrator', badge: 'Admin Dashboard',
    quote: "The live heatmap and AI suggestions turned our dispatch room into a proper command center. Nothing falls through the cracks." },
  { init: 'LM', name: 'Lt. Marcus', role: 'Responder', badge: 'Navigation',
    quote: "Optimal routing through flooded roads saved us critical minutes. The system knew alternate paths we didn't." },
  { init: 'AK', name: 'Amara K.', role: 'NGO Coordinator', badge: 'Resource Management',
    quote: "Managing food and medicine dispatch across six zones used to take hours. NeXora gets it done in minutes." },
  { init: 'RH', name: 'R. Hassan', role: 'Volunteer', badge: 'Mission Coordination',
    quote: "I can see nearby tasks, join a mission, and sync with the response team — all from one dashboard." },
  { init: 'TN', name: 'Tanya N.', role: 'Citizen', badge: 'Civic Reporting',
    quote: "I reported a broken water main and could track the repair status in real time. Didn't need a single phone call." },
  { init: 'PW', name: 'P. Walsh', role: 'Admin', badge: 'AI Prioritization',
    quote: "The AI flagged a cluster of SOS reports as a likely gas leak before any of us connected the dots. That's the value." },
];

function TestimonialCard({ init, name, role, badge, quote }) {
  return (
    <div
      className="group relative flex-shrink-0 w-[340px] rounded-2xl p-[30px] overflow-hidden border border-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-white/90"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.30) 60%, rgba(255,255,255,0.15) 100%)',
        boxShadow: '0 8px 32px rgba(6,182,212,0.15), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <div className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-white to-transparent" />

      <div className="flex items-center gap-3.5 mb-[18px]">
        <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 border border-[#0a0f1d]/15 bg-[#0a0f1d]/10 font-mono text-[12px] font-bold text-[#0a0f1d] tracking-wide">
          {init}
        </div>
        <div>
          <p className="font-mono text-[13px] font-bold text-[#0a0f1d] tracking-wide">{name}</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#0a0f1d]/50 mt-0.5">{role}</p>
        </div>
      </div>

      <span className="inline-block font-mono text-[9px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border border-[#0a0f1d]/20 text-[#0a0f1d] bg-[#0a0f1d]/8 mb-3.5">
        {badge}
      </span>

      <p className="font-mono text-[13px] text-[#0a0f1d]/75 leading-[1.8]">"{quote}"</p>
    </div>
  );
}

function MarqueeRow({ items, reverse = false, duration = '42s' }) {
  const doubled = [...items, ...items];
  return (
    <div
      className="flex gap-5 w-max hover:[animation-play-state:paused]"
      style={{
        animation: `marquee ${duration} linear infinite`,
        animationDirection: reverse ? 'reverse' : 'normal',
      }}
    >
      {doubled.map((t, i) => (
        <TestimonialCard key={i} {...t} />
      ))}
    </div>
  );
}

export function TestimonialsMarquee() {
  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4);

  return (
    <section className="relative overflow-hidden bg-cyan-400 py-[72px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-5%,rgba(255,255,255,0.2),transparent)]" />

      <div className="relative z-10 text-center mb-[52px] px-6">
        <div className="inline-flex items-center gap-2 mb-3.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#0a0f1d]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#0a0f1d] opacity-60">
            Field Reports
          </span>
        </div>
        <h2 className="font-mono text-4xl uppercase tracking-widest text-[#0a0f1d] font-normal">
          Voices from the <span className="font-extrabold">Network</span>
        </h2>
        <p className="mt-2.5 font-mono text-sm text-[#0a0f1d]/55 max-w-md mx-auto leading-relaxed">
          Real feedback from citizens, responders, volunteers and administrators using NeXora every day.
        </p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-cyan-400 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-cyan-400 to-transparent" />

        <div className="flex flex-col gap-5 overflow-hidden">
          <MarqueeRow items={row1} duration="42s" />
          <MarqueeRow items={row2} reverse duration="50s" />
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

export default TestimonialsMarquee;