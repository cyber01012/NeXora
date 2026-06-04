import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import bgVideo from '../../assets/videos/bg.mp4';
import GradientText from './GradientText';
import { useDisasterMode } from '../../context/DisasterContext';

const TypewriterText = ({ text, delay = 0, speed = 50, resetKey }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let intervalId;
    let idx = 0;
    const timer = setTimeout(() => {
      intervalId = setInterval(() => {
        if (idx < text.length) {
          setDisplayedText(text.substring(0, idx + 1));
          idx++;
        } else {
          clearInterval(intervalId);
        }
      }, speed);
    }, delay);
    return () => { clearTimeout(timer); clearInterval(intervalId); };
  }, [text, delay, speed, resetKey]);
  return <span>{displayedText}</span>;
};

const Hero = ({ onOpenAuth }) => {
  const { isDisasterMode } = useDisasterMode();

  return (
    // ── Static 100vh layout instead of messy scrolling ──
    <section id="hero" className="relative h-screen overflow-hidden bg-[var(--bg-darker)]">

     
      <div className="relative w-full h-full overflow-hidden">

        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            src={bgVideo}
            autoPlay loop muted playsInline
            className="w-full h-full object-cover opacity-60 mix-blend-screen"
          />
          {/* Deep vignette to make text pop */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-darker)]/40 via-transparent to-[var(--bg-darker)]/80 z-10" />
          
          {/* Subtle grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--primary-glow)0a_1px,transparent_1px),linear-gradient(to_bottom,var(--primary-glow)0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_30%,transparent_100%)] z-10 opacity-30" />
          
          {/* Targeted blur for text in video */}
          <div className="absolute top-[40%] bottom-[40%] right-[15%] w-[30%] backdrop-blur-md z-10 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

          {/* Blend into next section */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--bg-light)] to-transparent z-10" />
        </div>

        {/* ── Content layer ── */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">

          {/* Cinematic NEXORA Entrance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="whitespace-nowrap"
          >
            <GradientText
              text="NEXORA"
              className="text-[clamp(10rem,20vw,13rem)] tracking-tight"
            />
          </motion.div>

          {/* Subtitle — types out cleanly below */}
          <motion.div
            className="-mt-13 font-data  text-white tracking-[0.3em] uppercase text-xs md:text-sm text-center drop-shadow-[0_0_10px_rgba(var(--primary-glow-rgb), 0.5)]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            key={isDisasterMode ? 'disaster' : 'normal'}
          >
            <TypewriterText
              text={isDisasterMode ? "! CRITICAL ANOMALY DETECTED. PROTOCOL ACTIVE !" : "DETECT ANOMALIES. DEPLOY RESOURCES. DEFEAT CRISES."}
              delay={1200}
              speed={40}
              resetKey={isDisasterMode}
            />
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="mt-5 flex flex-wrap justify-center gap-4 pointer-events-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <button
              onClick={onOpenAuth}
              className="font-data px-8 py-3 bg-gradient-to-r from-primary-400 to-primary-600 rounded-sm text-white text-sm tracking-widest hover:shadow-[0_0_25px_rgba(var(--primary-glow-rgb), 0.5)] hover:from-primary-300 hover:to-primary-500 transition-all duration-300 pointer-events-auto cursor-pointer"
            >
              GET STARTED
            </button>
            <button
              onClick={() => document.getElementById('dashboards')?.scrollIntoView({ behavior: 'smooth' })}
              className="font-data px-8 py-3 border border-primary-400/60 bg-transparent backdrop-blur-sm rounded-sm text-primary-300 text-sm tracking-widest hover:bg-primary-500/10 hover:border-primary-300 hover:shadow-[0_0_20px_rgba(var(--primary-glow-rgb), 0.2)] transition-all duration-300 pointer-events-auto cursor-pointer"
            >
              PREVIEW
            </button>
          </motion.div>

          {/* Trusted By Professionals */}
          <motion.div
            className="mt-3 flex items-center justify-center gap-3 pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <div className="flex -space-x-2">
              <img className="w-6 h-6 rounded-full border border-primary-500/30 grayscale opacity-80" src="https://i.pravatar.cc/100?img=3" alt="Avatar" />
              <img className="w-6 h-6 rounded-full border border-primary-500/30 grayscale opacity-80" src="https://i.pravatar.cc/100?img=11" alt="Avatar" />
              <img className="w-6 h-6 rounded-full border border-primary-500/30 grayscale opacity-80" src="https://i.pravatar.cc/100?img=33" alt="Avatar" />
              <img className="w-6 h-6 rounded-full border border-primary-500/30 grayscale opacity-80" src="https://i.pravatar.cc/100?img=12" alt="Avatar" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-2.5 h-2.5 text-primary-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <span className="font-mono text-[11px] text-primary-400/60 uppercase tracking-widest mt-0.5">Trusted by professionals</span>
            </div>
          </motion.div>

          {/* ── HUD side panels (Rigid, high-tech styling) ── */}
          <div className="absolute inset-0 hidden xl:block pointer-events-none">
            {/* Left HUD */}
            <motion.div 
              className="absolute bottom-12 left-12 max-w-[280px]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.6, x: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <div className="flex items-center gap-2 mb-4 opacity-70">
                <div className="w-2 h-2 bg-primary-400 shadow-[0_0_10px_var(--primary-glow)]" />
                <h3 className="font-data text-primary-400 text-xs tracking-widest uppercase">
                  SYSTEM_LOGS
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-primary-500/50 to-transparent" />
              </div>
              
              <div className="text-primary-400 font-mono text-[11px] flex flex-col gap-3 border-l border-primary-500/20 pl-3">
                <div className="text-primary-400/80">
                  <TypewriterText 
                    text={isDisasterMode ? "> INITIATING PROTOCOL ALPHA..." : "> INITIATING MODELS..."} 
                    delay={2000} speed={30} resetKey={isDisasterMode} 
                  />
                </div>
                <div className="text-primary-400/80">
                  <TypewriterText 
                    text={isDisasterMode ? "> GLOBAL ALERT: DEPLOYING UNITS" : "> SECURE NETWORK: ACTIVE"} 
                    delay={3000} speed={30} resetKey={isDisasterMode} 
                  />
                </div>
                <div className="text-primary-400 drop-shadow-[0_0_8px_rgba(var(--primary-glow-rgb), 0.6)]">
                  <TypewriterText 
                    text={isDisasterMode ? "! EVACUATION ROUTES CALCULATED ! " : "! DETECTING ANOMALIES...  "} 
                    delay={4500} speed={40} resetKey={isDisasterMode} 
                  />
                </div>
              </div>
            </motion.div>

            {/* Right HUD */}
            <motion.div 
              className="absolute bottom-12 right-12 max-w-[280px] w-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0.6, x: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <div className="flex items-center gap-2 mb-4 opacity-70 flex-row-reverse">
                <div className="w-2 h-2 bg-primary-400 shadow-[0_0_10px_var(--primary-glow)]" />
                <h3 className="font-data text-primary-400 text-xs tracking-widest uppercase">
                  RESOURCES
                </h3>
                <div className="h-px flex-1 bg-gradient-to-l from-primary-500/50 to-transparent" />
              </div>

              <div className="text-primary-400 font-mono text-[11px] w-full text-right flex flex-col gap-3 border-r border-primary-500/20 pr-3">
                <div>
                  <TypewriterText 
                    text={isDisasterMode ? "[RESOURCE ALLOCATION: SURGE]" : "[RESOURCE ALLOCATION: LIVE]"} 
                    delay={2200} speed={20} resetKey={isDisasterMode}
                  />
                  <div className="w-full bg-[var(--color-hud-bg)] border border-primary-500/20 h-1.5 mt-2 relative overflow-hidden">
                    <motion.div
                      key={isDisasterMode ? 'surge' : 'live'}
                      className="absolute top-0 left-0 h-full bg-primary-400/80"
                      initial={{ width: 0 }} animate={{ width: isDisasterMode ? '98%' : '75%' }}
                      transition={{ delay: 2.8, duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <div>
                  <TypewriterText 
                    text={isDisasterMode ? "[RESPONDERS: DISPATCHED]" : "[RESPONDERS: STANDBY]"} 
                    delay={3500} speed={20} resetKey={isDisasterMode}
                  />
                  <div className="w-full bg-[var(--color-hud-bg)] border border-primary-500/20 h-1.5 mt-2 relative overflow-hidden">
                    <motion.div
                      key={isDisasterMode ? 'dispatch' : 'standby'}
                      className="absolute top-0 left-0 h-full bg-primary-400/80"
                      initial={{ width: 0 }} animate={{ width: isDisasterMode ? '100%' : '90%' }}
                      transition={{ delay: 4, duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
