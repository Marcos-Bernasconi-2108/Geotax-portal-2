'use client'
import type { User, Page } from '@/lib/types'

interface Props {
  currentUser: User
  currentPage: Page
  onNavigate: (page: Page) => void
  onLogout: () => void
}

const NAV_ITEMS: { id: Page; icon: string; label: string }[] = [
  { id: 'dashboard', icon: '🏠', label: 'Inicio' },
  { id: 'arca',      icon: '🔔', label: 'Mensajes ARCA' },
  { id: 'iva',       icon: '📊', label: 'Liquidación IVA' },
  { id: 'ddjj',      icon: '📄', label: 'Mis DDJJ' },
  { id: 'veps',      icon: '💳', label: 'VEPs' },
]

export default function Sidebar({ currentUser, currentPage, onNavigate, onLogout }: Props) {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        GeoTax{' '}
        <span>{currentUser.role === 'admin' ? 'Administrador' : 'Portal de Clientes'}</span>
      </div>
      <div className="nav-section">
        <div className="nav-label">Mi Cuenta</div>
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            className={`nav-item${currentPage === item.id ? ' active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <strong>{currentUser.name}</strong>
        <span>{currentUser.cuit}</span>
        <button className="logout-btn" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </div>
  )
}
