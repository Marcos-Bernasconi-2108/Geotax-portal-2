'use client'
import { useState } from 'react'
import { formatPeriodo } from '@/lib/utils'
import ModalIva from '../modals/ModalIva'
import type { ClientData, IVARecord } from '@/lib/types'

const ICON_CHART = String.fromCodePoint(0x1F4CA)

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
              + Cargar liquidaci?n
            </button>
          )}
        </div>
        {clientData.iva.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{ICON_CHART}</div>
            No hay liquidaciones cargadas a?n.
          </div>
        ) : (
          <table>
            <thead>
              <tr><th>Per?odo</th><th>Archivo</th><th>Acci?n</th></tr>
            </thead>
            <tbody>
              {clientData.iva.map((r, i) => (
                <tr key={i}>
                  <td>{formatPeriodo(r.periodo)}</td>
                  <td>{r.archivo}</td>
                  <td>
                    <button className="btn-sm" onClick={() => alert('Descarga pr?ximamente')}>
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
