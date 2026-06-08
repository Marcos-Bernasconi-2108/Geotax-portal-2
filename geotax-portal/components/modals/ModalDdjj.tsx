'use client'
import { useState } from 'react'
import type { DDJJRecord } from '@/lib/types'

interface Props {
  onSave: (record: DDJJRecord) => void
  onClose: () => void
}

export default function ModalDdjj({ onSave, onClose }: Props) {
  const [tipo, setTipo] = useState('IVA')
  const [periodo, setPeriodo] = useState('')
  const [fecha, setFecha] = useState('')
  const [nro, setNro] = useState('')
  const [archivo, setArchivo] = useState('')

  function handleSave() {
    if (!periodo || !fecha) { alert('Complete per\u00EDodo y fecha'); return }
    onSave({ tipo, periodo, fecha, nro, archivo: archivo || `DDJJ_${tipo}_${periodo}.pdf` })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>Cargar DDJJ</h2>
        <div className="form-group">
          <label>Impuesto / R\u00E9gimen</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)}>
            <option>IVA</option>
            <option>Ganancias Personas F\u00EDsicas</option>
            <option>Bienes Personales</option>
            <option>Monotributo</option>
            <option>IIBB Convenio Multilateral</option>
            <option>Aut\u00F3nomos</option>
            <option>Otro</option>
          </select>
        </div>
        <div className="form-group">
          <label>Per\u00EDodo</label>
          <input type="text" placeholder="Ej: Mayo 2026 / Anual 2025" value={periodo} onChange={e => setPeriodo(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Fecha de Presentaci\u00F3n</label>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
        </div>
        <div className="form-group">
          <label>N\u00FAmero de Transacci\u00F3n</label>
          <input type="text" placeholder="Ej: 1234567890" value={nro} onChange={e => setNro(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Nombre del archivo</label>
          <input type="text" placeholder="DDJJ_IVA_Mayo2026.pdf" value={archivo} onChange={e => setArchivo(e.target.value)} />
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-save" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  )
}
