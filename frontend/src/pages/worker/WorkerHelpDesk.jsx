import { useState, useRef, useEffect, useCallback } from 'react';
import { workerApi } from '../../services/api.js';
import { PaperAirplaneIcon, ArrowPathIcon, ChevronDoubleDownIcon } from '@heroicons/react/24/outline';

// ─── Auto-reply engine ─────────────────────────────────────────────────────
const REPLIES = [
  {
    keys: ['hello', 'hi', 'hey', 'salam', 'assalam', 'good morning', 'good evening'],
    responses: [
      'Hello! 👋 Welcome to Nexora Support. How can I assist you today?',
      'Hi there! I\'m here to help. What can I do for you?',
      'Hey! Great to hear from you. What do you need help with?',
    ],
  },
  {
    keys: ['help', 'current task', 'task help', 'need help'],
    responses: [
      'I can assist with your current task! Could you share the Task ID (e.g. RPT-123) so I can look into it?',
      'Sure, I\'m on it. Please provide the Task ID from your task list and describe the issue.',
      'Happy to help! Share your Task ID and tell me what\'s going wrong.',
    ],
  },
  {
    keys: ['reject', 'rejection', 'rejected'],
    responses: [
      'Task rejection is logged and the responder has been notified. A reason is always recommended for transparency.',
      'Noted — the rejection reason you provided will be forwarded to your responder for review.',
      'Rejection recorded. The task will be reassigned by your responder. Anything else?',
    ],
  },
  {
    keys: ['accept', 'accepted', 'accepting'],
    responses: [
      'Once you accept a task it moves to "In Progress" status. Remember to update progress regularly!',
      'Task accepted! You can now update progress or mark it complete from the Tasks tab.',
    ],
  },
  {
    keys: ['complete', 'completed', 'finish', 'finished', 'done'],
    responses: [
      'Great work completing the task! ✅ It will appear in your Task History shortly.',
      'Task marked complete — the responder will confirm it on their end. Well done!',
    ],
  },
  {
    keys: ['status', 'update status', 'cannot update', "can't update", 'not updating'],
    responses: [
      'If status isn\'t updating, try refreshing the page. Make sure you have accepted the task first before marking progress.',
      'Status updates require the task to be in "In Progress" state. Accept it first, then you\'ll see the progress button.',
      'Try a hard refresh (Ctrl+Shift+R). If the issue persists, share the Task ID and I\'ll escalate it.',
    ],
  },
  {
    keys: ['reassign', 'transfer', 'someone else', 'different worker'],
    responses: [
      'Reassignment requests go to your responder. Please share the Task ID and the reason for reassignment.',
      'I\'ll flag this for your responder. Could you share which Task ID needs reassignment?',
    ],
  },
  {
    keys: ['detail', 'incorrect', 'wrong', 'error', 'mistake'],
    responses: [
      'Incorrect task details should be reported to your responder. Please include the Task ID and what\'s wrong.',
      'Got it — please share the Task ID and describe the incorrect information so I can escalate it.',
    ],
  },
  {
    keys: ['performance', 'rating', 'score', 'stats'],
    responses: [
      'Your performance metrics are updated in real-time on the Performance tab. Completion rate and response time are the key factors.',
      'Ratings are calculated from your completion rate. Completing tasks quickly improves your score!',
    ],
  },
  {
    keys: ['password', 'login', 'access', 'account', 'sign in'],
    responses: [
      'For password or account issues, contact your system administrator or use the Change Password section in your Profile tab.',
      'Account access issues can be resolved via your Profile → Change Password. If locked out, contact admin.',
    ],
  },
  {
    keys: ['profile', 'update profile', 'edit profile', 'name', 'phone', 'email'],
    responses: [
      'You can update your name, email, and phone number directly in the Profile tab. Click "Edit Profile" to make changes.',
      'Profile updates are instant — just head to the Profile tab, hit Edit, make your changes and save!',
    ],
  },
  {
    keys: ['category', 'categories', 'expertise', 'onboarding'],
    responses: [
      'You can update your expertise categories anytime in the Profile tab under "My Categories".',
      'Category selections help match you with relevant tasks. Update them in Profile → My Categories.',
    ],
  },
  {
    keys: ['dashboard', 'home', 'overview'],
    responses: [
      'The Dashboard shows a live overview of your task counts and monthly performance trend. Check it out!',
    ],
  },
  {
    keys: ['history', 'past', 'old task', 'completed task', 'rejected task'],
    responses: [
      'All completed and rejected tasks are visible in the Task History tab, including remarks and dates.',
    ],
  },
  {
    keys: ['notification', 'alert', 'message'],
    responses: [
      'Task assignments and updates are reflected in real-time in your Tasks tab. Make sure to refresh if you miss a notification.',
    ],
  },
  {
    keys: ['thank', 'thanks', 'thankyou', 'thank you', 'shukria', 'shukriya'],
    responses: [
      'You\'re welcome! 😊 Is there anything else I can help you with?',
      'Happy to help! Don\'t hesitate to reach out anytime. Take care! 🛡',
      'Glad I could assist! Stay safe out there. 👋',
    ],
  },
  {
    keys: ['bye', 'goodbye', 'see you', 'khuda hafiz', 'allah hafiz'],
    responses: [
      'Goodbye! Stay safe and take care. 👋',
      'See you! Remember, support is always available 24/7. 🛡',
    ],
  },
  {
    keys: ['ok', 'okay', 'alright', 'got it', 'understood', 'fine'],
    responses: [
      'Great! Let me know if you need anything else.',
      'Perfect! Anything else on your mind?',
    ],
  },
];

