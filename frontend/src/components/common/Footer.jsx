// src/components/Footer.jsx

const Footer = () => {
  return (
    <footer className="border-t border-cyan-500/30 pt-12 pb-6 relative z-10 bg-[#030a10]">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Left Section */}
          <div>
            <span className="font-title text-2xl text-glow-cyan uppercase tracking-widest block mb-4">
              NEXORA
            </span>
            <p className="text-cyan-500/60 font-mono text-xs max-w-sm leading-relaxed">
              Intelligent Disaster and Civic Management System. Detecting anomalies, deploying resources, defeating crises.
            </p>
          </div>

          {/* Team Section */}
          <div className="md:col-span-2 flex flex-col md:items-end">
            <h4 className="font-data text-cyan-400 text-xs tracking-widest uppercase mb-4">
              Core Engineering Team
            </h4>

            <div className="flex flex-wrap gap-4 md:justify-end font-mono text-xs text-cyan-500/60">
              <span className="hover:text-cyan-300 transition-colors cursor-default">Suhaima Khan</span>
              <span className="text-cyan-500/30">/</span>
              <span className="hover:text-cyan-300 transition-colors cursor-default">Hafsa Yousuf</span>
              <span className="text-cyan-500/30">/</span>
              <span className="hover:text-cyan-300 transition-colors cursor-default">Hafsa Ather Khan</span>
              <span className="text-cyan-500/30">/</span>
              <span className="hover:text-cyan-300 transition-colors cursor-default">Mariam Yasir</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-cyan-500/20 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <p className="text-cyan-500/40 text-[10px] tracking-widest uppercase font-mono">
            [SYS_LOG] © {new Date().getFullYear()} NEXORA COMMAND. SECURE CONNECTION.
          </p>

          <div className="flex gap-4">
            <a
              href="#"
              className="text-cyan-500/40 hover:text-cyan-400 text-[10px] uppercase tracking-widest transition-colors"
            >
              [PROTOCOL_ALPHA]
            </a>
            <a
              href="#"
              className="text-cyan-500/40 hover:text-cyan-400 text-[10px] uppercase tracking-widest transition-colors"
            >
              [TERMS]
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;