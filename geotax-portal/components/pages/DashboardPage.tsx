'use client'
import { diasRestantes, formatFecha } from '@/lib/utils'
import type { ClientData, Page } from '@/lib/types'

interface Props {
  clientData: ClientData
  clientName: string
  isAdmin: boolean
  onNavigate: (page: Page) => void
}

export default function DashboardPage({ clientData, clientName, isAdmin, onNavigate }: Props) {
  const pendVeps = clientData.veps.filter(v => !v.pagado)
  const urgVeps = pendVeps.filter(v => diasRestantes(v.vencimiento) <= 5)
  const arcaSinLeer = clientData.arca.filter(a => !a.leido)

  return (
    <div>
      <div className="page-header">
        <h1>{isAdmin ? `Viendo: ${clientName}` : `Bienvenido, ${clientName.split(' ')[0]}`}</h1>
        <p>Panel de acceso a sus servicios</p>
      </div>

      {urgVeps.length > 0 && (
        <div className="alerts-banner orange">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <h4>VEPs próximos a vencer</h4>
            <p>
              {urgVeps.map(v =>
                `${v.concepto} ${v.periodo} — vence el ${formatFecha(v.vencimiento)} (${diasRestantes(v.vencimiento)} días)`
              ).join(' · ')}
            </p>
          </div>
        </div>
      )}

      {arcaSinLeer.length > 0 && (
        <div className="alerts-banner blue">
          <div className="alert-icon">📬</div>
          <div className="alert-content">
            <h4>Tiene {arcaSinLeer.length} mensaje(s) sin leer de ARCA</h4>
            <p>{arcaSinLeer.map(a => a.asunto).join(' · ')}</p>
          </div>
        </div>
      )}

      <div className="section-cards">
        <div className="section-card sc-arca" onClick={() => onNavigate('arca')}>
          <div className="sc-icon">🔔</div>
          <div className="sc-body">
            <div className="sc-title">Mensajes ARCA</div>
            <div className="sc-desc">Notificaciones y comunicaciones de AFIP / ARCA</div>
            <div className="sc-stat">
              {arcaSinLeer.length > 0 ? `${arcaSinLeer.length} mensaje(s) sin leer` : 'Sin mensajes nuevos'}
            </div>
          </div>
          <div className="sc-arrow">›</div>
        </div>

        <div className="section-card sc-iva" onClick={() => onNavigate('iva')}>
          <div className="sc-icon">📊</div>
          <div className="sc-body">
            <div className="sc-title">Liquidación IVA</div>
            <div className="sc-desc">Resumen mensual de IVA</div>
            <div className="sc-stat">{clientData.iva.length} liquidación(es) disponible(s)</div>
          </div>
          <div className="sc-arrow">›</div>
        </div>

        <div className="section-card sc-ddjj" onClick={() => onNavigate('ddjj')}>
          <div className="sc-icon">📄</div>
          <div className="sc-body">
            <div className="sc-title">Mis DDJJ</div>
            <div className="sc-desc">Declaraciones juradas presentadas ante AFIP</div>
            <div className="sc-stat">{clientData.ddjj.length} presentación(es) registrada(s)</div>
          </div>
          <div className="sc-arrow">›</div>
        </div>

        <div className="section-card sc-veps" onClick={() => onNavigate('veps')}>
          <div className="sc-icon">💳</div>
          <div className="sc-body">
            <div className="sc-title">VEPs</div>
            <div className="sc-desc">Volantes electrónicos de pago</div>
            <div className="sc-stat">
              {pendVeps.length > 0 ? `${pendVeps.length} VEP(s) pendiente(s) de pago` : 'Sin VEPs pendientes'}
            </div>
          </div>
          <div className="sc-arrow">›</div>
        </div>
      </div>
    </div>
  )
}
