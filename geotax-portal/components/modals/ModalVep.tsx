'use client'
import { useState } from 'react'
import type { VEPRecord } from '@/lib/types'

interface Props {
  onSave: (rec: VEPRecord) => void
  onClose: () => void
}

const CONCEPTOS = ['IVA', 'Ganancias', 'Bienes Personales', 'IIBB', 'Empleados', 'Otro']

export default function ModalVep({ onSave, onClose }: Props) {
  const [concepto, setConcepto] = useState(CONCEPTOS[0])
  const [periodo, setPeriodo] = useState('')
  const [importe, setImporte] = useState('')
  const [vencimiento, setVencimiento] = useState('')

  function handleSave() {
    if (!periodo.trim() || !importe || !vencimiento) return
    onSave({ concepto, periodo, importe: Number(importe), vencimiento, pagado: false })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Cargar VEP</h2>
        <div className="form-group">
          <label>Concepto</label>
          <select value={concepto} onChange={e => setConcepto(e.target.value)}>
            {CONCEPTOS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Período (YYYY-MM)</label>
          <input type="text" value={periodo} onChange={e => setPeriodo(e.target.value)} placeholder="2024-01" />
        </div>
        <div className="form-group">
          <label>Importe ($)</label>
          <input type="number" value={importe} onChange={e => setImporte(e.target.value)} placeholder="0" />
        </div>
        <div className="form-group">
          <label>Fecha de vencimiento</label>
          <input type="date" value={vencimiento} onChange={e => setVencimiento(e.target.value)} />
        </div>
        <div className="modal-actions">
          <button className="btn-sm" onClick={onClose}>Cancelar</button>
          <button className="btn-sm btn-add" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  )
}
