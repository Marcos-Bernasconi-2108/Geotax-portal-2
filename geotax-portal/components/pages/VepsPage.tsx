'use client'
import { useState } from 'react'
import { diasRestantes, formatPeriodo, formatFecha, formatPeso } from '@/lib/utils'
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

  function marcarPagado(idx: number) {
    const newVeps = [...clientData.veps]
    const globalIdx = clientData.veps.findIndex((v, i) => !v.pagado && clientData.veps.slice(0, i + 1).filter(x => !x.pagado).length === idx + 1)
    const today = new Date().toISOString().split('T')[0]
    const realIdx = clientData.veps.reduce((found, v, i) => {
      if (found !== -1) return found
      if (!v.pagado) {
        if (idx === 0) return i
        idx--
      }
      return -1
    }, -1)
    if (realIdx !== -1) {
      newVeps[realIdx] = { ...newVeps[realIdx], pagado: true, fechaPago: today }
      onUpdate({ ...clientData, veps: newVeps })
    }
  }

  function guardarVep(rec: VEPRecord) {
    onUpdate({ ...clientData, veps: [rec, ...clientData.veps] })
    setShowModal(false)
  }

  return (
    <div>
      <div className="page-header">
        <h1>VEPs</h1>
        <p>Volantes Electrónicos de Pago - pendientes y pagados</p>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <h3>VEPs Pendientes</h3>
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
              <tr><th>Concepto</th><th>Período</th><th>Importe</th><th>Vencimiento</th><th>Días</th>{isAdmin && <th>Acción</th>}</tr>
            </thead>
            <tbody>
              {pendientes.map((v, i) => {
                const dias = diasRestantes(v.vencimiento)
                return (
                  <tr key={i}>
                    <td>{v.concepto}</td>
                    <td>{formatPeriodo(v.periodo)}</td>
                    <td>{formatPeso(v.importe)}</td>
                    <td>{v.vencimiento}</td>
                    <td><span className={dias <= 3 ? 'badge-red' : dias <= 7 ? 'badge-orange' : 'badge-gray'}>
                      {dias <= 0 ? 'Vencido' : `${dias} días`}
                    </span></td>
                    {isAdmin && <td><button className="btn-sm btn-add" onClick={() => marcarPagado(i)}>Marcar pagado</button></td>}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {pagados.length > 0 && (
        <div className="table-card" style={{ marginTop: '1.5rem' }}>
          <div className="table-card-header"><h3>VEPs Pagados</h3></div>
          <table>
            <thead>
              <tr><th>Concepto</th><th>Período</th><th>Importe</th><th>Fecha de pago</th></tr>
            </thead>
            <tbody>
              {pagados.map((v, i) => (
                <tr key={i}>
                  <td>{v.concepto}</td>
                  <td>{formatPeriodo(v.periodo)}</td>
                  <td>{formatPeso(v.importe)}</td>
                  <td>{v.fechaPago ? formatFecha(v.fechaPago) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && <ModalVep onSave={guardarVep} onClose={() => setShowModal(false)} />}
    </div>
  )
}
