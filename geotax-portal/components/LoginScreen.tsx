'use client'
import { useState } from 'react'
import { USERS } from '@/lib/mockData'
import type { User } from '@/lib/types'

interface Props {
  onLogin: (user: User, clientId: string | null) => void
}

export default function LoginScreen({ onLogin }: Props) {
  const [selectedUserId, setSelectedUserId] = useState(USERS[0].cuit)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin() {
    const user = USERS.find(u => u.cuit === selectedUserId)
    if (!user) return
    if (password !== '1234') {
      setError('Contraseña incorrecta')
      return
    }
    const clientId = user.role === 'client' ? user.cuit : null
    onLogin(user, clientId)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">G</div>
        <h1 className="login-title">GeoTax</h1>
        <p className="login-subtitle">Portal de Clientes</p>
        <div className="form-group">
          <label>Usuario</label>
          <select value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)}>
            {USERS.map(u => (
              <option key={u.cuit} value={u.cuit}>
                {u.name} ({último: u.role === 'admin' ? 'Administrador' : 'Cliente'})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Ingrese su contraseña"
          />
        </div>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <button className="login-btn" onClick={handleLogin}>Ingresar</button>
        <p style={{ color: '#888', marginTop: '1rem', fontSize: '0.85rem' }}>
          Contraseña demo: 1234
        </p>
      </div>
    </div>
  )
}
