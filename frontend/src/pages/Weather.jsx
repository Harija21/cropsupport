import { useEffect, useState } from 'react'
import { api } from '../api'

function WeatherIcon({ condition }) {
    const icons = {
        Sunny: '☀️', Rainy: '🌧️', Cloudy: '⛅', default: '🌤️'
    }
    return <span style={{ fontSize: '3rem' }}>{icons[condition] || icons.default}</span>
}

export default function Weather() {
    const [weather, setWeather] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        api.getWeather()
            .then(d => setWeather(d))
            .catch(e => setError(e.message))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '5rem' }}>
            <div className="spinner" />
        </div>
    )

    if (error) return <div className="alert alert-error">{error}</div>

    const condIcon = { Sunny: '☀️', Rainy: '🌧️', Cloudy: '⛅' }

    return (
        <div>
            <div className="page-header animate-fadeUp">
                <h1>Weather Advisory</h1>
                <p>Real-time weather conditions with AI-generated farming recommendations.</p>
            </div>

            {weather && (
                <>
                    {/* Main Weather Card */}
                    <div className="weather-hero animate-fadeUp delay-1">
                        <div className="weather-main">
                            <div>
                                <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.5rem' }}>📍 {weather.location}</p>
                                <div className="weather-temp">{weather.temp}°C</div>
                                <p style={{ fontSize: '1.1rem', marginTop: '0.5rem', opacity: 0.9 }}>{weather.condition}</p>
                                <div className="weather-meta">
                                    <div className="weather-meta-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" /></svg>
                                        Humidity: {weather.humidity}%
                                    </div>
                                    <div className="weather-meta-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" /><path d="M9.6 4.6A2 2 0 1 1 11 8H2" /><path d="M12.6 19.4A2 2 0 1 0 14 16H2" /></svg>
                                        Wind: {weather.windSpeed} km/h
                                    </div>
                                </div>
                            </div>
                            <div className="weather-icon-big">
                                <WeatherIcon condition={weather.condition} />
                            </div>
                        </div>
                    </div>

                    {/* Suggestion Box */}
                    <div className="suggestion-box animate-fadeUp delay-2" style={{ marginBottom: '1.5rem' }}>
                        <div className="suggestion-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                            </svg>
                        </div>
                        <div>
                            <h4>Farming Advisory for Today</h4>
                            <p>{weather.suggestion}</p>
                        </div>
                    </div>

                    {/* 5-Day Forecast */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: '1rem' }}>5-Day Forecast</h2>
                        <div className="forecast-grid animate-fadeUp delay-3">
                            {weather.forecast?.map((f, i) => (
                                <div className="forecast-card" key={i}>
                                    <div className="day">{f.day}</div>
                                    <span style={{ fontSize: '1.8rem' }}>{condIcon[f.condition] || '🌤️'}</span>
                                    <div className="temp">{f.temp}°C</div>
                                    <div className="cond">{f.condition}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Farming Tips */}
                    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '1.75rem' }} className="animate-fadeUp delay-4">
                        <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-body)', fontWeight: 700, marginBottom: '1.25rem' }}>Seasonal Farming Tips 🌾</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                            {[
                                { icon: '💧', tip: 'Water crops early morning (5-8 AM) to minimize evaporation.' },
                                { icon: '🧪', tip: 'Apply fertilizers after light rain for better absorption.' },
                                { icon: '🌿', tip: 'Check soil moisture before each irrigation cycle.' },
                                { icon: '🐛', tip: 'Inspect crops weekly for early pest or disease signs.' },
                            ].map((t, i) => (
                                <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', background: 'rgba(45,106,79,0.04)', borderRadius: 'var(--radius)', border: '1px solid rgba(45,106,79,0.1)' }}>
                                    <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{t.icon}</span>
                                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{t.tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
