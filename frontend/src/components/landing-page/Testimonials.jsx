import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Ambulance } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah J.',
    role: 'Citizen',
    icon: User,
    color: 'text-cyan-400',
    border: 'border-cyan-500/30',
    quote: "During the flash floods, NeXora's live heatmap guided my family to safety. The SOS feature dispatched rescue teams in under 10 minutes."
  },
  {
    id: 2,
    name: 'Capt. Reynolds',
    role: 'Emergency Responder',
    icon: Ambulance,
    color: 'text-red-400',
    border: 'border-red-500/30',
    quote: "The AI-driven resource allocation means my team no longer wastes time on manual routing. We get to the high-priority zones faster than ever."
  },
  {
    id: 3,
    name: 'Director Vance',
    role: 'City Admin',
    icon: Shield,
    color: 'text-purple-400',
    border: 'border-purple-500/30',
    quote: "NeXora transformed our chaotic dispatch system into a synchronized, intelligent command center. Transparency and efficiency have never been higher."
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-cyan-400 relative overflow-hidden border-t border-cyan-300/30">
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <motion.div 
            className="flex items-center gap-2 mb-4 opacity-70"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 0.7, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-2 h-2 bg-slate-900 shadow-[0_0_10px_rgba(0,0,0,0.3)]" />
            <h3 className="font-data text-slate-900 text-xs tracking-widest uppercase">
              FIELD REPORTS
            </h3>
            <div className="w-12 h-px bg-gradient-to-r from-slate-900/50 to-transparent" />
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-data tracking-widest text-slate-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            SYSTEM <span className="font-bold">VALIDATION</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                className="bg-white/30 backdrop-blur-sm border border-slate-900/20 p-8 rounded-xl relative group hover:border-slate-900/50 hover:bg-white/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-slate-900/50 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-slate-900/50 rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-full border border-slate-900/30 flex items-center justify-center bg-white/40`}>
                    <Icon className={`w-5 h-5 text-slate-900`} />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-data text-sm tracking-wider">{item.name}</h4>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-slate-700">{item.role}</p>
                  </div>
                </div>
                
                <p className="text-[#0a0f1d] font-mono text-sm leading-relaxed relative z-10 opacity-80">
                  "{item.quote}"
                </p>
                
                {/* Subtle background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