const FALLBACKS = [
  'I understand. Could you provide more details so I can assist you better?',
  'Thanks for reaching out! Could you elaborate a bit more?',
  'Let me look into this. Can you share more context or the relevant Task ID?',
  'I\'m here to help! Please share more details and I\'ll do my best.',
  'Got your message. For faster resolution, include your Task ID if this is task-related.',
];

function getAutoReply(text) {
  const lower = text.toLowerCase();
  for (const rule of REPLIES) {
    if (rule.keys.some(k => lower.includes(k))) {
      return rule.responses[Math.floor(Math.random() * rule.responses.length)];
    }
  }
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}
// ──────────────────────────────────────────────────────────────────────────

const QUICK_REPLIES = [
  'I need help with my current task',
  'My task details are incorrect',
  'I cannot update the task status',
  'Please reassign this task to someone else',
];

const formatTime = (iso) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
  catch { return '—'; }
};

const formatDay = (iso) => {
  if (!iso) return 'Today';
  try {
    const d = new Date(iso);
    const today = new Date();
    const diff = new Date(today.toDateString()) - new Date(d.toDateString());
    if (diff === 0) return 'Today';
    if (diff === 86400000) return 'Yesterday';
    return d.toLocaleDateString('en-PK', { dateStyle: 'medium' });
  } catch { return 'Today'; }
};

function SupportAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-900 border border-cyan-500/40 flex items-center justify-center text-sm shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
      🛡
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-2 justify-start">
      <div className="w-8 shrink-0"><SupportAvatar /></div>
      <div className="flex flex-col items-start">
        <p className="font-mono text-[9px] text-cyan-400/50 mb-1 ml-1">Nexora Support</p>
        <div className="px-4 py-3 bg-[var(--bg3)] border border-[var(--border)] rounded-2xl rounded-bl-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

