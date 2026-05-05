import React from 'react';
import { motion } from 'framer-motion';

const Heatmap = ({ data = [] }) => {
  // Default dummy data if none provided
  const points = data.length > 0 ? data : [
    { id: 'INC_702', x: 25, y: 30, intensity: 0.8, type: 'CRITICAL' },
    { id: 'INC_941', x: 65, y: 45, intensity: 0.5, type: 'STABLE' },
    { id: 'INC_104', x: 40, y: 70, intensity: 0.9, type: 'URGENT' },
    { id: 'INC_223', x: 80, y: 20, intensity: 0.4, type: 'MONITOR' },
  ];

  return (
    <div className="relative w-full h-full min-h-[300px] bg-[#020610] border border-cyan-500/20 overflow-hidden rounded-sm group">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#00f0ff1a_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff1a_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
      
      {/* Scanning Radar Line */}
      <motion.div 
        className="absolute inset-y-0 w-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent z-10"
        animate={{ left: ['-10%', '110%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Radar Pulse Center */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-cyan-500/5 bg-[radial-gradient(circle,rgba(0,240,255,0.05)_0%,transparent_70%)]"
        animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Incident Points */}
      {points.map((point) => (
        <motion.div
          key={point.id}
          className="absolute z-20 group/point"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: Math.random() * 2 }}
        >
          {/* Pulsing Core */}
          <div className="relative flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_#00f0ff] ${point.type === 'CRITICAL' ? 'bg-cyan-400' : 'bg-cyan-500/60'}`} />
            <motion.div 
              className="absolute w-6 h-6 rounded-full border border-cyan-400/50"
              animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            
            {/* HUD Label - Appears on hover or persistent in crisis */}
            <div className="absolute left-4 top-0 whitespace-nowrap pointer-events-none opacity-0 group-hover/point:opacity-100 transition-opacity">
              <div className="bg-[#020610]/90 border border-cyan-500/40 px-2 py-1 rounded-sm">
                <p className="text-[9px] font-data text-cyan-300 tracking-tighter">ID: {point.id}</p>
                <p className="text-[8px] font-mono text-cyan-500/70">STAT: {point.type}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Viewport Corners */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-cyan-500/40" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-cyan-500/40" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-cyan-500/40" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-cyan-500/40" />
      
      {/* HUD Info Overlay */}
      <div className="absolute bottom-4 left-4 z-30 font-mono text-[9px] text-cyan-400/60 flex flex-col gap-1">
        <p className="">REGION: SECTOR_07</p>
        <p className="">ACTIVE_NODES: {points.length}</p>
        <div className="flex gap-1 items-center">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          <p className="text-cyan-400">LIVE FEED ENCRYPTED</p>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
