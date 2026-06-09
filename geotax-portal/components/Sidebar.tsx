'use client'
import type { Page } from '@/lib/types'

interface Props {
  currentPage: Page
  onNavigate: (page: Page) => void
  onLogout: () => Promise<void> | void
  clientName: string
}

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Inicio', icon: '🏠' },
  { id: 'arca',      label: 'ARCA',   icon: '🔔' },
  { id: 'iva',       label: 'IVA',    icon: '📊' },
  { id: 'ddjj',      label: 'DDJJ',   icon: '📄' },
  { id: 'veps',      label: 'VEPs',   icon: '💳' },
]

export default function Sidebar({ currentPage, onNavigate, onLogout, clientName }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">G</span>
        <span>GeoTax</span>
      </div>
      <div className="sidebar-client">
        <div className="sidebar-client-label">Cliente</div>
        <div className="sidebar-client-name">{clientName}</div>
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-item${currentPage === item.id ? ' active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </aside>
  )
}
