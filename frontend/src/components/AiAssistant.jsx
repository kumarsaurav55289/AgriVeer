import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Send, User, ChevronDown, RefreshCw, Lightbulb, MessageSquare, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Namaste! I am your Agriveer Kisan AI Assistant. How can I help you today with tractor rentals, land leases, or Escrow payments?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatEndRef = useRef(null);

  const quickPrompts = [
    '🚜 Which tractor is best for 5-acre paddy tilling?',
    '🌾 What is the hourly rate for Combine Harvester?',
    '🛡️ How does 100% Kisan Escrow protection work?',
    '💰 How to list my machine to earn daily income?'
  ];

  useEffect(() => {
    if (isOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // AI Response Handler (Configured for API Key hookup)
  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMsg;
    if (!query.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');
    setIsTyping(true);

    // Simulated Smart Response Logic (Replace with actual AI API call when API key is added)
    setTimeout(() => {
      let botAnswer = '';
      const q = query.toLowerCase();

      if (q.includes('tractor') || q.includes('tilling') || q.includes('paddy')) {
        botAnswer = 'For 5-acre paddy farming, a 45HP to 50HP tractor like the Mahindra 575 DI or Kubota MU4501 is ideal. You can rent them on Agriveer for ₹1,800 - ₹2,000/day with driver included.';
      } else if (q.includes('harvester') || q.includes('combine') || q.includes('rate')) {
        botAnswer = 'Combine Harvester rates in Punjab range from ₹1,200/hour or ₹1,400/acre. Track harvesters like Claas Crop Tiger 40 are available on Agriveer for wetland paddy and wheat.';
      } else if (q.includes('escrow') || q.includes('payment') || q.includes('protect')) {
        botAnswer = 'Agriveer 100% Kisan Escrow holds payment safely in a vault when you book. The payment is only released to the owner when the driver verifies your 4-digit Delivery OTP (e.g. 8942) upon machine arrival.';
      } else if (q.includes('list') || q.includes('owner') || q.includes('earn')) {
        botAnswer = 'To list your machinery or land, click "+ Add New Listing" in your Owner Dashboard. You can set daily, hourly, or per-acre rates and receive direct rental bookings.';
      } else {
        botAnswer = `Thank you for your question about "${query}". I am ready to connect to your Gemini AI key to provide live real-time agronomist and rental advice!`;
      }

      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[150] pointer-events-none">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="ai-trigger-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold px-5 py-3.5 rounded-full shadow-2xl border-2 border-emerald-300 flex items-center gap-3 transition-all cursor-pointer group"
            title="Open Kisan AI Assistant"
          >
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-inner group-hover:rotate-12 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <span className="text-[9px] text-emerald-200 uppercase font-black tracking-wider block">Smart Agriveer Bot</span>
              <span className="text-xs font-black font-['Outfit'] flex items-center gap-1">
                Kisan AI Mitra
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block ml-0.5" />
              </span>
            </div>
            <span className="text-xs font-black sm:hidden flex items-center gap-1">
              <Bot className="w-4 h-4" /> AI Help
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="ai-chat-drawer"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden relative origin-bottom-right"
          >
            {/* Glossy Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 text-white flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner relative">
                  <Bot className="w-6 h-6 text-amber-300" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm font-['Outfit'] flex items-center gap-1.5">
                    Kisan AI Mitra
                    <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                      Ready
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-300 font-medium">Smart Land & Machinery Advisor</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="p-2.5 bg-slate-50 border-b border-slate-200/80 shrink-0 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-[10px] font-extrabold text-slate-700 hover:text-emerald-800 px-2.5 py-1 rounded-full whitespace-nowrap shadow-xs transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F8FAF6]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] p-3 rounded-2xl text-xs font-medium shadow-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none font-bold'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-semibold'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[9px] block mt-1 font-mono text-right ${
                        msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400 font-bold p-2 bg-white/60 rounded-xl border border-slate-200 w-fit">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>Kisan AI is typing...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                placeholder="Ask about machinery, rent or Escrow..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 bg-slate-100 border border-slate-200 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none"
              />
              <button
                type="submit"
                disabled={!inputMsg.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white p-2.5 rounded-xl shadow transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
