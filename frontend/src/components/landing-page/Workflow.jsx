import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Shield, Activity, Map as MapIcon, Send, Wifi, ShieldAlert, Cpu, Database, ChevronRight } from 'lucide-react';
import Heatmap from './Heatmap';

const steps = [
  {
    title: 'Detect & Analyze',
    desc: 'AI algorithms scan multi-source data for anomalies.',
    icon: Activity,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30'
  },
  {
    title: 'Priority Classification',
    desc: 'Incidents are ranked by severity using predictive models.',
    icon: Cpu,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30'
  },
  {
    title: 'Resource Allocation',
    desc: 'Automated dispatching of nearest available responders.',
    icon: Database,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30'
  },
  {
    title: 'Crisis Mitigation',
    desc: 'Real-time tracking and live command center updates.',
    icon: ShieldAlert,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30'
  }
];

const Workflow = () => {
  return (
    <section id="workflow" className="py-16 bg-[#02050a] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff05_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_30%,transparent_100%)] z-0" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-5xl font-data tracking-widest text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            INTELLIGENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">WORKFLOW</span>
          </motion.h2>
          <motion.p 
            className="text-cyan-500 font-mono text-sm max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            // END-TO-END CRISIS MANAGEMENT PROTOCOL
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 relative">
          
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent -translate-y-1/2 z-0" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                className="relative z-10 flex flex-col items-center w-full lg:w-1/4 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                {/* Node */}
                <div className={`w-20 h-20 rounded-2xl ${step.bg} border ${step.border} backdrop-blur-sm flex items-center justify-center mb-6 relative transition-transform duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]`}>
                  <Icon className={`w-8 h-8 ${step.color}`} />
                  
                  {/* Heatmap/Pulse effect inside the node */}
                  <motion.div 
                    className="absolute inset-0 rounded-2xl border border-white/10"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2 + index, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  {/* Step number badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#050a18] border border-cyan-500/30 flex items-center justify-center font-mono text-xs text-cyan-400 font-bold shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                    0{index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="text-center px-4">
                  <h3 className="text-white font-data tracking-wider text-sm mb-2">{step.title}</h3>
                  <p className="text-cyan-500/60 font-mono text-xs leading-relaxed">{step.desc}</p>
                </div>
                
                {/* Mobile connector */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden my-6">
                    <ChevronRight className="w-6 h-6 text-cyan-500/30 rotate-90" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Heatmap Visualization Section */}
        <motion.div 
          className="mt-24 max-w-5xl mx-auto rounded-xl border border-cyan-500/20 bg-[#050a18]/50 backdrop-blur-md overflow-hidden relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between bg-[#030a10]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="font-data text-xs text-cyan-400 tracking-widest uppercase">Live Heatmap feed</span>
            </div>
            <div className="flex gap-2">
              <div className="px-2 py-0.5 rounded-sm bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-mono text-cyan-300">
                AUTO_SCAN: ACTIVE
              </div>
            </div>
          </div>

          <div className="relative w-full h-[400px] flex flex-col lg:flex-row">
            {/* The Real Data Heatmap Component */}
            <div className="w-full lg:w-3/4 h-full relative">
              <Heatmap />
            </div>

            {/* Live Data Feed Log (Visible on Desktop) */}
            <div className="w-full lg:w-1/4 h-full bg-[#050a18]/40 border-l border-cyan-500/10 p-4 hidden lg:flex flex-col gap-3 font-mono text-[10px]">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                <span className="text-cyan-400 font-data tracking-widest uppercase">Incident_Log</span>
                <span className="text-cyan-500/50 animate-pulse">● LIVE</span>
              </div>
              <div className="flex-1 overflow-hidden flex flex-col gap-3 opacity-80">
                <div className="flex flex-col gap-0.5">
                  <p className="text-cyan-300">[15:42] ID:702 - SECTOR 7</p>
                  <p className="text-cyan-500/50 text-[9px]">TYPE: WATER_LEAKAGE</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-cyan-400">[15:45] ID:941 - DISTRICT 3</p>
                  <p className="text-cyan-500/50 text-[9px]">TYPE: ROAD_OBSTRUCTION</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-cyan-300">[15:48] ID:104 - SECTOR 2</p>
                  <p className="text-cyan-500/50 text-[9px]">TYPE: CRITICAL_EMERGENCY</p>
                </div>
                <div className="flex flex-col gap-0.5 animate-pulse">
                  <p className="text-white"> [SCANNING...] NEW_ENTRY</p>
                </div>
              </div>
              <div className="pt-2 border-t border-cyan-500/20">
                <div className="flex justify-between mb-1">
                  <span className="text-cyan-500/40 uppercase">Buffer</span>
                  <span className="text-cyan-400">92%</span>
                </div>
                <div className="w-full h-1 bg-cyan-900/30 rounded-full overflow-hidden">
                   <motion.div 
                    className="h-full bg-cyan-500"
                    animate={{ width: ['0%', '92%', '85%', '92%'] }}
                    transition={{ duration: 5, repeat: Infinity }}
                   />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Workflow;
