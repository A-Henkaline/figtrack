import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/Home'
import Trees from './components/Trees'
import TreeDetail from './components/TreeDetail'
import AddTree from './components/AddTree'
import Calendar from './components/Calendar'
import Settings from './components/Settings'
import BottomNav from './components/BottomNav'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<><Home /><BottomNav /></>} />
        <Route path="/trees"      element={<><Trees /><BottomNav /></>} />
        <Route path="/trees/:id"  element={<TreeDetail />} />
        <Route path="/trees/new"  element={<AddTree />} />
        <Route path="/calendar"   element={<><Calendar /><BottomNav /></>} />
        <Route path="/settings"   element={<><Settings /><BottomNav /></>} />
        <Route path="*"           element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
