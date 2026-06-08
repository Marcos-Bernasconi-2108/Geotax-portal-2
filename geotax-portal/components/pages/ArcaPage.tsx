'use client'
import { useState } from 'react'
import { formatFecha } from '@/lib/utils'
import ModalArca from '../modals/ModalArca'
import type { ClientData, ARCAMessage } from '@/lib/types'

interface Props {
  clientData: ClientData
  isAdmin: boolean
  onUpdate: (newData: ClientData) => void
}

const TIPO_BADGE: Record<string, string> = {
  'Requerimiento': 'badge-red',
  'Intimación': 'badge-red',
  'Notificación': 'badge-blue',
  'Resolución': 'badge-orange',
  'Información': 'badge-gray',
}

export default function ArcaPage({ clientData, isAdmin, onUpdate }: Props) {
  const [showModal, setShowModal] = useState(false)

  function marcarLeido(idx: number) {
    const newArca = [...clientData.arca]
    newArca[idx] = { ...newArca[idx], leido: true }
    onUpdate({ ...clientData, arca: newArca })
  }

  function guardarArca(msg: Omit<ARCAMessage, 'leido'>) {
    onUpdate({ ...clientData, arca: [{ ...msg, leido: false }, ...clientData.arca] })
    setShowModal(false)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Mensajes ARCA</h1>
        <p>Notificaciones y comunicaciones de AFIP / ARCA</p>
      </div>
      <div className="table-card">
        <div className="table-card-header">
          <h3>Bandeja de mensajes</h3>
          {isAdmin && (
            <button className="btn-sm btn-add" onClick={() => setShowModal(true)}>
              + Cargar mensaje
            </button>
          )}
        </div>
        {clientData.arca.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📬</div>
            No hay mensajes cargados.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Fecha</th><th>Asunto</th><th>Tipo</th>
                <th>Descripción</th><th>Estado</th><th></th>
              </tr>
            </thead>
            <tbody>
              {clientData.arca.map((msg, i) => (
                <tr key={i} style={{ opacity: msg.leido ? 0.7 : 1 }}>
                  <td>{formatFecha(msg.fecha)}</td>
                  <td style={{ fontWeight: msg.leido ? 'normal' : 'bold' }}>{msg.asunto}</td>
                  <td><span className={TIPO_BADGE[msg.tipo] || 'badge-gray'}>{msg.tipo}</span></td>
                  <td>{msg.desc}</td>
                  <td>
                    {msg.leido
                      ? <span className="badge-gray">Leído</span>
                      : <span className="badge-red">Sin leer</span>
                    }
                  </td>
                  <td>
                    {!msg.leido && (
                      <button className="btn-sm" onClick={() => marcarLeido(i)}>
                        Marcar leído
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showModal && <ModalArca onSave={guardarArca} onClose={() => setShowModal(false)} />}
    </div>
  )
}
