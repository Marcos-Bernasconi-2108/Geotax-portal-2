'use client'
import { useState } from 'react'
import { formatPeriodo } from '@/lib/utils'
import ModalIva from '../modals/ModalIva'
import type { ClientData, IVARecord } from '@/lib/types'

interface Props {
  clientData: ClientData
  isAdmin: boolean
  onUpdate: (newData: ClientData) => void
}

export default function IvaPage({ clientData, isAdmin, onUpdate }: Props) {
  const [showModal, setShowModal] = useState(false)

  function guardarIva(rec: IVARecord) {
    onUpdate({ ...clientData, iva: [rec, ...clientData.iva] })
    setShowModal(false)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Liquidaciones IVA</h1>
        <p>Historial de liquidaciones de IVA presentadas</p>
      </div>
      <div className="table-card">
        <div className="table-card-header">
          <h3>Liquidaciones</h3>
          {isAdmin && (
            <button className="btn-sm btn-add" onClick={() => setShowModal(true)}>
              + Cargar liquidación
            </button>
          )}
        </div>
        {clientData.iva.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            No hay liquidaciones cargadas aún.
          </div>
        ) : (
          <table>
            <thead>
              <tr><th>Período</th><th>Archivo</th><th>Acción</th></tr>
            </thead>
            <tbody>
              {clientData.iva.map((r, i) => (
                <tr key={i}>
                  <td>{formatPeriodo(r.periodo)}</td>
                  <td>{r.archivo}</td>
                  <td>
                    <button className="btn-sm" onClick={() => alert('Función de descarga próximamente')}>
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showModal && <ModalIva onSave={guardarIva} onClose={() => setShowModal(false)} />}
    </div>
  )
}
