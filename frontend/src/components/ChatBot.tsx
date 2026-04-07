"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import { MessageCircle, X, Send, Bot, User, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { authService, walletService } from '../lib/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatBot() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize messages from local storage
    useEffect(() => {
        const saved = localStorage.getItem('befin_chat_history');
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error("Could not parse saved chat history.");
            }
        } else {
            setMessages([
                { role: 'assistant', content: "Hi there! I'm the Befin Assistant. How can I help you with your financial journey today?" }
            ]);
        }
    }, []);

    // Fetch context data
    useEffect(() => {
        const fetchContext = async () => {
            try {
                const profile = await authService.getProfile();
                const wallet = await walletService.getBalance();
                
                // Exclude sensitive things, though profile likely doesn't have password. 
                // We just pass relevant data.
                setUserData({
                    username: profile?.username || profile?.name,
                    wallet_balance: wallet?.balance,
                });
            } catch (err) {
                // User might not be logged in, ignore silently.
            }
        };

        fetchContext();
    }, []);

    // Auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Format chat history for LLM
    const getFormattedHistory = () => {
        // limit to last 6 messages to save tokens
        return messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
    };

    const clearHistory = () => {
        const initial = [{ role: 'assistant', content: "Hi there! I'm the Befin Assistant. How can I help you with your financial journey today?" }];
        setMessages(initial as Message[]);
        localStorage.setItem('befin_chat_history', JSON.stringify(initial));
    };

    const getLocalResponse = (query: string) => {
        const lower = query.toLowerCase();
        if (lower.includes('coin') || lower.includes('befin coin')) {
            return "Befin Coins are our virtual currency! You can earn them by achieving your goals and playing educational games.";
        }
        if (lower.includes('refer') || lower.includes('friend')) {
            return "Referring friends gets you 100 Befin Coins guaranteed. You can generate your code in the Dashboard!";
        }
        return "I'm having trouble connecting to my brain right now, but I'm here to help you learn about BeFin! Please try asking something else or try again later.";
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: input.trim() };
        const newMessages = [...messages, userMessage];
        
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: getFormattedHistory(),
                    userData
                })
            });

            if (!res.ok) {
                throw new Error("API Route Failed");
            }

            const data = await res.json();
            const botMessage: Message = { role: 'assistant', content: data.reply };
            const finalMessages = [...newMessages, botMessage];
            
            setMessages(finalMessages);
            localStorage.setItem('befin_chat_history', JSON.stringify(finalMessages));
        } catch (error) {
            const botFallback: Message = { role: 'assistant', content: getLocalResponse(userMessage.content) };
            const finalMessages = [...newMessages, botFallback];
            
            setMessages(finalMessages);
            localStorage.setItem('befin_chat_history', JSON.stringify(finalMessages));
        } finally {
            setLoading(false);
        }
    };

    if (pathname === '/login' || pathname === '/signup') {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform hover:scale-105"
                >
                    <MessageCircle size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="w-[350px] sm:w-[400px] h-[500px] bg-[#111115] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="bg-[#18181c] p-4 flex items-center justify-between border-b border-white/5">
                        <div className="ps-2">
                            <h3 className="text-white font-bold text-sm">Befin Assistant</h3>
                            <p className="text-slate-400 text-xs">Learn. Play. Earn.</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={clearHistory} className="text-slate-400 hover:text-white p-1">
                                <Trash2 size={18} />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-800'}`}>
                                    {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                                </div>
                                <div className={`p-3 rounded-2xl text-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                                    : 'bg-[#1e1e24] text-slate-200 rounded-tl-sm border border-white/5'
                                }`}>
                                    {msg.role === 'assistant' ? (
                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <ReactMarkdown>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        <p>{msg.content}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-3 max-w-[85%] self-start">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-slate-800">
                                    <Bot size={16} className="text-white" />
                                </div>
                                <div className="p-3 bg-[#1e1e24] rounded-2xl rounded-tl-sm border border-white/5 text-sm text-slate-400 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-[#18181c] border-t border-white/5">
                        <div className="flex items-center gap-2 bg-[#121216] border border-white/10 rounded-full p-1 pl-4">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about finance or BeFin..."
                                className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-400 text-white rounded-full flex items-center justify-center transition-colors shrink-0"
                            >
                                <Send size={18} className={input.trim() && !loading ? "translate-x-[-1px] translate-y-[1px]" : ""} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
