'use client'
import { useState } from 'react'
import type { IVARecord } from '@/lib/types'

interface Props {
  onSave: (record: IVARecord) => void
  onClose: () => void
}

export default function ModalIva({ onSave, onClose }: Props) {
  const [periodo, setPeriodo] = useState('')
  const [archivo, setArchivo] = useState('')

  function handleSave() {
    if (!periodo) { alert('Ingrese el período'); return }
    onSave({ periodo, archivo: archivo || `WP_IVA_${periodo}.xlsx` })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>Cargar Liquidación IVA</h2>
        <div className="form-group">
          <label>Período (mes / año)</label>
          <input type="month" value={periodo} onChange={e => setPeriodo(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Nombre del archivo</label>
          <input type="text" placeholder="WP_IVA_Mayo2026.xlsx" value={archivo} onChange={e => setArchivo(e.target.value)} />
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-save" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  )
}
