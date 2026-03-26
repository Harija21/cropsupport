import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function SproutIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 1 2.1 3.5c-1.3.5-2.4.5-3.4 0-1.1-.6-1.9-1.7-2.5-3.1 1.8-.4 2.9 0 3.8-.4z" />
        </svg>
    )
}

function NavIcon({ name }) {
    const icons = {
        dashboard: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>,
        ai: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>,
        disease: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>,
        weather: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="M20 12h2" /><path d="m19.07 4.93-1.41 1.41" /><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" /><path d="M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.2" /><path d="M2 20h20" /><path d="M4 20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" /></svg>,
        community: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
        logout: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>,
        menu: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" /></svg>,
        close: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    }
    return icons[name] || null
}

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/ai', label: 'AI Advisor', icon: 'ai' },
    { path: '/disease', label: 'Crop Disease', icon: 'disease' },
    { path: '/weather', label: 'Weather', icon: 'weather' },
    { path: '/community', label: 'Community', icon: 'community' },
]

export default function Layout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleLogout = () => { logout(); navigate('/') }
    const handleNav = (path) => { navigate(path); setMobileOpen(false) }

    return (
        <div className="app-layout">
            {/* Mobile Header */}
            <header className="mobile-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div className="sidebar-logo-icon" style={{ width: 32, height: 32, borderRadius: 8 }}>
                        <SproutIcon />
                    </div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>Farm AI</span>
                </div>
                <button className="hamburger" onClick={() => setMobileOpen(true)}>
                    <NavIcon name="menu" />
                </button>
            </header>

            {/* Mobile Overlay */}
            <div className={`mobile-overlay${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(false)}>
                <div onClick={e => e.stopPropagation()}>
                    <SidebarContent user={user} pathname={pathname} handleNav={handleNav} handleLogout={handleLogout} onClose={() => setMobileOpen(false)} isMobile />
                </div>
            </div>

            {/* Desktop Sidebar */}
            <aside className={`sidebar${mobileOpen ? ' open' : ''}`}>
                <SidebarContent user={user} pathname={pathname} handleNav={handleNav} handleLogout={handleLogout} />
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

function SidebarContent({ user, pathname, handleNav, handleLogout, onClose, isMobile }) {
    return (
        <div className="sidebar" style={isMobile ? { transform: 'none', position: 'relative', width: 270, height: '100vh', borderRight: 'none' } : {}}>
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon"><SproutIcon /></div>
                <div className="sidebar-logo-text">
                    <h2>Farm AI</h2>
                    <span>by CropSupport</span>
                </div>
                {isMobile && (
                    <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', padding: 4 }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                )}
            </div>

            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <button
                        key={item.path}
                        className={`nav-item${pathname === item.path ? ' active' : ''}`}
                        onClick={() => handleNav(item.path)}
                    >
                        <NavIcon name={item.icon} />
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                {user && (
                    <div className="user-card">
                        <div className="user-avatar">{user.name?.charAt(0)?.toUpperCase()}</div>
                        <div className="user-info">
                            <p>{user.name}</p>
                            <span>{user.location || 'No location set'}</span>
                        </div>
                    </div>
                )}
                <button className="logout-btn" onClick={handleLogout}>
                    <NavIcon name="logout" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}