export default function WorkerHelpDesk() {
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(true);
  const [sending, setSending]       = useState(false);
  const [isTyping, setIsTyping]     = useState(false);
  const [error, setError]           = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const endRef    = useRef(null);
  const scrollRef = useRef(null);
  const inputRef  = useRef(null);

  const workerUsername = localStorage.getItem('nexora_worker_username') || 'worker01';

  // Parse raw API messages
  const parseMessages = useCallback((data) =>
    (Array.isArray(data) ? data : []).map(m => ({
      id:      m.id,
      type:    m.isMine ? 'sent' : 'received',
      text:    m.message,
      time:    formatTime(m.createdAt),
      day:     formatDay(m.createdAt),
      name:    m.isMine ? 'You' : (m.senderUsername || 'Support'),
      isRead:  m.isRead,
      bot:     false,
      sortKey: m.createdAt ? new Date(m.createdAt).getTime() : 0,
    })), []);

  const loadMessages = useCallback(async () => {
    try {
      const data = await workerApi.getHelpMessages();
      setMessages(prev => {
        // Keep local bot replies that aren't in the API response
        const botMsgs = prev.filter(m => m.bot);
        const apiMsgs = parseMessages(data);
        // Merge: keep bot replies whose text doesn't already exist in API messages
        const apiTexts = new Set(apiMsgs.map(m => m.text));
        const uniqueBots = botMsgs.filter(b => !apiTexts.has(b.text));
        // Sort everything chronologically by sortKey so sent/received interleave correctly
        return [...apiMsgs, ...uniqueBots].sort((a, b) => (a.sortKey ?? 0) - (b.sortKey ?? 0));
      });
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [parseMessages]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 15000);
    return () => clearInterval(interval);
  }, [loadMessages]);

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 150)
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 180);
  };

  const scrollToBottom = () => endRef.current?.scrollIntoView({ behavior: 'smooth' });

  const sendMessage = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || sending) return;
    setInput('');
    setSending(true);

    const sentAt = Date.now();
    const now    = new Date().toISOString();

    // Optimistic sent bubble
    const tempId = `temp-${sentAt}`;
    setMessages(prev => [...prev, {
      id: tempId, type: 'sent', text: msg,
      time: formatTime(now), day: formatDay(now),
      name: 'You', isRead: false, sending: true, sortKey: sentAt, bot: false,
    }]);

    try {
      await workerApi.sendHelpMessage(msg);
      // Confirm tick
      setMessages(prev => prev.map(m => m.id === tempId ? { ...m, sending: false } : m));
    } catch {
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setError('Failed to send. Please try again.');
      setInput(msg);
      setSending(false);
      return;
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }

    // ── Auto-reply flow ──────────────────────────────────────────────────
    const typingDelay = 800 + Math.random() * 700;   // 0.8–1.5 s "typing"
    const replyText   = getAutoReply(msg);

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const replyAt = Date.now();
        const replyNow = new Date().toISOString();
        setMessages(prev => [...prev, {
          id:      `bot-${replyAt}`,
          type:    'received',
          text:    replyText,
          time:    formatTime(replyNow),
          day:     formatDay(replyNow),
          name:    'Support',
          isRead:  true,
          bot:     true,
          sortKey: replyAt,
        }]);
      }, typingDelay);
    }, 400);
    // ────────────────────────────────────────────────────────────────────
  };

  // Group by day
  const grouped = messages.reduce((acc, msg) => {
    const day = msg.day || 'Today';
    if (!acc.length || acc[acc.length - 1].day !== day) acc.push({ day, msgs: [] });
    acc[acc.length - 1].msgs.push(msg);
    return acc;
  }, []);

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="font-title text-glow-primary text-2xl tracking-wider">SUPPORT DESK</h1>
          <p className="font-mono text-[9px] text-cyan-500/60 mt-0.5">[ LIVE CHAT · 24/7 ASSISTANCE ]</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadMessages}
            className="p-2 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-all"
            title="Refresh messages"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/40">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[9px] text-green-400 tracking-wider">SUPPORT ONLINE</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-xl font-mono text-xs text-red-400 flex justify-between items-center">
          <span>⚠ {error}</span>
          <button onClick={() => setError(null)} className="text-red-400/60 hover:text-red-300 ml-4">✕</button>
        </div>
      )}

      {/* Chat Window */}
      <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.05)] relative">

        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-cyan-900/10">
          <SupportAvatar />
          <div>
            <p className="font-mono text-xs text-cyan-200 font-semibold">Nexora Support</p>
            <p className="font-mono text-[9px] text-green-400">
              {isTyping ? '● Typing…' : '● Online · typically replies in <5 min'}
            </p>
          </div>
          <div className="ml-auto font-mono text-[9px] text-cyan-500/50">
            ID: <span className="text-cyan-400">{workerUsername}</span>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-[420px] overflow-y-auto p-4 space-y-1"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(6,182,212,0.2) transparent' }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="font-mono text-[10px] text-cyan-400/50 animate-pulse">Loading messages…</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="text-4xl opacity-30">💬</div>
              <p className="font-mono text-sm text-cyan-400/40">No messages yet.</p>
              <p className="font-mono text-[10px] text-cyan-500/30">Start a conversation — support will reply instantly!</p>
            </div>
          ) : (
            grouped.map(({ day, msgs }) => (
              <div key={day}>
                {/* Day divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-cyan-500/10" />
                  <span className="font-mono text-[9px] text-cyan-500/40 px-2">{day}</span>
                  <div className="flex-1 h-px bg-cyan-500/10" />
                </div>

                {msgs.map((msg, i) => {
                  const isSent     = msg.type === 'sent';
                  const showAvatar = !isSent && (i === 0 || msgs[i - 1]?.type !== 'received');
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 mb-2 ${isSent ? 'justify-end' : 'justify-start'} animate-msgIn`}
                    >
                      {!isSent && (
                        <div className="w-8 shrink-0">
                          {showAvatar ? <SupportAvatar /> : null}
                        </div>
                      )}

                      <div className={`max-w-[72%] flex flex-col ${isSent ? 'items-end' : 'items-start'}`}>
                        {showAvatar && !isSent && (
                          <p className="font-mono text-[9px] text-cyan-400/50 mb-1 ml-1">Nexora Support</p>
                        )}
                        <div className={`px-4 py-2.5 rounded-2xl text-sm font-mono leading-relaxed ${
                          isSent
                            ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-100 rounded-br-sm shadow-[0_2px_12px_rgba(6,182,212,0.15)]'
                            : 'bg-[var(--bg3)] border border-[var(--border)] text-cyan-200 rounded-bl-sm'
                        } ${msg.sending ? 'opacity-60' : 'opacity-100'} transition-opacity duration-300`}>
                          {msg.text}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 px-1">
                          <span className="font-mono text-[8px] text-cyan-500/40">{msg.time}</span>
                          {isSent && (
                            <span className={`text-[9px] ${msg.sending ? 'text-cyan-500/30' : 'text-cyan-400/70'}`}>
                              {msg.sending ? '○' : '✓✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}

          {/* Typing indicator */}
          {isTyping && <TypingIndicator />}

          <div ref={endRef} />
        </div>

        {/* Scroll-to-bottom */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="absolute right-4 bottom-32 p-2 bg-cyan-900/80 border border-cyan-500/40 rounded-full text-cyan-400 hover:bg-cyan-500/20 transition-all shadow-lg z-10"
          >
            <ChevronDoubleDownIcon className="w-4 h-4" />
          </button>
        )}

        {/* Quick Replies */}
        <div
          className="px-4 py-2 border-t border-[var(--border)] bg-cyan-950/20 flex gap-2 overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          <span className="shrink-0 font-mono text-[9px] text-cyan-500/30 self-center pr-1">Quick:</span>
          {QUICK_REPLIES.map(qr => (
            <button
              key={qr}
              onClick={() => sendMessage(qr)}
              disabled={sending || isTyping}
              className="shrink-0 px-3 py-1 rounded-full border border-cyan-500/25 font-mono text-[9px] text-cyan-400/60 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all disabled:opacity-30"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-[var(--border)] bg-[var(--bg2)] flex gap-3 items-center">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-cyan-900/20 border border-cyan-500/30 rounded-xl px-4 py-2.5 font-mono text-sm text-cyan-200 focus:outline-none focus:border-cyan-400 placeholder:text-cyan-500/25 transition-all"
            placeholder="Type a message…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            disabled={sending || isTyping}
          />
          <button
            onClick={() => sendMessage()}
            disabled={sending || isTyping || !input.trim()}
            className="p-2.5 bg-cyan-500/20 border border-cyan-400 rounded-xl text-glow-primary hover:bg-cyan-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            {sending
              ? <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              : <PaperAirplaneIcon className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            }
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'AVG RESPONSE',   value: '< 2 sec',  icon: '⚡', color: '#4ade80' },
          { label: 'SUPPORT HOURS',  value: '24 / 7',   icon: '🕒', color: '#06b6d4' },
          { label: 'YOUR MESSAGES',  value: messages.filter(m => m.type === 'sent').length, icon: '📨', color: '#fbbf24' },
          { label: 'TOTAL MESSAGES', value: messages.length, icon: '💬', color: '#c084fc' },
        ].map(stat => (
          <div
            key={stat.label}
            className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl p-3 text-center transition-all duration-300 hover:border-cyan-500/30 hover:scale-[1.02]"
          >
            <div className="text-lg mb-1">{stat.icon}</div>
            <p className="font-data text-base" style={{ color: stat.color, textShadow: `0 0 8px ${stat.color}60` }}>
              {stat.value}
            </p>
            <p className="font-mono text-[8px] text-cyan-400/50 mt-0.5 tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes msgIn   { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn    { animation: fadeIn 0.3s ease-out; }
        .animate-msgIn     { animation: msgIn 0.25s ease-out; }
      `}</style>
    </div>
  );
}