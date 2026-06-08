'use client'
import { useState } from 'react'
import type { VEPRecord } from '@/lib/types'

interface Props {
  onSave: (record: Omit<VEPRecord, 'pagado'>) => void
  onClose: () => void
}

export default function ModalVep({ onSave, onClose }: Props) {
  const [concepto, setConcepto] = useState('IVA')
  const [periodo, setPeriodo] = useState('')
  const [importe, setImporte] = useState('')
  const [vencimiento, setVencimiento] = useState('')

  function handleSave() {
    if (!periodo || !vencimiento) { alert('Complete per\u00EDodo y vencimiento'); return }
    onSave({ concepto, periodo, importe: parseFloat(importe) || 0, vencimiento })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>Cargar VEP</h2>
        <div className="form-group">
          <label>Concepto</label>
          <select value={concepto} onChange={e => setConcepto(e.target.value)}>
            <option>IVA</option>
            <option>Ganancias</option>
            <option>Bienes Personales</option>
            <option>Monotributo</option>
            <option>Aut\u00F3nomos</option>
            <option>IIBB</option>
            <option>Otro</option>
          </select>
        </div>
        <div className="form-group">
          <label>Per\u00EDodo</label>
          <input type="text" placeholder="Ej: Mayo 2026" value={periodo} onChange={e => setPeriodo(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Importe ($)</label>
          <input type="number" placeholder="0.00" value={importe} onChange={e => setImporte(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Fecha de Vencimiento</label>
          <input type="date" value={vencimiento} onChange={e => setVencimiento(e.target.value)} />
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-save" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  )
}
