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
  'Intimaci\u00F3n': 'badge-red',
  'Notificaci\u00F3n': 'badge-blue',
  'Resoluci\u00F3n': 'badge-orange',
  'Informaci\u00F3n': 'badge-gray',
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
            <div className="empty-icon">\u{1F4EC}</div>
            No hay mensajes cargados.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Fecha</th><th>Asunto</th><th>Tipo</th>
                <th>Descripci\u00F3n</th><th>Estado</th><th></th>
              </tr>
            </thead>
            <tbody>
              {clientData.arca.map((msg, i) => (
                <tr key={i}>
                  <td>{formatFecha(msg.fecha)}</td>
                  <td><strong>{msg.asunto}</strong></td>
                  <td>
                    <span className={`badge ${TIPO_BADGE[msg.tipo] || 'badge-gray'}`}>
                      {msg.tipo}
                    </span>
                  </td>
                  <td style={{ maxWidth: 300, fontSize: 13, color: '#6b7280' }}>{msg.desc}</td>
                  <td>
                    {msg.leido
                      ? <span className="badge badge-gray">Le\u00EDdo</span>
                      : <span className="badge badge-blue">Nuevo</span>
                    }
                  </td>
                  <td>
                    {!msg.leido && (
                      <button className="btn-sm btn-download" onClick={() => marcarLeido(i)}>
                        \u2713 Marcar le\u00EDdo
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
