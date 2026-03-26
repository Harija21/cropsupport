import { useState, useRef } from 'react'
import { api } from '../api'
import ReactMarkdown from 'react-markdown'
import toast from 'react-hot-toast'

export default function DiseaseDetection() {
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [dragOver, setDragOver] = useState(false)
    const [history, setHistory] = useState(null)
    const inputRef = useRef()

    const handleFile = (f) => {
        if (!f) return
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
            toast.error('Please upload a JPEG, PNG, or WebP image')
            return
        }
        setFile(f)
        setResult(null)
        const reader = new FileReader()
        reader.onload = e => setPreview(e.target.result)
        reader.readAsDataURL(f)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragOver(false)
        handleFile(e.dataTransfer.files[0])
    }

    const handleDetect = async () => {
        if (!file) return
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('image', file)
            const res = await api.detectDisease(formData)
            setResult(res)
            toast.success('Analysis complete!')
        } catch (err) {
            toast.error(err.message || 'Detection failed. Check GEMINI_API_KEY.')
        } finally {
            setLoading(false)
        }
    }

    const loadHistory = async () => {
        try {
            const data = await api.diseaseHistory()
            setHistory(data)
        } catch { toast.error('Failed to load history') }
    }

    const isHealthy = result?.prediction?.toLowerCase().includes('healthy')

    return (
        <div>
            <div className="page-header animate-fadeUp">
                <h1>Crop Disease Detection</h1>
                <p>Upload a photo of your crop leaf — AI will diagnose diseases and suggest treatment.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="animate-fadeUp delay-1">
                {/* Upload Panel */}
                <div>
                    <div
                        className={`upload-zone${dragOver ? ' drag-over' : ''}`}
                        onClick={() => inputRef.current.click()}
                        onDrop={handleDrop}
                        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                        onDragLeave={() => setDragOver(false)}
                    >
                        <input id="file-input" ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
                            onChange={e => handleFile(e.target.files[0])} />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" />
                        </svg>
                        <h3>{preview ? 'Click to change image' : 'Upload Crop Leaf Image'}</h3>
                        <p>{preview ? file?.name : 'Drag & drop or click to browse · JPEG, PNG, WebP · Max 5MB'}</p>
                    </div>

                    {preview && (
                        <div style={{ marginTop: '1rem' }}>
                            <img src={preview} alt="Crop preview" className="preview-img" />
                            <button id="detect-btn" className="btn btn-primary" style={{ width: '100%' }}
                                onClick={handleDetect} disabled={loading}>
                                {loading ? (
                                    <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analyzing…</>
                                ) : '🔬 Detect Disease'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Result Panel */}
                <div>
                    {!result ? (
                        <div style={{ height: '100%', minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)', background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', padding: '2rem' }}>
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ marginBottom: '1rem' }} />
                                    <p style={{ fontWeight: 600 }}>Analyzing your crop image…</p>
                                    <p style={{ fontSize: '0.82rem', marginTop: '0.5rem' }}>This may take a few seconds</p>
                                </>
                            ) : (
                                <>
                                    <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</span>
                                    <p style={{ fontWeight: 600, color: 'var(--text)' }}>Upload an image to get started</p>
                                    <p style={{ fontSize: '0.85rem' }}>Results and treatment advice will appear here</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="result-card">
                            <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: '1rem' }}>Analysis Result</h3>
                            <div className={`prediction-badge ${isHealthy ? 'healthy' : 'disease'}`}>
                                {isHealthy ? '✅' : '⚠️'} {result.prediction}
                            </div>
                            <h4 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem', marginTop: '0.5rem' }}>Treatment Advice:</h4>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                                <ReactMarkdown>{result.advice}</ReactMarkdown>
                            </div>
                            <button className="btn btn-outline" style={{ marginTop: '1.5rem', width: '100%' }}
                                onClick={() => { setFile(null); setPreview(null); setResult(null) }}>
                                Scan Another Image
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* History */}
            <div style={{ marginTop: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-body)', fontWeight: 700 }}>Past Scans</h2>
                    <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }} onClick={loadHistory}>
                        Load History
                    </button>
                </div>
                {history !== null && (
                    history.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No past scans yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {history.map(r => (
                                <div key={r._id} className="card" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <img src={r.imageUrl} alt="crop" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} onError={e => e.target.style.display = 'none'} />
                                    <div>
                                        <div className={`prediction-badge ${r.prediction?.toLowerCase().includes('healthy') ? 'healthy' : 'disease'}`} style={{ marginBottom: '0.4rem' }}>
                                            {r.prediction}
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
