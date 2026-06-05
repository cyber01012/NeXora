import { useState } from 'react';
import HUDCard from '../../components/ui/HUDCard';

const faqCategories = [
  {
    title: 'General',
    icon: '📌',
    items: [
      { q: 'What is NeXora?', a: 'NeXora is an intelligent disaster and civic management system that connects citizens with relevant departments for issue resolution.' },
      { q: 'Is NeXora free to use?', a: 'Yes, NeXora is completely free for citizens. No hidden charges or subscriptions.' },
    ]
  },
  {
    title: 'Reporting',
    icon: '📝',
    items: [
      { q: 'How do I report an issue?', a: 'Click on "Report Issue" in the sidebar, fill in the details including type, description, location, and optionally upload evidence.' },
      { q: 'Can I report anonymously?', a: 'Yes, you can submit reports without logging in. You will receive a tracking code to check status.' },
      { q: 'What types of issues can I report?', a: 'Electricity outages, gas leaks, road damage, water supply issues, and medical emergencies.' },
    ]
  },
  {
    title: 'Tracking',
    icon: '📍',
    items: [
      { q: 'How do I track my report?', a: 'Go to "My Reports" section to see all your reports with real-time status updates.' },
      { q: 'What do the statuses mean?', a: 'PENDING = Awaiting review, APPROVED = Forwarded to department, IN_PROGRESS = Being addressed, COMPLETED = Resolved.' },
    ]
  },
  {
    title: 'Technical',
    icon: '⚙️',
    items: [
      { q: 'What is Disaster Mode?', a: 'Disaster Mode switches the theme to red and highlights critical zones when emergencies are detected in your area.' },
      { q: 'How do I reset my password?', a: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.' },
    ]
  }
];

export default function CitizenFAQ() {
  const [openSection, setOpenSection] = useState(null);
  const [openItem, setOpenItem] = useState(null);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-title text-glow-primary text-2xl tracking-wider">HELP & FAQ</h1>
        <p className="font-mono text-[9px] text-cyan-500/60">[ FREQUENTLY ASKED QUESTIONS ]</p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search for answers..."
          className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3 pl-10 font-mono text-sm text-cyan-200 focus:outline-none focus:border-cyan-400 placeholder:text-cyan-500/30"
        />
        <span className="absolute left-3 top-3 text-cyan-400/60">🔍</span>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-4">
        {faqCategories.map((category, idx) => (
          <div key={idx} className="border border-cyan-500/20 rounded-lg overflow-hidden">
            <button
              className="w-full p-4 text-left flex justify-between items-center bg-cyan-900/20 hover:bg-cyan-900/30 transition-all"
              onClick={() => setOpenSection(openSection === idx ? null : idx)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{category.icon}</span>
                <span className="font-data text-sm text-glow-primary">{category.title}</span>
                <span className="font-mono text-[9px] text-cyan-400/60">{category.items.length} questions</span>
              </div>
              <span className="text-cyan-400">{openSection === idx ? '▲' : '▼'}</span>
            </button>

            {openSection === idx && (
              <div className="p-4 space-y-3">
                {category.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="border-b border-cyan-500/20 last:border-0 pb-3 last:pb-0">
                    <button
                      className="w-full text-left flex justify-between items-center py-2"
                      onClick={() => setOpenItem(openItem === `${idx}-${itemIdx}` ? null : `${idx}-${itemIdx}`)}
                    >
                      <span className="font-mono text-sm text-cyan-200">{item.q}</span>
                      <span className="text-cyan-400/60 text-xs">{openItem === `${idx}-${itemIdx}` ? '−' : '+'}</span>
                    </button>
                    {openItem === `${idx}-${itemIdx}` && (
                      <div className="mt-2 pl-3 border-l-2 border-cyan-500/30">
                        <p className="font-mono text-xs text-cyan-400/80 leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <HUDCard className="text-center">
        <div className="text-3xl mb-2">💬</div>
        <h3 className="font-title text-glow-primary text-md mb-2">Still need help?</h3>
        <p className="font-mono text-xs text-cyan-400/60 mb-3">Our support team is available 24/7</p>
        <button className="px-5 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all inline-flex items-center gap-2">
          <span>💬</span> CONTACT SUPPORT
        </button>
      </HUDCard>
    </div>
  );
}