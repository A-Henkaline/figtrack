import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const TABS = [
  { path: '/',         label: 'Home',     icon: HomeIcon },
  { path: '/trees',    label: 'Trees',    icon: TreeIcon },
  { path: '/calendar', label: 'Calendar', icon: CalendarIcon },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="bottom-nav">
      {TABS.map(({ path, label, icon: Icon }) => {
        const active = location.pathname === path
        return (
          <button key={path} className={`nav-item ${active ? 'active' : ''}`} onClick={() => navigate(path)}>
            <Icon active={active} />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

function HomeIcon({ active }) {
  const c = active ? '#3B6D11' : '#B4B2A9'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M3 11L11 3l8 8" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M5 9v9h5v-5h2v5h5V9" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function TreeIcon({ active }) {
  const c = active ? '#3B6D11' : '#B4B2A9'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="8" r="5" stroke={c} strokeWidth="1.5"/>
      <path d="M11 13v6M8 17h6" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function CalendarIcon({ active }) {
  const c = active ? '#3B6D11' : '#B4B2A9'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="3" y="5" width="16" height="14" rx="2" stroke={c} strokeWidth="1.5"/>
      <path d="M8 3v4M14 3v4M3 10h16" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function SettingsIcon({ active }) {
  const c = active ? '#3B6D11' : '#B4B2A9'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="8" stroke={c} strokeWidth="1.5"/>
      <circle cx="11" cy="11" r="3" stroke={c} strokeWidth="1.5"/>
    </svg>
  )
}
