'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
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
  const [currentClientId, setCurrentClientId] = useState<string>('client-1')
  const [data, setData] = useState<typeof MOCK_DATA>(() => JSON.parse(JSON.stringify(MOCK_DATA)))
  const [loading, setLoading] = useState(true)

  // Verificar sesión de Supabase al cargar
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const employeeEmails = [
          'gaston.bernasconi@geotax.com.ar',
          'marcos.bernasconi@geotax.com.ar',
          'santiago.cremonini@geotax.com.ar',
          'belen.valdes@geotax.com.ar',
          'luana.campos@geotax.com.ar'
        ]
        const isAdmin = employeeEmails.includes(session.user.email?.toLowerCase() || '')
        const user: User = {
          cuit: session.user.id,
          name: session.user.email?.split('@')[0] || 'Usuario',
          role: isAdmin ? 'admin' : 'client'
        }
        setCurrentUser(user)
      }
      setLoading(false)
    }
    checkSession()
  }, [])

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando...</div>

  function handleLogin(user: User, clientId: string | null) {
    setCurrentUser(user)
    setCurrentClientId('client-1')
    setCurrentPage('dashboard')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setCurrentUser(null)
    setCurrentPage('dashboard')
    setData(JSON.parse(JSON.stringify(MOCK_DATA)))
  }

  function updateClientData(clientId: string, newData: ClientData) {
    setData(prev => ({ ...prev, [clientId]: newData }))
  }

  if (!currentUser) return <LoginScreen onLogin={handleLogin} />

  const isAdmin = currentUser.role === 'admin'
  const clientId = currentClientId
  const clientData = data[clientId] ?? { iva: [], ddjj: [], veps: [], arca: [] }
  const clientName = isAdmin ? 'Cliente' : currentUser.name

  const pageProps = {
    clientData,
    isAdmin,
    onUpdate: (d: ClientData) => updateClientData(clientId, d),
  }

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
            <select value={clientId} onChange={e => setCurrentClientId(e.target.value)}>
              <option value="client-1">Juan Pérez</option>
              <option value="client-2">María González</option>
              <option value="client-3">Empresa Demo SRL</option>
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
