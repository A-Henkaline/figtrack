import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getTreeStatus, STATUS_CONFIG, getCurrentCareWindow } from '../lib/careCalendar'

export default function TreeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tree, setTree] = useState(null)
  const [healthLogs, setHealthLogs] = useState([])
  const [harvestLogs, setHarvestLogs] = useState([])
  const [tab, setTab] = useState('health')
  const [loading, setLoading] = useState(true)

  // Add health log
  const [newNote, setNewNote] = useState('')
  const [addingNote, setAddingNote] = useState(false)

  // Add harvest log
  const [harvestQty, setHarvestQty] = useState('')
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().slice(0, 10))
  const [harvestRating, setHarvestRating] = useState(3)
  const [harvestNote, setHarvestNote] = useState('')
  const [addingHarvest, setAddingHarvest] = useState(false)

  // AI chat
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const [treeRes, healthRes, harvestRes] = await Promise.all([
        supabase.from('trees').select('*').eq('id', id).single(),
        supabase.from('health_logs').select('*').eq('tree_id', id).order('log_date', { ascending: false }),
        supabase.from('harvest_logs').select('*').eq('tree_id', id).order('harvest_date', { ascending: false }),
      ])
      setTree(treeRes.data)
      setHealthLogs(healthRes.data || [])
      setHarvestLogs(harvestRes.data || [])
      setLoading(false)
    }
    load()
  }, [id])

  async function saveHealthLog() {
    if (!newNote.trim()) return
    setAddingNote(true)
    const { data } = await supabase.from('health_logs').insert({
      tree_id: id,
      log_date: new Date().toISOString().slice(0, 10),
      note: newNote.trim(),
    }).select().single()
    setHealthLogs(prev => [data, ...prev])
    setNewNote('')
    setAddingNote(false)
  }

  async function saveHarvestLog() {
    if (!harvestQty) return
    setAddingHarvest(true)
    const { data } = await supabase.from('harvest_logs').insert({
      tree_id: id,
      harvest_date: harvestDate,
      quantity: parseInt(harvestQty),
      quality_rating: harvestRating,
      notes: harvestNote.trim(),
    }).select().single()
    setHarvestLogs(prev => [data, ...prev])
    setHarvestQty('')
    setHarvestNote('')
    setAddingHarvest(false)
  }

  async function askAI() {
    if (!aiQuestion.trim() || !tree) return
    setAiLoading(true)
    setAiAnswer('')
    const care = getCurrentCareWindow()
    const totalFigs = harvestLogs.reduce((s, h) => s + (h.quantity || 0), 0)
    const prompt = `You are a fig tree expert helping someone in Western New York (Zone 6a/6b, cold winters). 
Here is the tree they're asking about:
- Name: ${tree.name}
- Variety: ${tree.variety}
- Location on property: ${tree.location_on_property || 'not specified'}
- Date planted: ${tree.date_planted || 'unknown'}
- Total figs harvested: ${totalFigs}
- Notes about this tree: ${tree.notes || 'none'}
- Current care window: ${care.task}
- Recent health logs: ${healthLogs.slice(0, 3).map(l => `${l.log_date}: ${l.note}`).join('; ') || 'none'}

The person asks: "${aiQuestion}"

Give a helpful, specific, practical answer in 2-4 sentences. Be conversational, not clinical.`

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const json = await res.json()
      setAiAnswer(json.content?.[0]?.text || 'Sorry, I couldn\'t get a response. Try again.')
    } catch {
      setAiAnswer('Network error — check your connection and try again.')
    }
    setAiLoading(false)
  }

  async function deleteTree() {
    if (!window.confirm(`Delete ${tree.name}? This cannot be undone.`)) return
    await supabase.from('trees').delete().eq('id', id)
    navigate('/trees')
  }

  if (loading) return <div className="loading">Loading tree…</div>
  if (!tree) return <div className="loading">Tree not found.</div>

  const status = getTreeStatus({ ...tree, health_logs: healthLogs })
  const cfg = STATUS_CONFIG[status]
  const totalFigs = harvestLogs.reduce((s, h) => s + (h.quantity || 0), 0)

  const TABS = ['health', 'harvest', 'ask']
  const TAB_LABELS = { health: 'Health log', harvest: 'Harvest', ask: 'Ask AI' }

  return (
    <div className="page">
      {/* Header */}
      <div style={{ background: 'var(--green-50)', padding: '54px 20px 20px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'var(--green-700)', fontSize: 13, marginBottom: 14 }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          All trees
        </button>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 400, letterSpacing: '-0.4px', marginBottom: 3 }}>{tree.name}</h1>
        <div style={{ fontSize: 13, color: 'var(--green-500)', marginBottom: 12 }}>{tree.variety}{tree.date_planted ? ` · Planted ${tree.date_planted}` : ''}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className={`badge badge-${status}`}>{cfg.label}</span>
          {tree.location_on_property && <span className="badge badge-dormant">{tree.location_on_property}</span>}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '14px 20px 0' }}>
        {[
          { label: 'Total figs', value: totalFigs },
          { label: 'Health logs', value: healthLogs.length },
          { label: 'Harvests', value: harvestLogs.length },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--gray-50)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: 'var(--gray-500)', marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 500 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, padding: '14px 20px 0', borderBottom: '0.5px solid var(--gray-100)', marginTop: 14 }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, background: 'none', border: 'none', borderBottom: tab === t ? '2px solid var(--green-700)' : '2px solid transparent',
              padding: '8px 0', fontSize: 13, fontWeight: tab === t ? 500 : 400,
              color: tab === t ? 'var(--green-700)' : 'var(--gray-500)', transition: 'all 0.15s',
            }}
          >{TAB_LABELS[t]}</button>
        ))}
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* HEALTH LOG TAB */}
        {tab === 'health' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <textarea
                className="field-input"
                rows={3}
                placeholder="How's the tree looking today? Note anything unusual — new growth, leaf colour, branch condition…"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                style={{ resize: 'none', marginBottom: 8 }}
              />
              <button className="btn-primary" onClick={saveHealthLog} disabled={addingNote}>
                {addingNote ? 'Saving…' : 'Save note'}
              </button>
            </div>
            {healthLogs.length === 0 && <p style={{ fontSize: 13, color: 'var(--gray-500)', textAlign: 'center', padding: '20px 0' }}>No health notes yet. Add your first observation above.</p>}
            {healthLogs.map(log => (
              <div key={log.id} style={{ borderBottom: '0.5px solid var(--gray-50)', padding: '12px 0' }}>
                <div style={{ fontSize: 11, color: 'var(--gray-500)', marginBottom: 4 }}>
                  {new Date(log.log_date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>{log.note}</div>
              </div>
            ))}
          </>
        )}

        {/* HARVEST TAB */}
        {tab === 'harvest' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <div className="field-label">Date</div>
                  <input type="date" className="field-input" value={harvestDate} onChange={e => setHarvestDate(e.target.value)} />
                </div>
                <div>
                  <div className="field-label">Number of figs</div>
                  <input type="number" className="field-input" placeholder="e.g. 24" value={harvestQty} onChange={e => setHarvestQty(e.target.value)} min="1" />
                </div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div className="field-label">Quality (1–5)</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      onClick={() => setHarvestRating(n)}
                      style={{
                        flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13,
                        border: harvestRating === n ? '1.5px solid var(--green-700)' : '0.5px solid var(--gray-100)',
                        background: harvestRating === n ? 'var(--green-50)' : '#fff',
                        color: harvestRating === n ? 'var(--green-700)' : 'var(--gray-700)',
                      }}
                    >{n}</button>
                  ))}
                </div>
              </div>
              <textarea
                className="field-input"
                rows={2}
                placeholder="Notes (optional) — flavour, size, ripeness…"
                value={harvestNote}
                onChange={e => setHarvestNote(e.target.value)}
                style={{ resize: 'none', marginBottom: 8 }}
              />
              <button className="btn-primary" onClick={saveHarvestLog} disabled={addingHarvest}>
                {addingHarvest ? 'Saving…' : 'Log harvest'}
              </button>
            </div>
            {harvestLogs.length === 0 && <p style={{ fontSize: 13, color: 'var(--gray-500)', textAlign: 'center', padding: '20px 0' }}>No harvests logged yet.</p>}
            {harvestLogs.map(log => (
              <div key={log.id} className="card" style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>
                    {new Date(log.harvest_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--green-700)', fontWeight: 500 }}>{log.quantity} figs</div>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Quality: {'★'.repeat(log.quality_rating)}{'☆'.repeat(5 - log.quality_rating)}</div>
                </div>
                {log.notes && <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 6 }}>{log.notes}</div>}
              </div>
            ))}
          </>
        )}

        {/* AI CHAT TAB */}
        {tab === 'ask' && (
          <>
            <div style={{ background: 'var(--green-50)', borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--green-700)', fontWeight: 500, marginBottom: 4 }}>Ask about {tree.name}</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Ask anything about this specific tree — care timing, troubleshooting, pruning, winter protection.</div>
            </div>
            <textarea
              className="field-input"
              rows={3}
              placeholder={`e.g. "When should I start seeing new leaves?" or "My ${tree.variety} has yellow spots — what's wrong?"`}
              value={aiQuestion}
              onChange={e => setAiQuestion(e.target.value)}
              style={{ resize: 'none', marginBottom: 8 }}
            />
            <button className="btn-primary" onClick={askAI} disabled={aiLoading} style={{ marginBottom: 16 }}>
              {aiLoading ? 'Thinking…' : 'Ask'}
            </button>
            {aiAnswer && (
              <div style={{ background: '#fff', border: '0.5px solid var(--gray-100)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, color: 'var(--green-500)', fontWeight: 500, marginBottom: 8 }}>FigTrack AI</div>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--gray-900)' }}>{aiAnswer}</div>
              </div>
            )}
            <div style={{ marginTop: 16 }}>
              <div className="section-label">Try asking</div>
              {[
                `When should I remove winter protection for my ${tree.variety}?`,
                `What does a healthy ${tree.variety} look like in spring?`,
                `How much water does this tree need in summer?`,
              ].map(q => (
                <button
                  key={q}
                  onClick={() => setAiQuestion(q)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: '0.5px solid var(--gray-100)', borderRadius: 10, padding: '10px 12px', fontSize: 13, color: 'var(--gray-700)', marginBottom: 8, lineHeight: 1.5 }}
                >{q}</button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete */}
      <div style={{ padding: '0 20px 20px', textAlign: 'center' }}>
        <button onClick={deleteTree} style={{ background: 'none', border: 'none', fontSize: 13, color: 'var(--gray-300)', textDecoration: 'underline' }}>Delete this tree</button>
      </div>
    </div>
  )
}
