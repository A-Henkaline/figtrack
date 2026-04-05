import React from 'react'
import { CARE_CALENDAR, getCurrentCareWindow } from '../lib/careCalendar'

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const FULL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function Calendar() {
  const currentMonth = new Date().getMonth() + 1
  const care = getCurrentCareWindow()

  return (
    <div className="page">
      <div style={{ padding: '54px 20px 20px', background: 'var(--green-50)' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 400, letterSpacing: '-0.4px', marginBottom: 4 }}>Care Calendar</h1>
        <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>Western New York seasonal guide</p>
      </div>

      {/* Current window highlight */}
      <div style={{ padding: '16px 20px' }}>
        <div className="section-label">Right now — {FULL_MONTHS[currentMonth - 1]}</div>
        <div className="alert-card" style={{ marginBottom: 20 }}>
          <div className="alert-card-title">⚠ {care.task}</div>
          <div className="alert-card-sub">{care.detail}</div>
        </div>

        <div className="section-label">Full year</div>
        {CARE_CALENDAR.map((window, i) => {
          const isCurrent = window.months.includes(currentMonth)
          const monthLabels = window.months.map(m => MONTH_NAMES[m - 1]).join(' – ')
          return (
            <div
              key={i}
              style={{
                display: 'flex', gap: 14, alignItems: 'flex-start',
                padding: '14px 0',
                borderBottom: i < CARE_CALENDAR.length - 1 ? '0.5px solid var(--gray-50)' : 'none',
                opacity: isCurrent ? 1 : 0.75,
              }}
            >
              {/* Timeline dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 3, flexShrink: 0, width: 18 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                  background: isCurrent ? 'var(--green-700)' : 'var(--gray-100)',
                  border: isCurrent ? '2px solid var(--green-300)' : 'none',
                }}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: isCurrent ? 'var(--gray-900)' : 'var(--gray-700)' }}>{window.task}</div>
                  <div style={{ fontSize: 11, color: isCurrent ? 'var(--green-500)' : 'var(--gray-300)', flexShrink: 0, marginLeft: 8 }}>{monthLabels}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.55 }}>{window.detail}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
