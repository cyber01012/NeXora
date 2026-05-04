import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Map, Zap, Users, ShieldCheck, ActivitySquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <Map className="w-8 h-8 text-cyan-400" />,
    title: "Live Heatmaps",
    desc: "Visualize incidents and track resources in real-time across dynamic, AI-powered city maps."
  },
  {
    icon: <Zap className="w-8 h-8 text-cyan-400" />,
    title: "Instant SOS",
    desc: "One-tap emergency alerts trigger automated dispatch protocols immediately."
  },
  {
    icon: <Users className="w-8 h-8 text-cyan-400" />,
    title: "Smart Coordination",
    desc: "Connect citizens, NGOs, and responders seamlessly through dedicated operational dashboards."
  },
  {
    icon: <ActivitySquare className="w-8 h-8 text-cyan-400" />,
    title: "AI Triage",
    desc: "Incoming reports are auto-prioritized by our intelligent risk-assessment engine."
  },
];

const Features = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered reveal for cards
      gsap.fromTo(cardsRef.current, 
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          }
        }
      );

      // Title reveal
      gsap.fromTo(".feature-title", 
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1, scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }}
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-16 relative z-10 bg-[#0a0f1d]">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="mb-12 mt-4">
          <h2 className="feature-title text-4xl md:text-5xl font-data text-white mb-6 uppercase tracking-wider">
            Intelligent by <span className="text-glow-cyan">Design.</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl font-mono">
            // EVERY MODULE IS ENGINEERED TO REDUCE RESPONSE TIMES AND MAXIMIZE EFFICIENCY DURING CRITICAL EVENTS.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Main large card */}
          <div 
            ref={el => cardsRef.current[0] = el}
            className="lg:col-span-2 hud-glass rounded-sm p-10 flex flex-col justify-between border-hud group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-3xl font-data text-cyan-400 text-glow-cyan mb-4 uppercase tracking-widest">Command Center</h3>
              <p className="text-white/70 text-base max-w-md font-mono">
                &gt; A unified interface for administrators to monitor everything. Watch incoming reports, active responder units, and resource allocation on one powerful screen.
              </p>
            </div>
          </div>

          {/* Smaller feature cards */}
          {features.map((feature, idx) => (
            <div 
              key={idx}
              ref={el => cardsRef.current[idx + 1] = el}
              className="hud-glass rounded-sm p-8 border-hud flex flex-col group"
            >
              <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                {feature.icon}
              </div>
              <h4 className="text-xl font-data text-cyan-400 mb-3 uppercase tracking-wider">{feature.title}</h4>
              <p className="text-white/60 font-mono text-sm">{feature.desc}</p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default Features;
