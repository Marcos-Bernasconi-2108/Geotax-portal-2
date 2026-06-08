'use client'
import { useState } from 'react'
import { USERS, MOCK_DATA } from '@/lib/mockData'
import type { User, Page, ClientData } from '@/lib/types'
import LoginScreen from './LoginScreen'
import Sidebar from './Sidebar'
import DashboardPage from './pages/DashboardPage'
import ArcaPage from './pages/ArcaPage'
import IvaPage from './pages/IvaPage'
import DdjjPage from './pages/DdjjPage'
import VepsPage from './pages/VepsPage'

export default function GeoTaxApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [currentClientId, setCurrentClientId] = useState<string | null>(null)
  const [data, setData] = useState<typeof MOCK_DATA>(() => JSON.parse(JSON.stringify(MOCK_DATA)))

  function handleLogin(user: User, clientId: string | null) {
    setCurrentUser(user)
    setCurrentClientId(clientId ?? (user.role === 'admin' ? USERS.find(u => u.role === 'client')?.cuit ?? null : null))
    setCurrentPage('dashboard')
  }

  function handleLogout() {
    setCurrentUser(null)
    setCurrentPage('dashboard')
    setData(JSON.parse(JSON.stringify(MOCK_DATA)))
  }

  function updateClientData(clientId: string, newData: ClientData) {
    setData(prev => ({ ...prev, [clientId]: newData }))
  }

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />

  const isAdmin = currentUser.role === 'admin'
  const clientId = currentClientId ?? ''
  const clientData = data[clientId] ?? { iva: [], ddjj: [], veps: [], arca: [] }
  const clientName = isAdmin
    ? (USERS.find(u => u.cuit === clientId)?.name ?? 'Cliente')
    : currentUser.name

  const pageProps = { clientData, isAdmin, onUpdate: (d: ClientData) => updateClientData(clientId, d) }

  return (
    <div className="app-container">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        clientName={clientName}
      />
      <main className="main-content">
        {isAdmin && (
          <div className="client-selector-bar">
            <label>Viendo cliente:</label>
            <select
              value={clientId}
              onChange={e => setCurrentClientId(e.target.value)}
            >
              {USERS.filter(u => u.role === 'client').map(u => (
                <option key={u.cuit} value={u.cuit}>{u.name}</option>
              ))}
            </select>
          </div>
        )}
        {currentPage === 'dashboard' && <DashboardPage {...pageProps} clientName={clientName} />}
        {currentPage === 'arca'      && <ArcaPage      {...pageProps} />}
        {currentPage === 'iva'       && <IvaPage        {...pageProps} />}
        {currentPage === 'ddjj'      && <DdjjPage       {...pageProps} />}
        {currentPage === 'veps'      && <VepsPage       {...pageProps} />}
      </main>
    </div>
  )
}
