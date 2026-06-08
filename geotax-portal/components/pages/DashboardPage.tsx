'use client'
import { diasRestantes, formatPeriodo } from '@/lib/utils'
import type { ClientData } from '@/lib/types'

interface Props {
  clientData: ClientData
  isAdmin: boolean
  clientName: string
}

export default function DashboardPage({ clientData, clientName }: Props) {
  const vepsUrgentes = clientData.veps.filter(v => !v.pagado && diasRestantes(v.vencimiento) <= 5)
  const arcaSinLeer = clientData.arca.filter(m => !m.leido)

  return (
    <div>
      <div className="page-header">
        <h1>Bienvenido, {clientName}</h1>
        <p>Resumen de su situación impositiva actual</p>
      </div>

      {vepsUrgentes.length > 0 && (
        <div className="alerts-banner red">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <h4>{vepsUrgentes.length} VEP(s) con vencimiento próximo</h4>
            <p>{vepsUrgentes.map(v => v.concepto).join(' · ')}</p>
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
        <div className="section-card blue">
          <div className="section-card-icon">🔔</div>
          <div className="section-card-content">
            <div className="section-card-num">{clientData.arca.filter(m => !m.leido).length}</div>
            <div className="section-card-label">Mensajes ARCA sin leer</div>
          </div>
        </div>
        <div className="section-card green">
          <div className="section-card-icon">📊</div>
          <div className="section-card-content">
            <div className="section-card-num">{clientData.iva.length}</div>
            <div className="section-card-label">Liquidaciones IVA</div>
          </div>
        </div>
        <div className="section-card purple">
          <div className="section-card-icon">📄</div>
          <div className="section-card-content">
            <div className="section-card-num">{clientData.ddjj.length}</div>
            <div className="section-card-label">DDJJ presentadas</div>
          </div>
        </div>
        <div className="section-card orange">
          <div className="section-card-icon">💳</div>
          <div className="section-card-content">
            <div className="section-card-num">{clientData.veps.filter(v => !v.pagado).length}</div>
            <div className="section-card-label">VEPs pendientes</div>
          </div>
        </div>
      </div>

      {clientData.veps.filter(v => !v.pagado).length > 0 && (
        <div className="table-card" style={{ marginTop: '1.5rem' }}>
          <div className="table-card-header"><h3>VEPs Pendientes de Pago</h3></div>
          <table>
            <thead>
              <tr><th>Concepto</th><th>Período</th><th>Importe</th><th>Vencimiento</th><th>Días</th></tr>
            </thead>
            <tbody>
              {clientData.veps.filter(v => !v.pagado).map((v, i) => {
                const dias = diasRestantes(v.vencimiento)
                return (
                  <tr key={i}>
                    <td>{v.concepto}</td>
                    <td>{formatPeriodo(v.periodo)}</td>
                    <td>${v.importe.toLocaleString('es-AR')}</td>
                    <td>{v.vencimiento}</td>
                    <td><span className={dias <= 3 ? 'badge-red' : dias <= 7 ? 'badge-orange' : 'badge-gray'}>
                      {dias <= 0 ? 'Vencido' : `${dias} días`}
                    </span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
