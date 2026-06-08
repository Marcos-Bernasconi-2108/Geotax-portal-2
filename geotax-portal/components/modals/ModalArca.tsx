'use client'
import { useState } from 'react'
import type { ARCAMessage } from '@/lib/types'

interface Props {
  onSave: (msg: Omit<ARCAMessage, 'leido'>) => void
  onClose: () => void
}

const TIPOS = ['Requerimiento', 'Notificación', 'Resolución', 'Información', 'Intimación']

export default function ModalArca({ onSave, onClose }: Props) {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [asunto, setAsunto] = useState('')
  const [tipo, setTipo] = useState(TIPOS[0])
  const [desc, setDesc] = useState('')

  function handleSave() {
    if (!asunto.trim()) return
    onSave({ fecha, asunto, tipo, desc })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Cargar mensaje ARCA</h2>
        <div className="form-group">
          <label>Fecha</label>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Asunto</label>
          <input type="text" value={asunto} onChange={e => setAsunto(e.target.value)} placeholder="Asunto del mensaje" />
        </div>
        <div className="form-group">
          <label>Tipo</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)}>
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="Descripción opcional" />
        </div>
        <div className="modal-actions">
          <button className="btn-sm" onClick={onClose}>Cancelar</button>
          <button className="btn-sm btn-add" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  )
}
