'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import LoginScreen from './LoginScreen'
import Sidebar from './Sidebar'
import DashboardPage from './pages/DashboardPage'
import ArcaPage from './pages/ArcaPage'
import IvaPage from './pages/IvaPage'
import DdjjPage from './pages/DdjjPage'
import VepsPage from './pages/VepsPage'
import type { User, ClientDataMap, Page, ClientData } from '@/lib/types'
import { MOCK_DATA } from '@/lib/mockData'

export default function GeoTaxApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [currentClientId, setCurrentClientId] = useState('client-1')
  const [data, setData] = useState<ClientDataMap>(JSON.parse(JSON.stringify(MOCK_DATA)))
  const [clientList, setClientList] = useState<{id: string, name: string}[]>([])

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      supabase.from('profiles').select('client_id, full_name').eq('role', 'client')
        .then(({ data: profiles }) => {
          if (profiles) {
            setClientList(profiles.map(p => ({ id: p.client_id, name: p.full_name })))
            if (profiles.length > 0) setCurrentClientId(profiles[0].client_id)
          }
        })
    }
  }, [currentUser])

  useEffect(() => {
    if (!currentUser) return
    loadClientData(currentClientId)
  }, [currentClientId, currentUser])

  async function loadClientData(clientId: string) {
    const [iva, ddjj, veps, arca] = await Promise.all([
      supabase.from('iva_records').select('*').eq('client_id', clientId),
      supabase.from('ddjj_records').select('*').eq('client_id', clientId),
      supabase.from('vep_records').select('*').eq('client_id', clientId),
      supabase.from('arca_messages').select('*').eq('client_id', clientId),
    ])
    setData(prev => ({
      ...prev,
      [clientId]: {
        iva: (iva.data || []).map(r => ({ periodo: r.periodo, debito: r.debito, credito: r.credito, saldo: r.saldo, vencimiento: r.vencimiento, estado: r.estado })),
        ddjj: (ddjj.data || []).map(r => ({ tipo: r.tipo, periodo: r.periodo, vencimiento: r.vencimiento, estado: r.estado, importe: r.importe })),
        veps: (veps.data || []).map(r => ({ id: r.id, concepto: r.concepto, periodo: r.periodo, vencimiento: r.vencimiento, importe: r.importe, pagado: r.pagado })),
        arca: (arca.data || []).map(r => ({ id: r.id, fecha: r.fecha, tipo: r.tipo, asunto: r.asunto, cuerpo: r.cuerpo, leido: r.leido })),
      }
    }))
  }

  if (!currentUser) {
    return (
      <LoginScreen onLogin={(user, clientId) => {
        setCurrentUser(user)
        setCurrentClientId(clientId)
      }} />
    )
  }

  const isAdmin = currentUser.role === 'admin'
  const clientData = (data[currentClientId] || MOCK_DATA[currentClientId]) as ClientData
  const clientName = clientList.find(c => c.id === currentClientId)?.name || currentUser.name

  function updateClientData(newClientData: ClientData) {
    setData(prev => ({ ...prev, [currentClientId]: newClientData }))
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar currentUser={currentUser} currentPage={currentPage}
        onNavigate={setCurrentPage} onLogout={() => { setCurrentUser(null); setCurrentPage('dashboard') }} />
      <div className="main">
        {isAdmin && clientList.length > 0 && (
          <div className="client-selector-bar">
            <select value={currentClientId} onChange={e => setCurrentClientId(e.target.value)}>
              {clientList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
        {currentPage === 'dashboard' && <DashboardPage clientData={clientData} clientName={clientName} isAdmin={isAdmin} />}
        {currentPage === 'arca' && <ArcaPage clientData={clientData} isAdmin={isAdmin} onUpdate={updateClientData} />}
        {currentPage === 'iva' && <IvaPage clientData={clientData} isAdmin={isAdmin} onUpdate={updateClientData} />}
        {currentPage === 'ddjj' && <DdjjPage clientData={clientData} isAdmin={isAdmin} onUpdate={updateClientData} />}
        {currentPage === 'veps' && <VepsPage clientData={clientData} isAdmin={isAdmin} onUpdate={updateClientData} />}
      </div>
    </div>
  )
}
