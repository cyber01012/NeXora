import { useState, useRef, useEffect } from 'react';
import { responderApi } from '../../services/api';
import {
  PaperAirplaneIcon,
  UserCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  CheckBadgeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Message Bubble Component
const MessageBubble = ({ message, isSent, showAvatar = true }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} animate-slideInRight`}>
      {!isSent && showAvatar && (
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-xs font-mono shadow-[0_0_10px_cyan]">
            AD
          </div>
        </div>
      )}
      
      <div className={`max-w-[75%] ${isSent ? 'order-2' : 'order-1'}`}>
        <div className={`p-3 rounded-2xl ${
          isSent 
            ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 rounded-tr-sm' 
            : 'bg-cyan-900/30 border border-cyan-500/20 rounded-tl-sm'
        }`}>
          <p className="font-mono text-sm text-cyan-200 leading-relaxed break-words">{message.text}</p>
          <div className="flex justify-end items-center gap-2 mt-2">
            {message.status === 'sent' && !isSent && (
              <span className="text-[9px] text-cyan-500/50 flex items-center gap-1">
                <CheckBadgeIcon className="w-3 h-3" /> delivered
              </span>
            )}
            {message.status === 'read' && !isSent && (
              <span className="text-[9px] text-cyan-400 flex items-center gap-1">
                <CheckBadgeIcon className="w-3 h-3" /> read
              </span>
            )}
            <span className="font-mono text-[9px] text-cyan-500/50">
              {formatTime(message.createdAt) || message.time}
            </span>
          </div>
        </div>
      </div>
      
      {isSent && showAvatar && (
        <div className="flex-shrink-0 ml-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-xs font-mono">
            ME
          </div>
        </div>
      )}
    </div>
  );
};

// Typing Indicator Component
const TypingIndicator = () => (
  <div className="flex justify-start animate-fadeIn">
    <div className="bg-cyan-900/30 border border-cyan-500/20 rounded-2xl rounded-tl-sm px-4 py-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

// Quick Response Component
const QuickResponse = ({ text, onClick }) => (
  <button
    onClick={() => onClick(text)}
    className="px-3 py-1.5 bg-cyan-900/20 border border-cyan-500/30 rounded-full text-[10px] font-mono text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all hover:scale-105"
  >
    {text}
  </button>
);

export default function ResponderHelpDesk() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [online, setOnline] = useState(true);
  const endRef = useRef(null);

  useEffect(() => {
    loadMessages();
    
    // Simulate online status (in real app, this would come from backend)
    const interval = setInterval(() => {
      setOnline(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      const data = await responderApi.getHelpMessages();
      setMessages(data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
      // Fallback mock data
      setMessages([
        { 
          id: 1, 
          type: 'received', 
          text: 'Welcome to Admin Support! How can we help you today?', 
          time: '10:00 AM',
          createdAt: new Date().toISOString(),
          name: 'Admin',
          status: 'read'
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    
    const messageText = input.trim();
    setInput('');
    setSending(true);
    
    // Optimistically add message
    const tempId = Date.now();
    const newMessage = {
      id: tempId,
      type: 'sent',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      name: 'You',
      status: 'sending'
    };
    setMessages(prev => [...prev, newMessage]);
    scrollToBottom();
    
    try {
      await responderApi.sendHelpMessage(messageText);
      
      // Update message status to sent
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? { ...msg, status: 'sent' } : msg
      ));
      
      // Show typing indicator
      setIsTyping(true);
      scrollToBottom();
      
      // Simulate admin response (in real app, this would come from WebSocket)
      setTimeout(async () => {
        setIsTyping(false);
        
        const response = {
          id: Date.now() + 1,
          type: 'received',
          text: 'Thank you for your message. Our support team has been notified and will respond shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          createdAt: new Date().toISOString(),
          name: 'Admin',
          status: 'read'
        };
        setMessages(prev => [...prev, response]);
        scrollToBottom();
      }, 1500);
      
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === tempId ? { ...msg, text: msg.text + ' ❌', status: 'failed' } : msg
      ));
    } finally {
      setSending(false);
    }
  };

  const handleQuickResponse = (text) => {
    setInput(text);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <div className="font-mono text-cyan-400 animate-pulse tracking-wider">[ LOADING CHAT... ]</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">HELP DESK</h1>
          <p className="font-mono text-xs text-cyan-500/60 mt-1">[ ADMIN SUPPORT & ASSISTANCE ]</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
          online ? 'bg-green-500/20 border border-green-500' : 'bg-gray-500/20 border border-gray-500'
        }`}>
          <div className={`w-2 h-2 rounded-full ${online ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
          <span className={`font-mono text-[9px] ${online ? 'text-green-400' : 'text-gray-400'}`}>
            {online ? 'ADMIN ONLINE' : 'ADMIN OFFLINE'}
          </span>
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl overflow-hidden transition-all duration-300 hover:border-cyan-500/30">
        {/* Chat Header */}
        <div className="p-4 border-b border-[var(--border)] bg-gradient-to-r from-cyan-900/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-lg shadow-[0_0_15px_cyan]">
                💬
              </div>
              {online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[var(--bg2)] animate-pulse" />
              )}
            </div>
            <div>
              <p className="font-data text-glow-primary text-sm">Admin Support Team</p>
              <p className="font-mono text-[9px] text-cyan-400/60 flex items-center gap-1">
                <CheckBadgeIcon className="w-3 h-3" /> Official Support
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[450px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ChatBubbleLeftEllipsisIcon className="w-12 h-12 text-cyan-400/30 mb-3" />
                <p className="font-mono text-sm text-cyan-400/60">No messages yet</p>
                <p className="font-mono text-[10px] text-cyan-500/40 mt-1">Start a conversation with admin support</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <MessageBubble 
                  key={msg.id} 
                  message={msg} 
                  isSent={msg.type === 'sent'}
                  showAvatar={idx === 0 || messages[idx - 1]?.type !== msg.type}
                />
              ))
            )}
            
            {/* Typing Indicator */}
            {isTyping && <TypingIndicator />}
            
            <div ref={endRef} />
          </div>

          {/* Quick Responses */}
          <div className="px-4 py-2 border-t border-[var(--border)]">
            <div className="flex flex-wrap gap-2">
              <QuickResponse text="I need help with a task" onClick={handleQuickResponse} />
              <QuickResponse text="How to add a worker?" onClick={handleQuickResponse} />
              <QuickResponse text="Report a technical issue" onClick={handleQuickResponse} />
              <QuickResponse text="Need department assistance" onClick={handleQuickResponse} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-[var(--border)] p-3 bg-cyan-900/10">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-cyan-900/20 border border-cyan-500/30 rounded-lg px-4 py-3 font-mono text-sm text-cyan-200 focus:border-cyan-400 focus:outline-none transition-all placeholder:text-cyan-500/30"
                placeholder="Type your message to admin..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !sending && sendMessage()}
                disabled={sending}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sending}
                className="px-5 py-3 bg-cyan-500/20 border border-cyan-400 rounded-lg font-mono text-sm text-glow-primary hover:bg-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    SENDING...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    SEND
                  </>
                )}
              </button>
            </div>
            <p className="font-mono text-[8px] text-cyan-500/40 mt-2 text-center">
              Admin support is available 24/7. Expect a response within 5 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'RESPONSE TIME', value: '< 5 min', icon: '⏱️', color: '#4ade80' },
          { label: 'SUPPORT HOURS', value: '24/7', icon: '🕒', color: '#06b6d4' },
          { label: 'TICKETS TODAY', value: '12', icon: '🎫', color: '#fbbf24' },
          { label: 'RESOLVED', value: '89%', icon: '✅', color: '#c084fc' },
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
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out forwards; opacity: 0; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; opacity: 0; }
        .animate-bounce { animation: bounce 1.4s infinite ease-in-out; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}