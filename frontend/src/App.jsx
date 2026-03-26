import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Chatbot from './pages/Chatbot'
import DiseaseDetection from './pages/DiseaseDetection'
import Weather from './pages/Weather'
import Community from './pages/Community'

function PrivateRoute({ children }) {
    const { user, loading } = useAuth()
    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
            <div className="spinner" />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading Farm AI…</p>
        </div>
    )
    return user ? children : <Navigate to="/auth" replace />
}

function PublicRoute({ children }) {
    const { user, loading } = useAuth()
    if (loading) return null
    return user ? <Navigate to="/dashboard" replace /> : children
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
            <Route element={<Layout />}>
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/ai" element={<PrivateRoute><Chatbot /></PrivateRoute>} />
                <Route path="/disease" element={<PrivateRoute><DiseaseDetection /></PrivateRoute>} />
                <Route path="/weather" element={<PrivateRoute><Weather /></PrivateRoute>} />
                <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <AppRoutes />
            <Toaster
                position="top-right"
                toastOptions={{
                    style: { fontFamily: 'Outfit, sans-serif', fontSize: '0.875rem', borderRadius: '12px' },
                    success: { style: { border: '1px solid #d1fae5', background: '#f0fdf4' } },
                    error: { style: { border: '1px solid #ffe4e6', background: '#fff5f5' } }
                }}
            />
        </AuthProvider>
    )
}
