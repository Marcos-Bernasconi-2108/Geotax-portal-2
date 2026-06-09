'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { USERS } from '@/lib/mockData'
import type { User } from '@/lib/types'

interface Props {
  onLogin: (user: User, clientId: string | null) => void
  onSignUpClick?: () => void
}

export default function LoginScreen({ onLogin, onSignUpClick }: Props) {
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

      // Obtener rol de la tabla profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, name')
        .eq('id', data.user.id)
        .single()

      const user: User = {
        cuit: data.user.id,
        name: profile?.name || data.user.email?.split('@')[0] || 'Usuario',
        role: (profile?.role as 'admin' | 'client') || 'client'
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
        <p style={{ color: '#888', marginTop: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
          ¿No tienes cuenta? <span onClick={onSignUpClick} style={{ color: '#0066cc', cursor: 'pointer' }}>Regístrate aquí</span>
        </p>
      </div>
    </div>
  )
}
