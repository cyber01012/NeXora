import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Radio, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

/* ─── Animated scan-line canvas ─────────────────────────────── */
const ScanCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let y = 0;
    let raf;
    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const grad = ctx.createLinearGradient(0, y - 60, 0, y + 60);
      grad.addColorStop(0, 'rgba(0,255,208,0)');
      grad.addColorStop(0.5, 'rgba(0,255,208,0.07)');
      grad.addColorStop(1, 'rgba(0,255,208,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, y - 60, width, 120);
      y = (y + 1.2) % height;
      raf = requestAnimationFrame(draw);
    };
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

/* ─── Stat chip ──────────────────────────────────────────────── */
const Stat = ({ value, label }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="font-data text-2xl md:text-3xl text-white tracking-tight drop-shadow-[0_0_12px_rgba(var(--primary-glow-rgb),0.7)]">
      {value}
    </span>
    <span className="font-mono text-[10px] text-primary-400/60 tracking-widest uppercase">{label}</span>
  </div>
);

/* ─── Main component ─────────────────────────────────────────── */
const CTA = () => {
  return (
    <section
      id="cta"
      className="py-20 px-4 md:px-6 bg-[var(--bg-dark)] relative overflow-hidden"
    >
      {/* Ambient glow behind the card */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[400px] bg-primary-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">

        {/* ── Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl overflow-hidden border border-primary-500/30 bg-[var(--bg-darker)] shadow-[0_0_60px_-10px_rgba(var(--primary-glow-rgb),0.25)]"
        >
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 z-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(var(--primary-glow-rgb),0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(var(--primary-glow-rgb),0.06) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Scan-line animation */}
          <ScanCanvas />

          {/* Corner accents */}
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
            <span
              key={i}
              className={`absolute ${pos} w-6 h-6 border-primary-400/50 z-10 pointer-events-none ${
                i === 0 ? 'border-t-2 border-l-2' :
                i === 1 ? 'border-t-2 border-r-2' :
                i === 2 ? 'border-b-2 border-l-2' :
                          'border-b-2 border-r-2'
              }`}
            />
          ))}

          {/* Inner glow stripe across top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/60 to-transparent z-10" />

          {/* ── Content ── */}
          <div className="relative z-10 p-10 md:p-16 flex flex-col items-center text-center gap-10">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-2 px-4 py-1.5 border border-primary-500/30 bg-primary-500/5 rounded-full"
            >
              <Radio className="w-3.5 h-3.5 text-primary-400 animate-pulse" />
              <span className="font-data text-primary-400 text-[10px] tracking-[0.3em] uppercase">
                NEXORA COMMAND — LIVE SYSTEM
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              <h2 className="font-data text-4xl md:text-5xl tracking-widest text-white leading-tight">
                READY TO DEPLOY{' '}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-primary-400 to-blue-400 drop-shadow-none">
                  YOUR COMMAND?
                </span>
              </h2>
              <p className="mt-5 font-mono text-sm md:text-base text-primary-400/60 max-w-2xl mx-auto leading-relaxed tracking-wide">
                Join cities, NGOs, volunteers, and emergency services already running on NeXora's AI-driven
                disaster management infrastructure — detect, respond, and recover faster.
              </p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="flex items-center gap-10 md:gap-16 border-y border-primary-500/20 py-6 w-full justify-center"
            >
              <Stat value="99.9%" label="Uptime" />
              <div className="w-px h-8 bg-primary-500/20" />
              <Stat value="< 30s" label="Alert Dispatch" />
              <div className="w-px h-8 bg-primary-500/20" />
              <Stat value="150+" label="Agencies Active" />
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              {/* Primary button */}
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 32px rgba(var(--primary-glow-rgb), 0.45)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-400 to-primary-600 text-white font-data text-sm tracking-widest uppercase rounded-sm shadow-[0_0_20px_rgba(var(--primary-glow-rgb),0.3)] hover:from-primary-300 hover:to-primary-500 transition-all duration-300 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                START NOW
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </motion.button>

              {/* Secondary ghost button */}
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-8 py-4 border border-primary-500/40 bg-transparent text-primary-300 font-data text-sm tracking-widest uppercase rounded-sm hover:bg-primary-500/10 hover:border-primary-400 hover:shadow-[0_0_18px_rgba(var(--primary-glow-rgb),0.15)] transition-all duration-300 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                VIEW CAPABILITIES
              </motion.button>
            </motion.div>

            {/* Fine print */}
            <p className="font-mono text-[10px] text-primary-500/40 tracking-widest uppercase">
              [ SYS ] FREE ACCESS · SECURE CONNECTION · NO CARD REQUIRED
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default CTA;
