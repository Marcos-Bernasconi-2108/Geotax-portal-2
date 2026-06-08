'use client'
import { useState } from 'react'
import { formatFecha } from '@/lib/utils'
import ModalDdjj from '../modals/ModalDdjj'
import type { ClientData, DDJJRecord } from '@/lib/types'

interface Props {
  clientData: ClientData
  isAdmin: boolean
  onUpdate: (newData: ClientData) => void
}

export default function DdjjPage({ clientData, isAdmin, onUpdate }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set())

  function toggleFolder(tipo: string) {
    setOpenFolders(prev => {
      const next = new Set(prev)
      if (next.has(tipo)) next.delete(tipo)
      else next.add(tipo)
      return next
    })
  }

  function guardarDdjj(record: DDJJRecord) {
    onUpdate({ ...clientData, ddjj: [record, ...clientData.ddjj] })
    setShowModal(false)
  }

  // Agrupar por tipo de impuesto
  const grupos: Record<string, DDJJRecord[]> = {}
  clientData.ddjj.forEach(d => {
    if (!grupos[d.tipo]) grupos[d.tipo] = []
    grupos[d.tipo].push(d)
  })
  Object.values(grupos).forEach(arr => arr.sort((a, b) => b.fecha.localeCompare(a.fecha)))

  return (
    <div>
      <div className="page-header">
        <h1>Mis Declaraciones Juradas</h1>
        <p>Presentaciones realizadas ante AFIP / ARCA \u2014 organizadas por impuesto</p>
      </div>
      <div className="table-card">
        <div className="table-card-header">
          <h3>DDJJ por Impuesto</h3>
          {isAdmin && (
            <button className="btn-sm btn-add" onClick={() => setShowModal(true)}>
              + Cargar DDJJ
            </button>
          )}
        </div>
        {clientData.ddjj.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">\u{1F4C4}</div>
            No hay DDJJ cargadas a\u00FAn.
          </div>
        ) : (
          Object.entries(grupos).map(([tipo, items]) => (
            <div key={tipo} className="folder-group">
              <div className="folder-header" onClick={() => toggleFolder(tipo)}>
                <span className="folder-icon">\u{1F4C1}</span>
                <span className="folder-name">{tipo}</span>
                <span className="folder-count">
                  {items.length} presentaci\u00F3n{items.length !== 1 ? 'es' : ''}
                </span>
                <span className={`folder-arrow${openFolders.has(tipo) ? ' open' : ''}`}>\u203A</span>
              </div>
              {openFolders.has(tipo) && (
                <table>
                  <thead>
                    <tr>
                      <th>Per\u00EDodo</th><th>Fecha</th>
                      <th>N\u00B0 Transacci\u00F3n</th><th>Estado</th><th>Archivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((r, i) => (
                      <tr key={i}>
                        <td>{r.periodo}</td>
                        <td>{formatFecha(r.fecha)}</td>
                        <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{r.nro}</td>
                        <td><span className="badge badge-green">Presentada</span></td>
                        <td>
                          <button
                            className="btn-sm btn-download"
                            onClick={() => alert(`\u{1F4E5} Descargando: ${r.archivo}`)}
                          >
                            \u2B07 Descargar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))
        )}
      </div>
      {showModal && <ModalDdjj onSave={guardarDdjj} onClose={() => setShowModal(false)} />}
    </div>
  )
}
