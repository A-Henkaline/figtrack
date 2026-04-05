import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getCurrentCareWindow, getTreeStatus, STATUS_CONFIG } from '../lib/careCalendar'

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function Home() {
  const navigate = useNavigate()
  const [trees, setTrees] = useState([])
  const [loading, setLoading] = useState(true)
  const care = getCurrentCareWindow()
  const month = MONTH_NAMES[new Date().getMonth()]

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('trees')
        .select('*, health_logs(log_date)')
        .order('created_at', { ascending: true })
      setTrees(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const actionTrees = trees.filter(t => getTreeStatus(t) === 'action')

  return (
    <div className="page">
      {/* Header */}
      <div style={{ padding: '54px 20px 20px', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <LogoIcon />
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 500, letterSpacing: '-0.3px' }}>FigTrack</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--green-500)' }}>Western New York</div>
          </div>
          <button
            onClick={() => navigate('/trees/new')}
            style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--green-500)', background: 'transparent', color: 'var(--green-700)', fontSize: 22, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >+</button>
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        {/* Care window */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-label">Current window</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 400, letterSpacing: '-0.5px', marginBottom: 4 }}>{month} Care</h1>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 14 }}>
            {actionTrees.length > 0 ? `${actionTrees.length} tree${actionTrees.length > 1 ? 's' : ''} need attention` : 'All trees are looking good'} · Next check in 3 days
          </p>
          <div className="alert-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/calendar')}>
            <div className="alert-card-title">⚠ {care.task}</div>
            <div className="alert-card-sub">{care.detail}</div>
          </div>
        </div>

        {/* Trees */}
        <div>
          <div className="section-label">My Trees</div>
          {loading && <div className="loading">Loading your trees…</div>}
          {!loading && trees.length === 0 && (
            <div className="empty-state">
              <h3>No trees yet</h3>
              <p>Add your first fig tree to start tracking its seasonal care and harvests.</p>
              <button className="btn-primary" onClick={() => navigate('/trees/new')}>Add your first tree</button>
            </div>
          )}
          {trees.map(tree => {
            const status = getTreeStatus(tree)
            const cfg = STATUS_CONFIG[status]
            return (
              <div key={tree.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, cursor: 'pointer' }} onClick={() => navigate(`/trees/${tree.id}`)}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🌳</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{tree.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{tree.variety}</div>
                </div>
                <span className={`badge badge-${status}`}>{cfg.label}</span>
              </div>
            )
          })}
          {!loading && trees.length > 0 && (
            <button className="btn-secondary" style={{ marginTop: 8 }} onClick={() => navigate('/trees/new')}>+ Add tree</button>
          )}
        </div>
      </div>
    </div>
  )
}

function LogoIcon() {
  return (
    <div style={{ width: 30, height: 30, background: 'var(--green-700)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2C8 2 5 5 5 9c0 1.66 1.34 3 3 3s3-1.34 3-3C11 5 8 2 8 2z" fill="#97C459"/>
        <path d="M8 12v3" stroke="#EAF3DE" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    </div>
  )
}
