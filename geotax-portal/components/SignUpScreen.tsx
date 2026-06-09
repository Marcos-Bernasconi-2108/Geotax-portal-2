'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Props {
  onSignUpSuccess: () => void
}

export default function SignUpScreen({ onSignUpSuccess }: Props) {
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [loading, setLoading]       = useState(false)

  async function handleSignUp() {
    setError('')
    setSuccess('')
    setLoading(true)

    // Validaciones
    if (!email) {
      setError('El correo electrónico es requerido')
      setLoading(false)
      return
    }

    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        setError(signUpError.message || 'Error al registrarse')
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('Error al crear la cuenta')
        setLoading(false)
        return
      }

      // Verificar si el email es de un admin
      const { data: adminCheck } = await supabase
        .from('admin_users')
        .select('id')
        .eq('email', email.toLowerCase())
        .single()

      const role = adminCheck ? 'admin' : 'client'
      const clientId = role === 'admin' ? null : 'client-1'

      // Crear perfil en la tabla profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name: email.split('@')[0],
          role,
          client_id: clientId,
        })

      if (profileError) {
        setError('Error al crear el perfil')
        setLoading(false)
        return
      }

      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        onSignUpSuccess()
      }, 2000)
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
        <p className="login-subtitle">Crear Cuenta</p>
        <div className="form-group">
          <label>Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
            placeholder="Mínimo 6 caracteres"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Confirmar Contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirma tu contraseña"
            disabled={loading}
          />
        </div>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginBottom: '1rem' }}>{success}</p>}
        <button
          className="login-btn"
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        <p style={{ color: '#888', marginTop: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
          ¿Ya tienes cuenta? <a href="/" style={{ color: '#0066cc', cursor: 'pointer' }}>Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  )
}
