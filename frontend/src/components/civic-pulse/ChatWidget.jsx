import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Mic, Bot, User, 
  Loader2, AlertTriangle, X, Minimize2, Maximize2
} from 'lucide-react';
import { useDisasterMode } from '../../context/DisasterContext';

const ChatWidget = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Assalam-o-Alaikum! I am your NeXora Civic Advisor. Ask me about disaster preparedness, civic issues, or safety tips for Karachi.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const { isDisasterMode } = useDisasterMode();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-expand when messages grow
  useEffect(() => {
    if (messages.length > 2) setIsExpanded(true);
  }, [messages.length]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMsg }]
        })
      });
      const data = await res.json();

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I am having trouble connecting. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Voice recognition
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  return (
    <div className={`chat-widget ${isExpanded ? 'expanded' : ''} ${isDisasterMode ? 'disaster' : ''}`}>
      {/* Chat Header */}
      <div className="chat-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="chat-header-left">
          <Bot className="w-5 h-5 text-[var(--primary-400)]" />
          <span className="chat-title font-data text-xs tracking-widest uppercase">
            Civic Advisor
          </span>
          {isDisasterMode && (
            <span className="disaster-badge font-mono text-[8px] uppercase tracking-wider">
              <AlertTriangle className="w-3 h-3" />
              Emergency
            </span>
          )}
        </div>
        <div className="chat-header-actions">
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </div>
      </div>

      {/* Messages Area */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="chat-messages"
          >
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`message ${msg.role}`}
              >
                <div className="message-avatar">
                  {msg.role === 'user' ? 
                    <User className="w-4 h-4" /> : 
                    <Bot className="w-4 h-4" />
                  }
                </div>
                <div className="message-content">
                  <p className="message-text font-mono text-sm leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="message assistant loading"
              >
                <div className="message-avatar">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="typing-indicator">
                  <span /><span /><span />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="chat-input-bar">
        <button 
          onClick={startListening}
          className={`chat-mic-btn ${isListening ? 'listening' : ''}`}
        >
          <Mic className="w-4 h-4" />
          {isListening && <span className="mic-pulse" />}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about disasters, civic issues..."
          className="chat-input font-mono text-sm"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="chat-send-btn"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default ChatWidget;