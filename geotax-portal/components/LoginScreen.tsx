'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { USERS } from '@/lib/mockData'
import type { User } from '@/lib/types'

interface Props {
  onLogin: (user: User, clientId: string | null) => void
}

export default function LoginScreen({ onLogin }: Props) {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  async function handleLogin() {
    setError('')
    setLoading(true)

    try {
      // Autenticar con Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message || 'Error al iniciar sesión')
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('Error desconocido al iniciar sesión')
        setLoading(false)
        return
      }

      // Determinar rol del usuario (admin o cliente)
      // Por ahora, asumimos que es admin si el email está en la lista de empleados
      const employeeEmails = [
        'gaston.bernasconi@geotax.com.ar',
        'marcos.bernasconi@geotax.com.ar',
        'santiago.cremonini@geotax.com.ar',
        'belen.valdes@geotax.com.ar',
        'luana.campos@geotax.com.ar'
      ]

      const isAdmin = employeeEmails.includes(email.toLowerCase())
      const user: User = {
        cuit: data.user.id,
        name: data.user.email?.split('@')[0] || 'Usuario',
        role: isAdmin ? 'admin' : 'client'
      }

      onLogin(user, null)
    } catch (err) {
      setError('Error al conectar con el servidor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">G</div>
        <h1 className="login-title">GeoTax</h1>
        <p className="login-subtitle">Portal de Clientes</p>
        <div className="form-group">
          <label>Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && handleLogin()}
            placeholder="tu@email.com"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && handleLogin()}
            placeholder="Ingrese su contraseña"
            disabled={loading}
          />
        </div>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </div>
    </div>
  )
}
