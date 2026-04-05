import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { VARIETIES } from '../lib/careCalendar'

export default function AddTree() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    variety: '',
    date_planted: '',
    location_on_property: '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  async function save() {
    if (!form.name.trim()) { setError('Give your tree a nickname.'); return }
    if (!form.variety) { setError('Select a variety.'); return }
    setSaving(true)
    setError('')
    const { error: err } = await supabase.from('trees').insert({
      name: form.name.trim(),
      variety: form.variety,
      date_planted: form.date_planted || null,
      location_on_property: form.location_on_property.trim() || null,
      notes: form.notes.trim() || null,
    })
    if (err) { setError(err.message); setSaving(false); return }
    navigate('/trees')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Header */}
      <div style={{ padding: '54px 20px 16px', borderBottom: '0.5px solid var(--gray-50)' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'var(--green-700)', fontSize: 13, marginBottom: 14 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Cancel
        </button>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 400, letterSpacing: '-0.3px' }}>Add a tree</h1>
      </div>

      <div style={{ padding: '20px 20px 40px' }}>
        {/* Nickname */}
        <div style={{ marginBottom: 18 }}>
          <div className="field-label">Nickname *</div>
          <input
            className="field-input"
            type="text"
            placeholder="e.g. Back Yard Big Boy"
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
        </div>

        {/* Variety */}
        <div style={{ marginBottom: 18 }}>
          <div className="field-label">Variety *</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
            {VARIETIES.map(v => (
              <button
                key={v}
                onClick={() => set('variety', v)}
                style={{
                  border: form.variety === v ? '1.5px solid var(--green-700)' : '0.5px solid var(--gray-100)',
                  borderRadius: 10, padding: '10px 12px', fontSize: 13,
                  background: form.variety === v ? 'var(--green-50)' : '#fff',
                  color: form.variety === v ? 'var(--green-700)' : 'var(--gray-700)',
                  textAlign: 'left', transition: 'all 0.1s',
                }}
              >{v}</button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div style={{ marginBottom: 18 }}>
          <div className="field-label">Location on property</div>
          <input
            className="field-input"
            type="text"
            placeholder="e.g. Back yard, south-facing wall"
            value={form.location_on_property}
            onChange={e => set('location_on_property', e.target.value)}
          />
        </div>

        {/* Date planted */}
        <div style={{ marginBottom: 18 }}>
          <div className="field-label">Date planted (approximate)</div>
          <input
            className="field-input"
            type="date"
            value={form.date_planted}
            onChange={e => set('date_planted', e.target.value)}
          />
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 24 }}>
          <div className="field-label">Notes</div>
          <textarea
            className="field-input"
            rows={3}
            placeholder="Anything worth remembering — where you got it, its size, special conditions…"
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            style={{ resize: 'none' }}
          />
        </div>

        {error && <div style={{ background: 'var(--coral-50)', color: 'var(--coral-700)', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 14 }}>{error}</div>}

        <button className="btn-primary" onClick={save} disabled={saving}>
          {saving ? 'Saving…' : 'Save tree'}
        </button>
      </div>
    </div>
  )
}
