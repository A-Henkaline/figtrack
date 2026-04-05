import React, { useState } from 'react'

export default function Settings() {
  const [email, setEmail] = useState(localStorage.getItem('ft_email') || '')
  const [saved, setSaved] = useState(false)

  function save() {
    localStorage.setItem('ft_email', email)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="page">
      <div style={{ padding: '54px 20px 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 400, letterSpacing: '-0.4px', marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>FigTrack preferences</p>
      </div>

      <div style={{ padding: '0 20px' }}>
        <div style={{ borderRadius: 14, border: '0.5px solid var(--gray-100)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--gray-50)' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 2 }}>Email reminders</div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Get notified 5 days before each care window opens</div>
          </div>
          <div style={{ padding: '14px 16px' }}>
            <div className="field-label">Your email address</div>
            <input
              className="field-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <button className="btn-primary" onClick={save}>
              {saved ? '✓ Saved!' : 'Save email'}
            </button>
          </div>
        </div>

        <div style={{ borderRadius: 14, border: '0.5px solid var(--gray-100)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--gray-50)' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-900)' }}>Location</div>
          </div>
          <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14 }}>Western New York</div>
            <span className="badge badge-ok">Zone 6a/6b</span>
          </div>
        </div>

        <div style={{ borderRadius: 14, border: '0.5px solid var(--gray-100)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--gray-50)' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-900)' }}>About</div>
          </div>
          {[
            ['App', 'FigTrack v1.0'],
            ['Built with', 'React + Supabase'],
            ['Owner', 'Adam'],
          ].map(([label, val]) => (
            <div key={label} style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--gray-50)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>{label}</span>
              <span style={{ fontSize: 14 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
