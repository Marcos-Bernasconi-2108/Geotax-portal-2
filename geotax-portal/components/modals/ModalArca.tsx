'use client'
import { useState } from 'react'
import type { ARCAMessage } from '@/lib/types'

interface Props {
  onSave: (msg: Omit<ARCAMessage, 'leido'>) => void
  onClose: () => void
}

export default function ModalArca({ onSave, onClose }: Props) {
  const [fecha, setFecha] = useState('')
  const [asunto, setAsunto] = useState('')
  const [tipo, setTipo] = useState('Notificaci\u00F3n')
  const [desc, setDesc] = useState('')

  function handleSave() {
    if (!fecha || !asunto) { alert('Complete fecha y asunto'); return }
    onSave({ fecha, asunto, tipo, desc })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>Cargar Mensaje ARCA</h2>
        <div className="form-group">
          <label>Fecha del mensaje</label>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Asunto</label>
          <input type="text" placeholder="Ej: Solicitud de informaci\u00F3n" value={asunto} onChange={e => setAsunto(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Tipo</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)}>
            <option>Notificaci\u00F3n</option>
            <option>Requerimiento</option>
            <option>Intimaci\u00F3n</option>
            <option>Resoluci\u00F3n</option>
            <option>Informaci\u00F3n</option>
          </select>
        </div>
        <div className="form-group">
          <label>Descripci\u00F3n / Resumen</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descripci\u00F3n breve del mensaje..." />
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-save" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  )
}
