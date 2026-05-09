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
      className="relative flex-shrink-0 w-[340px] rounded-2xl p-[30px] overflow-hidden border border-primary-400/20 transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/45"
      style={{
        background: 'linear-gradient(160deg, #0e1a2b 0%, #0c2233 50%, #0a1e2e 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(34,211,238,0.25), inset 0 -1px 0 rgba(0,0,0,0.2)',
      }}
    >
      {/* Cyan sheen */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-primary-400/[0.07] to-transparent" />
      {/* Cyan edge highlight */}
      <div className="absolute top-0 left-[5%] right-[5%] h-px bg-gradient-to-r from-transparent via-primary-400/60 to-transparent" />

      <div className="relative z-10 flex items-center gap-3.5 mb-[18px]">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 border border-primary-400/35 font-mono text-[12px] font-bold text-primary-400 tracking-wide"
          style={{ background: 'rgba(34,211,238,0.12)', boxShadow: 'inset 0 1px 0 rgba(34,211,238,0.3)' }}
        >
          {init}
        </div>
        <div>
          <p className="font-mono text-[13px] font-bold text-primary-400 tracking-wide">{name}</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-primary-400/45 mt-0.5">{role}</p>
        </div>
      </div>

      <span className="relative z-10 inline-block font-mono text-[9px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border border-primary-400/25 text-primary-400 bg-primary-400/[0.08] mb-3.5">
        {badge}
      </span>

      <p className="relative z-10 font-mono text-[13px] text-primary-400/70 leading-[1.8]">"{quote}"</p>
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
    <section
    id="testimonials"
     className="relative overflow-hidden bg-primary-400 transition-colors duration-1000 py-[72px]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-5%,rgba(255,255,255,0.18),transparent)]" />

      {/* Header — matches original font-data style */}
      <div className="relative z-10 text-center mb-[52px] px-6">
  <div className="inline-flex items-center gap-2 mb-3.5 opacity-70">
    <div className="w-2 h-2 bg-slate-900" />
    <span style={{ fontFamily: "'Orbitron', monospace" }} className="text-[10px] tracking-[0.25em] uppercase text-slate-900">
      Field Reports
    </span>
    <div className="w-12 h-px bg-gradient-to-r from-slate-900/50 to-transparent" />
  </div>

  <h2 style={{ fontFamily: "'Orbitron', monospace" }} className="text-[clamp(24px,3.5vw,46px)] tracking-[0.1em] text-slate-900 text-lg uppercase font-normal">
    System <span className="font-black">Validation</span>
  </h2>
</div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-primary-400 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-primary-400 to-transparent" />

        <div className="flex flex-col gap-5 overflow-hidden">
          <MarqueeRow items={row1} duration="42s" />
          <MarqueeRow items={row2} reverse duration="50s" />
        </div>
      </div>

     
    </section>
  );
}

export default TestimonialsMarquee;
