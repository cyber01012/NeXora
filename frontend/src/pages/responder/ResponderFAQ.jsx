import { useState } from 'react';
import HUDCard from '../../components/ui/HUDCard';

const faqItems = [
  { q: 'How to accept a task?', a: 'Go to Tasks section, click on ACCEPT button on any pending task. The task will move to your active list.' },
  { q: 'How to assign a worker?', a: 'After accepting a task, click on "ASSIGN TO WORKER" button and select a worker from your department.' },
  { q: 'What happens if I reject a task?', a: 'Rejected tasks go back to Admin for reassignment to another department.' },
  { q: 'How to mark task as complete?', a: 'Worker will submit field report with evidence. Review and click "CONFIRM COMPLETE".' },
  { q: 'How to add a worker?', a: 'Go to Workers section, click "ADD WORKER", fill their details and save.' },
  { q: 'What is the escalation policy?', a: 'If task is not accepted within 15 minutes, it auto-escalates to next responder.' },
];

export default function ResponderFAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-title text-glow-primary text-2xl tracking-wider">HELP & FAQ</h1>
        <p className="font-mono text-[9px] text-cyan-500/60">[ RESPONDER GUIDE ]</p>
      </div>

      <div className="space-y-3">
        {faqItems.map((item, idx) => (
          <div key={idx} className="border border-cyan-500/20 rounded-lg overflow-hidden">
            <button
              className="w-full p-4 text-left flex justify-between items-center bg-cyan-900/20 hover:bg-cyan-900/30 transition-all"
              onClick={() => setOpen(open === idx ? null : idx)}
            >
              <span className="font-mono text-sm text-cyan-200">{item.q}</span>
              <span className="text-cyan-400">{open === idx ? '▲' : '▼'}</span>
            </button>
            {open === idx && (
              <div className="p-4 border-t border-cyan-500/20 bg-cyan-900/10">
                <p className="font-mono text-sm text-cyan-400/80">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <HUDCard className="text-center">
        <div className="text-3xl mb-2">💬</div>
        <h3 className="font-title text-glow-primary text-md mb-2">Need immediate help?</h3>
        <p className="font-mono text-xs text-cyan-400/60 mb-3">Contact admin support</p>
        <button className="px-5 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary">CONTACT SUPPORT</button>
      </HUDCard>
    </div>
  );
}