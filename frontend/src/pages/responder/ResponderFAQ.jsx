// import { useState } from 'react';
// import HUDCard from '../../components/ui/HUDCard';

// const faqItems = [
//   { q: 'How to accept a task?', a: 'Go to Tasks section, click on ACCEPT button on any pending task. The task will move to your active list.' },
//   { q: 'How to assign a worker?', a: 'After accepting a task, click on "ASSIGN TO WORKER" button and select a worker from your department.' },
//   { q: 'What happens if I reject a task?', a: 'Rejected tasks go back to Admin for reassignment to another department.' },
//   { q: 'How to mark task as complete?', a: 'Worker will submit field report with evidence. Review and click "CONFIRM COMPLETE".' },
//   { q: 'How to add a worker?', a: 'Go to Workers section, click "ADD WORKER", fill their details and save.' },
//   { q: 'What is the escalation policy?', a: 'If task is not accepted within 15 minutes, it auto-escalates to next responder.' },
// ];

// export default function ResponderFAQ() {
//   const [open, setOpen] = useState(null);

//   return (
//     <div className="space-y-5">
//       <div>
//         <h1 className="font-title text-glow-primary text-2xl tracking-wider">HELP & FAQ</h1>
//         <p className="font-mono text-[9px] text-cyan-500/60">[ RESPONDER GUIDE ]</p>
//       </div>

//       <div className="space-y-3">
//         {faqItems.map((item, idx) => (
//           <div key={idx} className="border border-cyan-500/20 rounded-lg overflow-hidden">
//             <button
//               className="w-full p-4 text-left flex justify-between items-center bg-cyan-900/20 hover:bg-cyan-900/30 transition-all"
//               onClick={() => setOpen(open === idx ? null : idx)}
//             >
//               <span className="font-mono text-sm text-cyan-200">{item.q}</span>
//               <span className="text-cyan-400">{open === idx ? '▲' : '▼'}</span>
//             </button>
//             {open === idx && (
//               <div className="p-4 border-t border-cyan-500/20 bg-cyan-900/10">
//                 <p className="font-mono text-sm text-cyan-400/80">{item.a}</p>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <HUDCard className="text-center">
//         <div className="text-3xl mb-2">💬</div>
//         <h3 className="font-title text-glow-primary text-md mb-2">Need immediate help?</h3>
//         <p className="font-mono text-xs text-cyan-400/60 mb-3">Contact admin support</p>
//         <button className="px-5 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary">CONTACT SUPPORT</button>
//       </HUDCard>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HUDCard from '../../components/ui/HUDCard';
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
  UserPlusIcon,
  ClipboardDocumentCheckIcon,
  XCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// FAQ Categories
const FAQ_CATEGORIES = [
  {
    id: 'tasks',
    name: 'TASKS',
    icon: '📋',
    color: '#06b6d4',
    items: [
      { q: 'How to accept a task?', a: 'Go to Tasks section, click on ACCEPT button on any pending task. The task will move to your active list. You will receive a notification once accepted.' },
      { q: 'What happens if I reject a task?', a: 'Rejected tasks go back to Admin for reassignment to another department. You must provide a reason for rejection.' },
      { q: 'How to mark task as complete?', a: 'Worker will submit field report with evidence. Review the evidence and click "CONFIRM COMPLETE" to mark task as completed.' },
      { q: 'What is the escalation policy?', a: 'If task is not accepted within 15 minutes, it auto-escalates to next responder. Urgent tasks escalate faster (5 minutes).' },
    ]
  },
  {
    id: 'workers',
    name: 'WORKERS',
    icon: '👥',
    color: '#c084fc',
    items: [
      { q: 'How to add a worker?', a: 'Go to Workers section, click "ADD WORKER", fill their details (name, phone, role) and save. The worker will receive login credentials.' },
      { q: 'How to assign a worker to a task?', a: 'After accepting a task, click on "ASSIGN TO WORKER" button and select a worker from your department list.' },
      { q: 'How to remove a worker?', a: 'Go to Workers section, click on the DELETE button next to the worker. This will deactivate their account.' },
      { q: 'What roles can workers have?', a: 'Workers can be Linemen, Technicians, Drivers, or Inspectors. Each role has different permissions.' },
    ]
  },
  {
    id: 'performance',
    name: 'PERFORMANCE',
    icon: '📈',
    color: '#4ade80',
    items: [
      { q: 'How is performance calculated?', a: 'Performance is based on task completion rate, average response time, average completion time, and citizen ratings.' },
      { q: 'What is a good response time?', a: 'Target response time is under 30 minutes for high priority tasks and under 2 hours for medium/low priority tasks.' },
      { q: 'How to improve department rating?', a: 'Accept tasks promptly, assign workers quickly, and ensure timely completion with proper evidence.' },
      { q: 'Where can I see my performance stats?', a: 'Go to Performance section from the sidebar. You will see charts, metrics, and department ranking.' },
    ]
  },
  {
    id: 'general',
    name: 'GENERAL',
    icon: '⚙️',
    color: '#fbbf24',
    items: [
      { q: 'How to change my password?', a: 'Go to Profile section, click on "CHANGE PASSWORD", enter current and new password, then save.' },
      { q: 'How to set my availability?', a: 'Use the AVAILABLE/ONLINE toggle in the sidebar footer. When offline, tasks will not be assigned to you.' },
      { q: 'How to contact admin support?', a: 'Click on HELP DESK in the sidebar to chat with admin support team.' },
      { q: 'What is Disaster Mode?', a: 'Disaster Mode switches theme to RED and highlights critical tasks. Activate it from the sidebar during emergencies.' },
    ]
  }
];

