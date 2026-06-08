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

  function guardarIva(record: IVARecord) {
    onUpdate({ ...clientData, iva: [record, ...clientData.iva] })
    setShowModal(false)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Liquidación IVA</h1>
        <p>Historial de liquidaciones mensuales</p>
      </div>
      <div className="table-card">
        <div className="table-card-header">
          <h3>Liquidaciones Mensuales</h3>
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
              <tr><th>Período</th><th>Archivo</th><th></th></tr>
            </thead>
            <tbody>
              {clientData.iva.map((r, i) => (
                <tr key={i}>
                  <td><strong>{formatPeriodo(r.periodo)}</strong></td>
                  <td style={{ color: '#6b7280', fontSize: 13 }}>📎 {r.archivo}</td>
                  <td>
                    <button
                      className="btn-sm btn-download"
                      onClick={() => alert('Próximamente conectado a Supabase Storage')}
                    >
                      ⬇ Descargar
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
