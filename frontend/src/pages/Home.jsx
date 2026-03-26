import { useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate()

    const stats = [
        { icon: '🌍', value: '10K+', label: 'Active Farmers', color: '#2d6a4f', bg: '#d1fae5' },
        { icon: '💬', value: '50K+', label: 'AI Queries Answered', color: '#2563eb', bg: '#dbeafe' },
        { icon: '📊', value: '98%', label: 'Accuracy Rate', color: '#7c3aed', bg: '#ede9fe' },
        { icon: '🌾', value: '15+', label: 'Crop Types', color: '#d97706', bg: '#fef3c7' },
    ]

    const features = [
        {
            cls: 'green',
            icon: '🤖',
            badge: { text: 'Most Used', color: '#2d6a4f', bg: '#d1fae5' },
            title: 'AI Agronomist',
            desc: 'Ask any farming question and get instant, region-specific expert advice powered by Google Gemini AI.',
            linkColor: '#2d6a4f',
            path: '/ai'
        },
        {
            cls: 'rose',
            icon: '🔬',
            badge: { text: 'AI Powered', color: '#be185d', bg: '#fce7f3' },
            title: 'Crop Disease Detection',
            desc: 'Upload a photo of any diseased crop leaf — AI instantly diagnoses the problem and prescribes treatments.',
            linkColor: '#be185d',
            path: '/disease'
        },
        {
            cls: 'sky',
            icon: '☀️',
            badge: { text: 'Real-time', color: '#1d4ed8', bg: '#dbeafe' },
            title: 'Smart Weather Advisory',
            desc: 'Location-based weather insights with AI-generated farming recommendations for your specific region.',
            linkColor: '#1d4ed8',
            path: '/weather'
        },
        {
            cls: 'amber',
            icon: '👥',
            badge: { text: 'Community', color: '#b45309', bg: '#fef3c7' },
            title: 'Farmer Network',
            desc: 'Connect with farmers in your region, share tips, and grow together as a thriving community.',
            linkColor: '#b45309',
            path: '/community'
        },
    ]

    const steps = [
        { num: '01', icon: '🌱', title: 'Create Your Profile', desc: 'Sign up and set your location to get personalized advice.' },
        { num: '02', icon: '💬', title: 'Ask Your AI Advisor', desc: 'Type any farming question about crops, diseases, or weather.' },
        { num: '03', icon: '📸', title: 'Scan Your Crops', desc: 'Photograph any leaf issue for instant AI disease diagnosis.' },
        { num: '04', icon: '📈', title: 'Monitor & Grow', desc: 'Track your history and community insights to maximize yield.' },
    ]

    const testimonials = [
        { name: 'Ravi Kumar', role: 'Wheat Farmer · Punjab, India', text: 'Farm AI identified a fungal infection in my wheat crop before it spread. Saved my entire harvest!', initial: 'R' },
        { name: 'Sarah Chen', role: 'Soybean Farmer · Iowa, USA', text: 'The AI gives region-specific advice — it mentioned local soil conditions I didn\'t even ask about!', initial: 'S' },
        { name: 'James Okafor', role: 'Cassava Farmer · Nigeria', text: 'Weather advisories helped me time irrigation perfectly. Water usage down 30% this season.', initial: 'J' },
    ]

    return (
        <div className="landing">
            {/* HERO */}
            <section className="hero animate-fadeIn">
                <div className="hero-bg">
                    <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1600&h=900&fit=crop&q=85" alt="Lush farmland" />
                </div>
                <div className="hero-content">
                    <div className="hero-badge animate-fadeUp">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                        Powered by Google Gemini AI
                    </div>
                    <h1 className="animate-fadeUp delay-1">
                        Farm Smarter.<br />
                        <span className="highlight">Grow Better.</span>
                    </h1>
                    <p className="animate-fadeUp delay-2">
                        Farm AI is your always-on agricultural intelligence platform — delivering real-time crop disease detection, weather advisory, and AI-powered guidance for every farmer, everywhere.
                    </p>
                    <div className="hero-actions animate-fadeUp delay-3">
                        <button className="btn btn-white btn-lg" onClick={() => navigate('/auth')}>
                            Start Farming Smarter →
                        </button>
                        <button className="btn btn-lg" style={{ border: '2px solid rgba(255,255,255,0.35)', color: '#fff', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}
                            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
                            See Features
                        </button>
                    </div>
                    <div className="hero-trust animate-fadeUp delay-4">
                        {['Free to Start', 'No Credit Card', 'AI-Powered'].map(t => (
                            <div className="trust-item" key={t}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                {t}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="scroll-hint animate-bounce">
                    <span>Scroll</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                </div>
            </section>

            {/* STATS */}
            <div className="stats-grid">
                {stats.map((s, i) => (
                    <div className="stat-card animate-fadeUp" key={i} style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                        <div className="stat-icon" style={{ background: s.bg }}>
                            <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                        </div>
                        <h3 style={{ color: s.color }}>{s.value}</h3>
                        <p>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* FEATURES */}
            <section id="features" style={{ marginBottom: '5rem' }}>
                <div className="section-title">
                    <div className="section-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                        Powerful AI Tools
                    </div>
                    <h2>Everything You Need to <span style={{ color: 'var(--primary)' }}>Grow</span></h2>
                    <p>Four AI-driven tools built specifically for modern farmers.</p>
                </div>
                <div className="features-grid">
                    {features.map((f, i) => (
                        <div className={`feature-card ${f.cls} animate-fadeUp`} key={i} onClick={() => navigate('/auth')}
                            style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                            <div className="feature-header">
                                <div className="feature-icon" style={{ background: f.badge.bg, fontSize: '1.6rem' }}>{f.icon}</div>
                                <span className="feature-badge" style={{ color: f.badge.color, background: f.badge.bg }}>{f.badge.text}</span>
                            </div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                            <div className="feature-link" style={{ color: f.linkColor }}>
                                Try it free
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" x2="19" y1="12" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section style={{ marginBottom: '5rem' }}>
                <div className="section-title">
                    <h2>How Farm AI Works</h2>
                    <p>Get started in minutes. No technical knowledge required.</p>
                </div>
                <div className="steps-grid">
                    {steps.map((s, i) => (
                        <div className="step animate-fadeUp" key={i} style={{ animationDelay: `${i * 0.12}s`, opacity: 0 }}>
                            <div className="step-icon"><span style={{ fontSize: '2rem' }}>{s.icon}</span></div>
                            <div className="step-number">{s.num}</div>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section style={{ marginBottom: '5rem' }}>
                <div className="section-title">
                    <h2>Loved by Farmers Worldwide</h2>
                </div>
                <div className="testimonials-grid">
                    {testimonials.map((t, i) => (
                        <div className="testimonial-card animate-fadeUp" key={i} style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                            <div className="stars">
                                {[...Array(5)].map((_, j) => (
                                    <svg key={j} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" />
                                    </svg>
                                ))}
                            </div>
                            <blockquote>"{t.text}"</blockquote>
                            <div className="testimonial-author">
                                <div className="author-avatar">{t.initial}</div>
                                <div className="author-info">
                                    <strong>{t.name}</strong>
                                    <span>{t.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <div className="cta-banner animate-fadeUp" style={{ opacity: 0, animationDelay: '0.2s' }}>
                <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1400&h=400&fit=crop&q=85" alt="Farmer in field" />
                <div className="cta-overlay">
                    <h2>Ready to Transform Your Farm?</h2>
                    <p>Join thousands of farmers already using Farm AI to increase yields, reduce losses, and farm smarter.</p>
                    <button className="btn btn-white btn-lg" onClick={() => navigate('/auth')}>
                        Get Started Free →
                    </button>
                </div>
            </div>
        </div>
    )
}
