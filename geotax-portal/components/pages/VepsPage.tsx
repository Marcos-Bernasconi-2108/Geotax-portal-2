'use client'
import { useState } from 'react'
import { diasRestantes, formatFecha, formatPeso } from '@/lib/utils'
import ModalVep from '../modals/ModalVep'
import type { ClientData, VEPRecord } from '@/lib/types'

interface Props {
  clientData: ClientData
  isAdmin: boolean
  onUpdate: (newData: ClientData) => void
}

export default function VepsPage({ clientData, isAdmin, onUpdate }: Props) {
  const [showModal, setShowModal] = useState(false)

  const pendientes = clientData.veps.filter(v => !v.pagado)
  const pagados = clientData.veps.filter(v => v.pagado)
  const urgentes = pendientes.filter(v => diasRestantes(v.vencimiento) <= 5)

  function marcarPagado(vep: VEPRecord) {
    const newVeps = clientData.veps.map(v =>
      v === vep ? { ...v, pagado: true, fechaPago: new Date().toISOString().split('T')[0] } : v
    )
    onUpdate({ ...clientData, veps: newVeps })
  }

  function guardarVep(record: Omit<VEPRecord, 'pagado'>) {
    onUpdate({ ...clientData, veps: [{ ...record, pagado: false }, ...clientData.veps] })
    setShowModal(false)
  }

  return (
    <div>
      <div className="page-header">
        <h1>VEPs</h1>
        <p>Volantes electrónicos de pago</p>
      </div>

      {urgentes.length > 0 && (
        <div className="alerts-banner orange">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <h4>Atención — VEPs por vencer en los próximos 5 días</h4>
            <p>
              {urgentes.map(v =>
                `${v.concepto} ${v.periodo} — vence el ${formatFecha(v.vencimiento)}`
              ).join(' | ')}
            </p>
          </div>
        </div>
      )}

      <div className="table-card">
        <div className="table-card-header">
          <h3>VEPs Pendientes de Pago</h3>
          {isAdmin && (
            <button className="btn-sm btn-add" onClick={() => setShowModal(true)}>
              + Cargar VEP
            </button>
          )}
        </div>
        {pendientes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            No hay VEPs pendientes.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Concepto</th><th>Período</th><th>Importe</th>
                <th>Vencimiento</th><th>Días restantes</th><th>Estado</th><th></th>
              </tr>
            </thead>
            <tbody>
              {pendientes.map((v, i) => {
                const dias = diasRestantes(v.vencimiento)
                return (
                  <tr key={i}>
                    <td><strong>{v.concepto}</strong></td>
                    <td>{v.periodo}</td>
                    <td>{formatPeso(v.importe)}</td>
                    <td>{formatFecha(v.vencimiento)}</td>
                    <td>
                      <span className={dias <= 3 ? 'days-urgente' : dias <= 7 ? 'days-proximo' : 'days-ok'}>
                        {dias <= 0 ? 'VENCIDO' : `${dias} días`}
                      </span>
                    </td>
                    <td><span className="badge badge-orange">Pendiente</span></td>
                    <td>
                      {isAdmin && (
                        <button className="btn-sm btn-download" onClick={() => marcarPagado(v)}>
                          ✓ Marcar pagado
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="table-card">
        <div className="table-card-header"><h3>VEPs Abonados</h3></div>
        {pagados.length === 0 ? (
          <div className="empty-state">Sin VEPs abonados registrados.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Concepto</th><th>Período</th><th>Importe</th>
                <th>Fecha Pago</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {pagados.map((v, i) => (
                <tr key={i}>
                  <td><strong>{v.concepto}</strong></td>
                  <td>{v.periodo}</td>
                  <td>{formatPeso(v.importe)}</td>
                  <td>{formatFecha(v.fechaPago || v.vencimiento)}</td>
                  <td><span className="badge badge-green">Abonado</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <ModalVep onSave={guardarVep} onClose={() => setShowModal(false)} />}
    </div>
  )
}
