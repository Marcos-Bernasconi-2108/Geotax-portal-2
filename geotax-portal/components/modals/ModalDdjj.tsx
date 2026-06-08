'use client'
import { useState } from 'react'
import type { DDJJRecord } from '@/lib/types'

interface Props {
  onSave: (rec: DDJJRecord) => void
  onClose: () => void
}

const TIPOS = ['Ganancias', 'Bienes Personales', 'IVA Anual', 'IIBB', 'Empleados (F931)', 'Otro']

export default function ModalDdjj({ onSave, onClose }: Props) {
  const [tipo, setTipo] = useState(TIPOS[0])
  const [periodo, setPeriodo] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [nro, setNro] = useState('')
  const [archivo, setArchivo] = useState('')

  function handleSave() {
    if (!periodo.trim()) return
    onSave({ tipo, periodo, fecha, nro: nro || 'S/N', archivo: archivo || `DDJJ_${tipo}_${periodo}.pdf` })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Cargar DDJJ</h2>
        <div className="form-group">
          <label>Tipo</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)}>
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Período (YYYY-MM o YYYY)</label>
          <input type="text" value={periodo} onChange={e => setPeriodo(e.target.value)} placeholder="2024-01" />
        </div>
        <div className="form-group">
          <label>Fecha de presentación</label>
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Número de transacción</label>
          <input type="text" value={nro} onChange={e => setNro(e.target.value)} placeholder="000001" />
        </div>
        <div className="form-group">
          <label>Nombre de archivo</label>
          <input type="text" value={archivo} onChange={e => setArchivo(e.target.value)} placeholder="DDJJ.pdf" />
        </div>
        <div className="modal-actions">
          <button className="btn-sm" onClick={onClose}>Cancelar</button>
          <button className="btn-sm btn-add" onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  )
}
