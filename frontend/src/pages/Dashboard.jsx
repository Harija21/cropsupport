import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'

export default function Dashboard() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [chatCount, setChatCount] = useState('—')
    const [diseaseCount, setDiseaseCount] = useState('—')
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        api.chatHistory().then(d => setChatCount(d.length)).catch(() => { })
        api.diseaseHistory().then(d => setDiseaseCount(d.length)).catch(() => { })
        api.getWeather().then(d => setWeather(d)).catch(() => { })
    }, [])

    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

    const stats = [
        { icon: '💬', bg: '#d1fae5', text: '#2d6a4f', value: chatCount, label: 'AI Queries Asked' },
        { icon: '🔬', bg: '#fce7f3', text: '#be185d', value: diseaseCount, label: 'Crop Scans Done' },
        { icon: '🌡️', bg: '#dbeafe', text: '#2563eb', value: weather ? `${weather.temp}°C` : '—', label: weather?.condition || 'Weather' },
    ]

    const quickActions = [
        { icon: '🤖', bg: '#d1fae5', color: '#2d6a4f', title: 'Ask AI Advisor', desc: 'Get instant farming guidance', path: '/ai' },
        { icon: '📸', bg: '#fce7f3', color: '#be185d', title: 'Scan Crop Disease', desc: 'Upload leaf image for diagnosis', path: '/disease' },
        { icon: '☁️', bg: '#dbeafe', color: '#2563eb', title: 'Check Weather', desc: 'View farming weather advisory', path: '/weather' },
        { icon: '👥', bg: '#fef3c7', color: '#b45309', title: 'Community', desc: 'Connect with local farmers', path: '/community' },
    ]

    return (
        <div>
            <div className="page-header animate-fadeUp">
                <h1>{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
                <p>
                    📍 {user?.location || 'Set your location in profile'} &nbsp;·&nbsp;
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>

            {/* Stats */}
            <div className="dashboard-grid animate-fadeUp delay-1">
                {stats.map((s, i) => (
                    <div className="dash-card" key={i}>
                        <div className="dash-card-icon" style={{ background: s.bg }}>
                            <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                        </div>
                        <div className="dash-card-info">
                            <h3 style={{ color: s.text }}>{s.value}</h3>
                            <p>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Weather Suggestion */}
            {weather && (
                <div className="suggestion-box animate-fadeUp delay-2" style={{ marginBottom: '2rem' }}>
                    <div className="suggestion-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" />
                        </svg>
                    </div>
                    <div>
                        <h4>Today's Farming Advisory</h4>
                        <p>{weather.suggestion}</p>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>Quick Actions</h2>
            <div className="quick-actions animate-fadeUp delay-3">
                {quickActions.map((a, i) => (
                    <div className="action-card" key={i} onClick={() => navigate(a.path)}>
                        <div className="action-icon" style={{ background: a.bg }}>
                            <span style={{ fontSize: '1.6rem' }}>{a.icon}</span>
                        </div>
                        <div>
                            <h3>{a.title}</h3>
                            <p>{a.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
