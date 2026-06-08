'use client'
import { useState } from 'react'
import { USERS } from '@/lib/mockData'
import type { User } from '@/lib/types'

interface Props {
  onLogin: (user: User, clientId: string) => void
}

export default function LoginScreen({ onLogin }: Props) {
  const [selectedRole, setSelectedRole] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleLogin() {
    if (!selectedRole || password !== '1234') {
      setError(true)
      return
    }
    const user = USERS[selectedRole]
    const clientId = user.role === 'admin' ? 'client-1' : selectedRole
    onLogin(user, clientId)
  }

  return (
    <div id="login-screen">
      <div className="login-box">
        <div className="login-logo">GeoTax</div>
        <div className="login-sub">Portal de Clientes</div>
        <select
          value={selectedRole}
          onChange={e => { setSelectedRole(e.target.value); setError(false) }}
        >
          <option value="">Seleccionar acceso...</option>
          <option value="admin">GeoTax (Administrador)</option>
          <option value="client-1">Juan Pérez (Cliente)</option>
          <option value="client-2">María González (Cliente)</option>
          <option value="client-3">Empresa Demo SRL (Cliente)</option>
        </select>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <button className="btn-primary" onClick={handleLogin}>Ingresar</button>
        {error && (
          <div className="login-error">Credenciales incorrectas. Intente nuevamente.</div>
        )}
      </div>
    </div>
  )
}
