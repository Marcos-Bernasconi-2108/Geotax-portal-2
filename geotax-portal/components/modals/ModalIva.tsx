'use client'
import { useState } from 'react'
import type { IVARecord } from '@/lib/types'

interface Props {
  onSave: (rec: IVARecord) => void
  onClose: () => void
}

export default function ModalIva({ onSave, onClose }: Props) {
  const [periodo, setPeriodo] = useState('')
  const [archivo, setArchivo] = useState('')

  function handleSave() {
    if (!periodo.trim()) return
    onSave({ periodo, archivo: archivo || `IVA_${periodo}.pdf` })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Cargar liquidación IVA</h2>
        <div className="form-group">
          <label>Período (YYYY-MM)</label>
          <input type="text" value={periodo} onChange={e => setPeriodo(e.target.value)} placeholder="2024-01" />
        </div>
        <div className="form-group">
          <label>Nombre de archivo</label>
          <input type="text" value={archivo} onChange={e => setArchivo(e.target.value)} placeholder="IVA_2024-01.pdf" />
        </div>
        <div className="modal-actions">
          <button className="btn-sm" onClick={onClose}>Cancelar</button>
          <button className="btn-sm btn-add" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  )
}
