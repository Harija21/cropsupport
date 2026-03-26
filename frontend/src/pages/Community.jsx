import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'
import toast from 'react-hot-toast'

export default function Community() {
    const { user } = useAuth()
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [posting, setPosting] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ title: '', content: '' })

    useEffect(() => {
        api.getPosts()
            .then(data => setPosts(data))
            .catch(() => toast.error('Failed to load posts'))
            .finally(() => setLoading(false))
    }, [])

    const handlePost = async (e) => {
        e.preventDefault()
        if (!form.title.trim() || !form.content.trim()) return toast.error('Please fill all fields')
        setPosting(true)
        try {
            const post = await api.createPost(form)
            setPosts(p => [post, ...p])
            setForm({ title: '', content: '' })
            setShowForm(false)
            toast.success('Post shared with the community! 🌾')
        } catch (err) {
            toast.error(err.message)
        } finally {
            setPosting(false)
        }
    }

    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date)
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return 'Just now'
        if (mins < 60) return `${mins}m ago`
        const hrs = Math.floor(mins / 60)
        if (hrs < 24) return `${hrs}h ago`
        return Math.floor(hrs / 24) + 'd ago'
    }

    return (
        <div>
            <div className="page-header animate-fadeUp" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1>Farmer Community</h1>
                    <p>Connect, share knowledge, and grow together with farmers worldwide.</p>
                </div>
                <button id="new-post-btn" className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Cancel' : '+ Share a Post'}
                </button>
            </div>

            {/* Post Form */}
            {showForm && (
                <form className="post-form animate-fadeUp" onSubmit={handlePost}>
                    <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Share with the Community</h3>
                    <div className="form-group">
                        <label htmlFor="post-title">Title *</label>
                        <input id="post-title" className="form-control" placeholder="e.g. Best time to plant corn this season?"
                            value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="post-content">Content *</label>
                        <textarea id="post-content" className="form-control" rows={4} placeholder="Share your experience, question, or tip…"
                            value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required
                            style={{ resize: 'vertical' }} />
                    </div>
                    <button id="post-submit-btn" type="submit" className="btn btn-primary" disabled={posting}>
                        {posting ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Posting…</> : '🌾 Share Post'}
                    </button>
                </form>
            )}

            {/* Posts List */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '3rem' }}>
                    <div className="spinner" />
                </div>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                    <span style={{ fontSize: '3rem' }}>🌱</span>
                    <p style={{ fontWeight: 600, color: 'var(--text)', marginTop: '1rem' }}>No posts yet!</p>
                    <p style={{ fontSize: '0.875rem' }}>Be the first to share with the community.</p>
                </div>
            ) : (
                <div className="animate-fadeUp delay-1">
                    {posts.map(post => (
                        <div className="post-card" key={post._id}>
                            <div className="post-card-header">
                                <div className="post-avatar">{post.authorName?.charAt(0)?.toUpperCase()}</div>
                                <div className="post-meta">
                                    <strong>{post.authorName}</strong>
                                    <span>{timeAgo(post.createdAt)}</span>
                                </div>
                            </div>
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
