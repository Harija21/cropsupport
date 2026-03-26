import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ name: '', username: '', password: '', location: '' })
    const [error, setError] = useState('')
    const { login, register } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm(p => ({ ...p, [e.target.name]: e.target.value }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            if (isLogin) {
                await login(form.username, form.password)
                toast.success('Welcome back! 🌾')
            } else {
                if (!form.name || !form.username || !form.password) {
                    setError('Please fill in all required fields.')
                    return
                }
                await register(form)
                toast.success('Account created! Welcome to Farm AI 🌱')
            }
            navigate('/dashboard')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            {/* Left Panel - Visual */}
            <div className="auth-left">
                <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000&h=1200&fit=crop&q=85" alt="Farmland" />
                <div className="auth-left-content">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>🌱</div>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff' }}>Farm AI</span>
                    </div>
                    <h2>Cultivating the Future of Smart Farming</h2>
                    <p>Join thousands of farmers who use AI-powered insights to grow better crops, detect diseases early, and make data-driven decisions.</p>
                    <div className="auth-features">
                        {[
                            'AI-powered crop disease detection',
                            'Real-time weather farming advisory',
                            'Region-specific AI agronomist',
                            'Connect with local farmer community'
                        ].map(f => (
                            <div className="auth-feature" key={f}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                {f}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="auth-right">
                <div className="auth-form-box animate-fadeUp">
                    {/* Logo */}
                    <div className="auth-logo">
                        <div className="auth-logo-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 1 2.1 3.5c-1.3.5-2.4.5-3.4 0-1.1-.6-1.9-1.7-2.5-3.1 1.8-.4 2.9 0 3.8-.4z" />
                            </svg>
                        </div>
                        <div>
                            <h1>Farm AI</h1>
                            <span>by CropSupport</span>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="auth-title">
                        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                        <p>{isLogin ? 'Sign in to your Farm AI account' : 'Start your smart farming journey today'}</p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="name">Full Name *</label>
                                <input id="name" name="name" className="form-control" placeholder="e.g. Ravi Kumar" value={form.name} onChange={handleChange} required={!isLogin} />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="username">Username *</label>
                            <input id="username" name="username" className="form-control" placeholder="your_username" value={form.username} onChange={handleChange} required autoComplete="username" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password *</label>
                            <input id="password" name="password" type="password" className="form-control" placeholder={isLogin ? '••••••••' : 'Min. 6 characters'} value={form.password} onChange={handleChange} required autoComplete={isLogin ? 'current-password' : 'new-password'} />
                        </div>

                        {!isLogin && (
                            <div className="form-group">
                                <label htmlFor="location">Your Location (for personalized advice)</label>
                                <input id="location" name="location" className="form-control" placeholder="e.g. Punjab, India or Iowa, USA" value={form.location} onChange={handleChange} />
                            </div>
                        )}

                        <button id="auth-submit-btn" type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                                    {isLogin ? 'Signing in…' : 'Creating account…'}
                                </>
                            ) : (isLogin ? 'Sign In →' : 'Create Account →')}
                        </button>
                    </form>

                    <div className="auth-toggle">
                        {isLogin ? "Don't have an account? " : 'Already have an account? '}
                        <button onClick={() => { setIsLogin(!isLogin); setError('') }}>
                            {isLogin ? 'Sign up free' : 'Sign in'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
