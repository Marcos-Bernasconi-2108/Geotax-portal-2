'use client'
import { useState } from 'react'
import { formatPeriodo, formatFecha } from '@/lib/utils'
import ModalDdjj from '../modals/ModalDdjj'
import type { ClientData, DDJJRecord } from '@/lib/types'

interface Props {
  clientData: ClientData
  isAdmin: boolean
  onUpdate: (newData: ClientData) => void
}

export default function DdjjPage({ clientData, isAdmin, onUpdate }: Props) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set())
  const [showModal, setShowModal] = useState(false)

  const grupos = clientData.ddjj.reduce((acc, r) => {
    if (!acc[r.tipo]) acc[r.tipo] = []
    acc[r.tipo].push(r)
    return acc
  }, {} as Record<string, DDJJRecord[]>)

  function toggleFolder(tipo: string) {
    setOpenFolders(prev => {
      const next = new Set(prev)
      next.has(tipo) ? next.delete(tipo) : next.add(tipo)
      return next
    })
  }

  function guardarDdjj(rec: DDJJRecord) {
    onUpdate({ ...clientData, ddjj: [rec, ...clientData.ddjj] })
    setShowModal(false)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Declaraciones Juradas</h1>
        <p>Historial de DDJJ presentadas, organizadas por tipo</p>
      </div>
      <div className="table-card">
        <div className="table-card-header">
          <h3>Carpetas de DDJJ</h3>
          {isAdmin && (
            <button className="btn-sm btn-add" onClick={() => setShowModal(true)}>
              + Cargar DDJJ
            </button>
          )}
        </div>
        {clientData.ddjj.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            No hay DDJJ cargadas aún.
          </div>
        ) : (
          <div className="folders-list">
            {Object.entries(grupos).map(([tipo, registros]) => (
              <div key={tipo} className="folder">
                <div className="folder-header" onClick={() => toggleFolder(tipo)}>
                  <span className="folder-icon">📁</span>
                  <span className="folder-name">{tipo}</span>
                  <span className="folder-count">{registros.length} presentaciones</span>
                  <span className="folder-arrow">{openFolders.has(tipo) ? '▼' : '▶'}</span>
                </div>
                {openFolders.has(tipo) && (
                  <div className="folder-content">
                    <table>
                      <thead>
                        <tr><th>Período</th><th>Fecha presentación</th><th>Nro. transacción</th><th>Archivo</th></tr>
                      </thead>
                      <tbody>
                        {registros.map((r, i) => (
                          <tr key={i}>
                            <td>{formatPeriodo(r.periodo)}</td>
                            <td>{formatFecha(r.fecha)}</td>
                            <td>{r.nro}</td>
                            <td>
                              <button className="btn-sm" onClick={() => alert('Función de descarga próximamente')}>
                                Descargar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {showModal && <ModalDdjj onSave={guardarDdjj} onClose={() => setShowModal(false)} />}
    </div>
  )
}
