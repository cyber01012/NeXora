import { useState } from 'react';

const faqData = [
  {
    category: 'EMERGENCY DISPATCH & SOS',
    items: [
      {
        q: 'How do I submit an emergency SOS?',
        a: 'Navigate to the CREATE SOS page, fill out the caller details (name, phone number, and location), select the incident nature, details, and priority. Click the Submit SOS button to immediately record the alert and broadcast it to responder channels.'
      },
      {
        q: 'What is the priority level system?',
        a: 'Priority levels range from LOW to HIGH/CRITICAL. Set priority according to the potential risk to life and property. Alerts marked as HIGH immediately display on responder and AO tracking systems.'
      },
      {
        q: 'How can I view all SOS reports?',
        a: 'Go to the SOS REPORTS tab. It displays a real-time table of all SOS alerts registered, including their details, priority, and who completed/handled them.'
      }
    ]
  },
  {
    category: 'SYSTEM INTEGRATIONS',
    items: [
      {
        q: 'What does Disaster Mode do?',
        a: 'Disaster Mode triggers a system-wide emergency visual alert (red mode) and shifts the portal focus entirely to emergency SOS management. You can toggle this mode from the sidebar toggle button.'
      },
      {
        q: 'How are SOS reports resolved?',
        a: 'Once an SOS is forwarded, emergency responders or assigned volunteer workers will accept the task. When they complete their operations, the status is marked as COMPLETED, and the resolver username is updated.'
      }
    ]
  }
];

export default function HelpDeskFAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (categoryIdx, itemIdx) => {
    const key = `${categoryIdx}-${itemIdx}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* HEADER */}
      <div>
        <h1 className="font-title text-glow-primary text-2xl tracking-wider text-cyan-300 drop-shadow-[0_0_12px_#00f0ff]">HELPDESK FAQ</h1>
        <p className="font-mono text-xs text-cyan-500/60 mt-1">[ EMERGENCY OPERATOR FREQUENTLY ASKED QUESTIONS ]</p>
      </div>

      {/* FAQ SECTIONS */}
      {faqData.map((section, catIdx) => (
        <div key={section.category} className="bg-[#071018] border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.05)]">
          {/* Category Header */}
          <div className="px-5 py-4 border-b border-cyan-500/10 bg-gradient-to-r from-cyan-900/15 to-transparent">
            <h2 className="text-cyan-300 font-title text-sm tracking-wider flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 6px #06b6d4' }} />
              {section.category}
            </h2>
          </div>

          {/* Items */}
          <div className="divide-y divide-cyan-500/5">
            {section.items.map((item, itemIdx) => {
              const key = `${catIdx}-${itemIdx}`;
              const isOpen = openItems[key];

              return (
                <div key={itemIdx}>
                  <button
                    onClick={() => toggleItem(catIdx, itemIdx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-cyan-900/8 transition-colors group"
                  >
                    <span className="text-cyan-100 text-sm font-mono pr-4 group-hover:text-cyan-200 transition-colors">
                      {item.q}
                    </span>
                    <span className={`text-cyan-400/50 text-lg flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-5 pb-5">
                      <div className="bg-cyan-950/30 border border-cyan-500/10 rounded-xl p-4">
                        <p className="text-cyan-200/70 text-sm leading-relaxed font-mono">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
