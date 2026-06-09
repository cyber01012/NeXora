import { useState, useRef, useEffect } from 'react';
import HUDCard from '../../components/ui/HUDCard';

export default function CitizenHelpDesk() {
  const [messages, setMessages] = useState([
    { id: 1, type: 'received', text: 'Welcome to NeXora Support! How can we help you today?', time: '10:00 AM', name: 'Support Agent' },
    { id: 2, type: 'received', text: 'You can report issues, track complaints, or get help with your account.', time: '10:01 AM', name: 'Support Agent' },
  ]);
  const [input, setInput] = useState('');
  const [online, setOnline] = useState(true);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'sent',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: 'You'
    }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'received',
        text: 'Thank you for your message. Our team will respond shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        name: 'Support Agent'
      }]);
    }, 1000);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">HELP DESK</h1>
          <p className="font-mono text-[9px] text-cyan-500/60">[ 24/7 SUPPORT ]</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${online ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}`}>
          <div className={`w-2 h-2 rounded-full ${online ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className={`font-mono text-[9px] ${online ? 'text-green-400' : 'text-red-400'}`}>{online ? 'ONLINE' : 'OFFLINE'}</span>
        </div>
      </div>

      {/* Chat Window */}
      <HUDCard className="p-0 overflow-hidden">
        <div className="h-[500px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${msg.type === 'sent' ? 'order-2' : 'order-1'}`}>
                  <div className={`p-3 rounded-lg ${msg.type === 'sent' ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-cyan-900/30 border border-cyan-500/20'}`}>
                    <p className="font-mono text-sm text-cyan-200">{msg.text}</p>
                    <div className="flex justify-between items-center mt-2 gap-3">
                      <span className="font-mono text-[9px] text-cyan-500/50">{msg.name}</span>
                      <span className="font-mono text-[9px] text-cyan-500/50">{msg.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-hud p-3 flex gap-2 bg-cyan-900/10">
            <input
              type="text"
              className="flex-1 bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3 font-mono text-sm text-cyan-200 focus:outline-none focus:border-cyan-400 placeholder:text-cyan-500/30"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="px-5 py-2 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all flex items-center gap-2">
              <span>📤</span> SEND
            </button>
          </div>
        </div>
      </HUDCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '📋', label: 'My Reports', link: '/citizen/reports' },
          { icon: '📝', label: 'New Report', link: '/citizen/report' },
          { icon: '❓', label: 'FAQ', link: '/citizen/faq' },
        ].map((item) => (
          <button key={item.label} onClick={() => window.location.href = item.link} className="p-3 hud-glass rounded-lg border-hud text-center hover:border-cyan-400 transition-all">
            <div className="text-xl mb-1">{item.icon}</div>
            <div className="font-mono text-[9px] text-cyan-400/80">{item.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}