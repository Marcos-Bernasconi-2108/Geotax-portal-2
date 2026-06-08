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
          <div className="alert-icon">\u26A0\uFE0F</div>
          <div className="alert-content">
            <h4>VEPs pr\u00F3ximos a vencer</h4>
            <p>
              {urgVeps.map(v =>
                `${v.concepto} ${v.periodo} \u2014 vence el ${formatFecha(v.vencimiento)} (${diasRestantes(v.vencimiento)} d\u00EDas)`
              ).join(' \u00B7 ')}
            </p>
          </div>
        </div>
      )}

      {arcaSinLeer.length > 0 && (
        <div className="alerts-banner blue">
          <div className="alert-icon">\u{1F4EC}</div>
          <div className="alert-content">
            <h4>Tiene {arcaSinLeer.length} mensaje(s) sin leer de ARCA</h4>
            <p>{arcaSinLeer.map(a => a.asunto).join(' \u00B7 ')}</p>
          </div>
        </div>
      )}

      <div className="section-cards">
        <div className="section-card sc-arca" onClick={() => onNavigate('arca')}>
          <div className="sc-icon">\u{1F514}</div>
          <div className="sc-body">
            <div className="sc-title">Mensajes ARCA</div>
            <div className="sc-desc">Notificaciones y comunicaciones de AFIP / ARCA</div>
            <div className="sc-stat">
              {arcaSinLeer.length > 0
                ? `${arcaSinLeer.length} mensaje(s) sin leer`
                : 'Sin mensajes nuevos'}
            </div>
          </div>
          <div className="sc-arrow">\u203A</div>
        </div>

        <div className="section-card sc-iva" onClick={() => onNavigate('iva')}>
          <div className="sc-icon">\u{1F4CA}</div>
          <div className="sc-body">
            <div className="sc-title">Liquidaci\u00F3n IVA</div>
            <div className="sc-desc">Resumen mensual de IVA</div>
            <div className="sc-stat">{clientData.iva.length} liquidaci\u00F3n(es) disponible(s)</div>
          </div>
          <div className="sc-arrow">\u203A</div>
        </div>

        <div className="section-card sc-ddjj" onClick={() => onNavigate('ddjj')}>
          <div className="sc-icon">\u{1F4C4}</div>
          <div className="sc-body">
            <div className="sc-title">Mis DDJJ</div>
            <div className="sc-desc">Declaraciones juradas presentadas ante AFIP</div>
            <div className="sc-stat">{clientData.ddjj.length} presentaci\u00F3n(es) registrada(s)</div>
          </div>
          <div className="sc-arrow">\u203A</div>
        </div>

        <div className="section-card sc-veps" onClick={() => onNavigate('veps')}>
          <div className="sc-icon">\u{1F4B3}</div>
          <div className="sc-body">
            <div className="sc-title">VEPs</div>
            <div className="sc-desc">Volantes electr\u00F3nicos de pago</div>
            <div className="sc-stat">
              {pendVeps.length > 0
                ? `${pendVeps.length} VEP(s) pendiente(s) de pago`
                : 'Sin VEPs pendientes'}
            </div>
          </div>
          <div className="sc-arrow">\u203A</div>
        </div>
      </div>
    </div>
  )
}
