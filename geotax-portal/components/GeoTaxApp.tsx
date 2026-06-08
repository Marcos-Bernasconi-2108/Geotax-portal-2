'use client'
import { useState } from 'react'
import LoginScreen from './LoginScreen'
import Sidebar from './Sidebar'
import DashboardPage from './pages/DashboardPage'
import ArcaPage from './pages/ArcaPage'
import IvaPage from './pages/IvaPage'
import DdjjPage from './pages/DdjjPage'
import VepsPage from './pages/VepsPage'
import { USERS, MOCK_DATA } from '@/lib/mockData'
import type { User, ClientDataMap, Page } from '@/lib/types'

export default function GeoTaxApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [currentClientId, setCurrentClientId] = useState('client-1')
  const [data, setData] = useState<ClientDataMap>(JSON.parse(JSON.stringify(MOCK_DATA)))

  if (!currentUser) {
    return (
      <LoginScreen
        onLogin={(user, clientId) => {
          setCurrentUser(user)
          setCurrentClientId(clientId)
        }}
      />
    )
  }

  const isAdmin = currentUser.role === 'admin'
  const clientData = data[currentClientId]

  function updateClientData(newClientData: typeof clientData) {
    setData(prev => ({ ...prev, [currentClientId]: newClientData }))
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        currentUser={currentUser}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={() => {
          setCurrentUser(null)
          setCurrentPage('dashboard')
        }}
      />
      <div className="main">
        {isAdmin && (
          <div className="client-selector-bar">
            <label>Viendo datos de:</label>
            <select value={currentClientId} onChange={e => setCurrentClientId(e.target.value)}>
              <option value="client-1">Juan Pérez</option>
              <option value="client-2">María González</option>
              <option value="client-3">Empresa Demo SRL</option>
            </select>
            <span style={{ color: '#93c5fd', fontSize: 13, marginLeft: 'auto' }}>
              Modo administrador
            </span>
          </div>
        )}
        {currentPage === 'dashboard' && (
          <DashboardPage
            clientData={clientData}
            clientName={USERS[currentClientId].name}
            isAdmin={isAdmin}
            onNavigate={setCurrentPage}
          />
        )}
        {currentPage === 'arca' && (
          <ArcaPage clientData={clientData} isAdmin={isAdmin} onUpdate={updateClientData} />
        )}
        {currentPage === 'iva' && (
          <IvaPage clientData={clientData} isAdmin={isAdmin} onUpdate={updateClientData} />
        )}
        {currentPage === 'ddjj' && (
          <DdjjPage clientData={clientData} isAdmin={isAdmin} onUpdate={updateClientData} />
        )}
        {currentPage === 'veps' && (
          <VepsPage clientData={clientData} isAdmin={isAdmin} onUpdate={updateClientData} />
        )}
      </div>
    </div>
  )
}
