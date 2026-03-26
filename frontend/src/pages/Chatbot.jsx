import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'

const suggestions = [
    'What crops should I plant this month?',
    'How do I treat aphids on tomato plants?',
    'When should I irrigate my wheat crop?',
    'Best organic fertilizer for rice farming?',
]

export default function Chatbot() {
    const { user } = useAuth()
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef(null)

    useEffect(() => {
        api.chatHistory().then(history => {
            const msgs = history.flatMap(q => [
                { role: 'user', text: q.question, time: new Date(q.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
                { role: 'ai', text: q.answer, time: new Date(q.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
            ])
            setMessages(msgs)
        }).catch(() => { })
    }, [])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async (text) => {
        const q = text || input.trim()
        if (!q || loading) return
        setInput('')
        const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        setMessages(p => [...p, { role: 'user', text: q, time: now }])
        setLoading(true)
        try {
            const res = await api.chat(q)
            setMessages(p => [...p, { role: 'ai', text: res.answer, time: now }])
        } catch (err) {
            toast.error(err.message || 'AI response failed')
            setMessages(p => [...p, { role: 'ai', text: '⚠️ Sorry, I encountered an error. Please check your API key and try again.', time: now }])
        } finally {
            setLoading(false)
        }
    }

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
    }

    return (
        <div>
            <div className="page-header animate-fadeUp">
                <h1>AI Farm Advisor</h1>
                <p>Ask any farming question and get region-specific, expert advice instantly.</p>
            </div>

            <div className="chat-wrapper animate-fadeUp delay-1">
                {/* Chat Header */}
                <div className="chat-header">
                    <div className="chat-header-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
                        </svg>
                    </div>
                    <div>
                        <h2>Farm AI Advisor</h2>
                        <p>📍 {user?.location || 'Set location for personalized advice'} · Powered by Gemini AI</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <div className="chat-empty">
                            <div className="chat-empty-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: 34, height: 34, color: 'var(--primary)' }}>
                                    <path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
                                </svg>
                            </div>
                            <h3>Ask your AI Farm Advisor</h3>
                            <p>Get instant advice on crops, diseases, weather, and more — tailored to your location.</p>
                            <div className="chat-suggestion-chips">
                                {suggestions.map(s => (
                                    <button key={s} className="chip" onClick={() => sendMessage(s)}>{s}</button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, i) => (
                                <div key={i} className={`message ${msg.role}`}>
                                    <div className="message-avatar">
                                        {msg.role === 'user' ? user?.name?.charAt(0)?.toUpperCase() : '🌾'}
                                    </div>
                                    <div>
                                        <div className="message-bubble">
                                            {msg.role === 'ai' ? <ReactMarkdown>{msg.text}</ReactMarkdown> : msg.text}
                                        </div>
                                        <div className="message-time">{msg.time}</div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="message ai">
                                    <div className="message-avatar">🌾</div>
                                    <div className="message-bubble" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Thinking…</span>
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </>
                    )}
                </div>

                {/* Input */}
                <div className="chat-footer">
                    <div className="chat-input-row">
                        <textarea
                            id="chat-input"
                            className="chat-input"
                            rows={1}
                            placeholder="Ask about crops, diseases, weather, planting tips…"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            disabled={loading}
                        />
                        <button id="chat-send-btn" className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" x2="11" y1="2" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