// FAQ Card Component
const FAQCard = ({ category, openItems, setOpenItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(category.items);

  useEffect(() => {
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      setFilteredItems(
        category.items.filter(item => 
          item.q.toLowerCase().includes(term) || 
          item.a.toLowerCase().includes(term)
        )
      );
    } else {
      setFilteredItems(category.items);
    }
  }, [searchTerm, category.items]);

  const toggleItem = (idx) => {
    if (openItems[category.id] === idx) {
      setOpenItems({ ...openItems, [category.id]: null });
    } else {
      setOpenItems({ ...openItems, [category.id]: idx });
    }
  };

  if (filteredItems.length === 0 && searchTerm) return null;

  return (
    <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/30">
      {/* Category Header */}
      <div className="p-4 border-b border-[var(--border)] bg-gradient-to-r from-cyan-900/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${category.color}15`, border: `1px solid ${category.color}30` }}>
            {category.icon}
          </div>
          <div>
            <h2 className="font-data text-glow-primary text-md tracking-wider">{category.name}</h2>
            <p className="font-mono text-[9px] text-cyan-400/60">{category.items.length} questions</p>
          </div>
        </div>
        
        {/* Search within category */}
        <div className="relative mt-3">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400/60" />
          <input
            type="text"
            placeholder={`Search in ${category.name}...`}
            className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-lg pl-9 pr-3 py-2 font-mono text-xs text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* FAQ Items */}
      <div className="divide-y divide-[var(--border)]">
        {filteredItems.map((item, idx) => (
          <div key={idx} className="animate-slideInRight" style={{ animationDelay: `${idx * 0.03}s` }}>
            <button
              className="w-full p-4 text-left flex justify-between items-center hover:bg-cyan-900/10 transition-all duration-200 group"
              onClick={() => toggleItem(idx)}
            >
              <div className="flex items-center gap-3">
                <QuestionMarkCircleIcon className="w-5 h-5 text-cyan-400/60 group-hover:text-cyan-400 transition-colors" />
                <span className="font-mono text-sm text-cyan-200 group-hover:text-glow-primary transition-colors">
                  {item.q}
                </span>
              </div>
              <span className={`text-cyan-400 transition-transform duration-300 ${openItems[category.id] === idx ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {openItems[category.id] === idx && (
              <div className="p-4 pt-0 pb-4 border-t border-cyan-500/20 bg-cyan-900/5 animate-fadeIn">
                <div className="flex gap-2">
                  <div className="w-1 h-auto bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full" />
                  <p className="font-mono text-sm text-cyan-400/80 leading-relaxed">{item.a}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && searchTerm && (
        <div className="p-8 text-center">
          <MagnifyingGlassIcon className="w-8 h-8 text-cyan-400/30 mx-auto mb-2" />
          <p className="font-mono text-sm text-cyan-400/60">No results found for "{searchTerm}"</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-2 text-[10px] font-mono text-cyan-400 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

// Popular Questions Component
const PopularQuestions = ({ onQuestionClick }) => {
  const popularQuestions = [
    { q: 'How to accept a task?', icon: '✓', color: '#4ade80' },
    { q: 'How to add a worker?', icon: '👥', color: '#c084fc' },
    { q: 'How to mark task complete?', icon: '✅', color: '#22d3ee' },
    { q: 'What is escalation policy?', icon: '⚠️', color: '#fbbf24' },
  ];

  return (
    <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4">
      <h3 className="font-title text-glow-primary text-sm tracking-wider mb-3 flex items-center gap-2">
        <span>⭐</span> POPULAR QUESTIONS
      </h3>
      <div className="flex flex-wrap gap-2">
        {popularQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onQuestionClick(q.q)}
            className="flex items-center gap-2 px-3 py-1.5 bg-cyan-900/20 border border-cyan-500/30 rounded-full text-[10px] font-mono text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all hover:scale-105"
          >
            <span>{q.icon}</span>
            {q.q}
          </button>
        ))}
      </div>
    </div>
  );
};

// Quick Stats Component
const QuickStats = () => (
  <div className="grid grid-cols-4 gap-3">
    {[
      { label: 'RESPONSE TIME', value: '< 15 min', icon: '⚡', color: '#06b6d4' },
      { label: 'SUPPORT HOURS', value: '24/7', icon: '🕒', color: '#4ade80' },
      { label: 'DOCS UPDATED', value: 'Latest', icon: '📚', color: '#fbbf24' },
      { label: 'HELP DESK', value: 'Online', icon: '💬', color: '#c084fc' },
    ].map((stat, idx) => (
      <div
        key={stat.label}
        className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-2 text-center transition-all duration-300 hover:border-cyan-500/30 animate-scaleIn"
        style={{ animationDelay: `${idx * 0.05}s` }}
      >
        <span className="text-sm">{stat.icon}</span>
        <p className="font-data text-sm mt-1" style={{ color: stat.color }}>{stat.value}</p>
        <p className="font-mono text-[7px] text-cyan-400/60 mt-0.5">{stat.label}</p>
      </div>
    ))}
  </div>
);

export default function ResponderFAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openItems, setOpenItems] = useState({});
  const [filteredCategories, setFilteredCategories] = useState(FAQ_CATEGORIES);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = FAQ_CATEGORIES.map(category => ({
        ...category,
        items: category.items.filter(item => 
          item.q.toLowerCase().includes(query) || 
          item.a.toLowerCase().includes(query)
        )
      })).filter(category => category.items.length > 0);
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(FAQ_CATEGORIES);
    }
  }, [searchQuery]);

  const handlePopularQuestionClick = (question) => {
    // Find which category contains this question
    for (const category of FAQ_CATEGORIES) {
      const idx = category.items.findIndex(item => item.q === question);
      if (idx !== -1) {
        setSelectedCategory(category.id);
        setOpenItems({ [category.id]: idx });
        // Scroll to category
        setTimeout(() => {
          document.getElementById(`category-${category.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        break;
      }
    }
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="font-title text-glow-primary text-2xl tracking-wider">HELP & FAQ</h1>
        <p className="font-mono text-xs text-cyan-500/60 mt-1">[ RESPONDER GUIDE & SUPPORT ]</p>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Global Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400/60" />
        <input
          type="text"
          className="w-full bg-cyan-900/20 border border-cyan-500/30 rounded-xl pl-12 pr-4 py-3.5 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-cyan-500/30"
          placeholder="Search for answers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[10px] font-mono text-cyan-400/60 hover:text-cyan-400"
          >
            Clear
          </button>
        )}
      </div>

      {/* Search Results Count */}
      {searchQuery && (
        <div className="flex justify-between items-center">
          <p className="font-mono text-[9px] text-cyan-400/60">
            Found {filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0)} results for "{searchQuery}"
          </p>
        </div>
      )}

      {/* Popular Questions */}
      {!searchQuery && <PopularQuestions onQuestionClick={handlePopularQuestionClick} />}

      {/* FAQ Categories */}
      <div className="space-y-4">
        {filteredCategories.map((category, idx) => (
          <div key={category.id} id={`category-${category.id}`}>
            <FAQCard 
              category={category}
              openItems={openItems}
              setOpenItems={setOpenItems}
            />
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredCategories.length === 0 && searchQuery && (
        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-12 text-center">
          <div className="text-5xl mb-3 opacity-40">❓</div>
          <p className="font-mono text-sm text-gray-400">No results found</p>
          <p className="font-mono text-[10px] text-cyan-500/40 mt-1">Try different keywords or browse categories</p>
          <button
            onClick={clearSearch}
            className="inline-block mt-4 text-xs text-cyan-400 hover:underline"
          >
            Clear search →
          </button>
        </div>
      )}

      {/* Contact Support Card */}
      <div className="bg-gradient-to-r from-cyan-900/20 to-transparent border border-cyan-500/30 rounded-xl p-6 text-center transition-all duration-300 hover:border-cyan-400 animate-scaleIn">
        <div className="text-4xl mb-3 animate-bounce">💬</div>
        <h3 className="font-title text-glow-primary text-md tracking-wider mb-2">Still need help?</h3>
        <p className="font-mono text-xs text-cyan-400/60 mb-4">
          Our admin support team is available 24/7 to assist you
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/responder/helpdesk"
            className="px-6 py-2.5 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" /> CONTACT SUPPORT
          </Link>
          <Link
            to="/responder/performance"
            className="px-6 py-2.5 bg-cyan-900/20 border border-cyan-500/30 rounded-lg font-mono text-sm text-cyan-300 hover:bg-cyan-500/10 transition-all hover:scale-105 inline-flex items-center gap-2"
          >
            <ClipboardDocumentCheckIcon className="w-4 h-4" /> VIEW PERFORMANCE
          </Link>
        </div>
      </div>

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out forwards; opacity: 0; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; opacity: 0; }
        .animate-bounce { animation: bounce 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
}