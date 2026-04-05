import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getTreeStatus, STATUS_CONFIG } from '../lib/careCalendar'

export default function Trees() {
  const navigate = useNavigate()
  const [trees, setTrees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('trees')
        .select('*, health_logs(log_date), harvest_logs(harvest_date, quantity)')
        .order('created_at', { ascending: true })
      setTrees(data || [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="page">
      <div style={{ padding: '54px 20px 16px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 400, letterSpacing: '-0.4px' }}>My Trees</h1>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>{trees.length} fig tree{trees.length !== 1 ? 's' : ''} tracked</p>
        </div>
        <button
          onClick={() => navigate('/trees/new')}
          style={{ background: 'var(--green-700)', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 500 }}
        >+ Add</button>
      </div>

      <div style={{ padding: '12px 20px' }}>
        {loading && <div className="loading">Loading…</div>}
        {!loading && trees.length === 0 && (
          <div className="empty-state">
            <h3>No trees yet</h3>
            <p>Start tracking your fig trees — add one to see seasonal care tasks, health logs, and harvest history.</p>
            <button className="btn-primary" onClick={() => navigate('/trees/new')}>Add your first tree</button>
          </div>
        )}
        {trees.map(tree => {
          const status = getTreeStatus(tree)
          const cfg = STATUS_CONFIG[status]
          const totalFigs = (tree.harvest_logs || []).reduce((s, h) => s + (h.quantity || 0), 0)
          const lastLog = tree.health_logs?.[0]?.log_date
          return (
            <div key={tree.id} className="card" style={{ marginBottom: 10, cursor: 'pointer' }} onClick={() => navigate(`/trees/${tree.id}`)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🌳</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{tree.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--green-500)' }}>{tree.variety}</div>
                </div>
                <span className={`badge badge-${status}`}>{cfg.label}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, borderTop: '0.5px solid var(--gray-50)', paddingTop: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--gray-500)', marginBottom: 2 }}>Total figs</div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{totalFigs}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--gray-500)', marginBottom: 2 }}>Location</div>
                  <div style={{ fontSize: 13 }}>{tree.location_on_property || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--gray-500)', marginBottom: 2 }}>Last log</div>
                  <div style={{ fontSize: 13 }}>{lastLog ? new Date(lastLog).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Never'}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
