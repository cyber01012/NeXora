import { useState } from 'react';

const faqData = [
  {
    category: 'USER MANAGEMENT',
    items: [
      {
        q: 'How do I create a new portal user?',
        a: 'Navigate to the Users page and click the "CREATE USER" button. Select the user source (Local or Government/NGO), choose the user type, fill in all required fields, and click "CREATE USER" to provision their access.'
      },
      {
        q: 'How do I deactivate a user account?',
        a: 'Go to the Users page, click "EDIT USER" on the target user card, toggle their status to "INACTIVE", provide remarks explaining the reason, and save changes. The user will be immediately locked out of all portals.'
      },
      {
        q: 'Can I reset a user\'s password?',
        a: 'Yes. Open the Edit User modal for the target user and click "RESET PASSWORD". You can set a new temporary password that the user will need to change on their next login.'
      },
    ],
  },
  {
    category: 'SYSTEM OPERATIONS',
    items: [
      {
        q: 'What does Disaster Mode do?',
        a: 'Disaster Mode activates a system-wide emergency escalation. It changes the UI theme to red alert, prioritizes SOS reports, sends mass notifications to all responders, and enables emergency-only communication channels. Toggle it from the sidebar.'
      },
      {
        q: 'How do I view system-wide analytics?',
        a: 'Navigate to the Analytics page from the sidebar. You can view report trends, responder metrics, department load distribution, and top incident zones. Use the time range filters (1M, 3M, 6M, 1Y) to adjust the data window.'
      },
      {
        q: 'What reports can I access?',
        a: 'As a System Admin, you have full access to all Civic Reports, SOS Alerts, and Anonymous Reports across the platform. Use the Reports page to filter by type, status, and urgency level.'
      },
    ],
  },
  {
    category: 'SECURITY',
    items: [
      {
        q: 'How do I change my admin password?',
        a: 'Click "CHANGE PASSWORD" in the sidebar under the ACCOUNT section. Enter your current password, then your new password twice for confirmation. Passwords must be at least 8 characters.'
      },
      {
        q: 'What does "Logout Others" do?',
        a: 'This terminates all other active sessions for your admin account across all devices and browsers, keeping only your current session active. Use this if you suspect unauthorized access to your account.'
      },
      {
        q: 'How are user passwords stored?',
        a: 'All passwords are hashed using BCrypt before storage. Neither admins nor the system can view plaintext passwords. Admins can only reset passwords, not retrieve them.'
      },
    ],
  },
  {
    category: 'INCIDENT MANAGEMENT',
    items: [
      {
        q: 'How does the Heatmap work?',
        a: 'The Heatmap visualizes active incident zones geospatially. Each dot represents a cluster of incidents, sized and colored by severity. Click on a zone to view details including coordinates, incident count, and type.'
      },
      {
        q: 'Can I assign responders to incidents?',
        a: 'Direct assignment is handled through the Assigning Officer role. As an admin, you can create Assigning Officer accounts who manage the dispatching of responders to specific incidents and tasks.'
      },
    ],
  },
];

export default function AdminFAQ() {
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
        <h1 className="font-title text-glow-primary text-2xl tracking-wider">ADMIN FAQ</h1>
        <p className="font-mono text-xs text-cyan-500/60 mt-1">[ FREQUENTLY ASKED QUESTIONS ]</p>
      </div>

      {/* FAQ SECTIONS */}
      {faqData.map((section, catIdx) => (
        <div key={section.category} className="bg-[var(--bg2)] border border-[var(--border)] rounded-2xl overflow-hidden">

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

                    <span
                      className={`
                        text-cyan-400/50 text-lg flex-shrink-0
                        transition-transform duration-300
                        ${isOpen ? 'rotate-45' : ''}
                      `}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                    `}
                  >
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
