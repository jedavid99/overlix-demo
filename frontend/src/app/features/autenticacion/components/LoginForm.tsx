import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../../contexts/AuthContext'
import Loader from './Loader'
interface LoginFormProps {
  onSwitchToRegister?: () => void
}
export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const navigate = useNavigate()
  const { login, error: authError } = useAuth()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formMessage, setFormMessage] = useState<{ type: 'error' | 'info' | 'success' | null; text: string }>({ type: null, text: '' })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const username = formData.username.trim()
    const password = formData.password
    if (!username || !password) {
      setFormMessage({ type: 'error', text: 'Por favor completa usuario y contraseña.' })
      setIsLoading(false)
      return
    }
    try {
      // In this preview we simulate a login by calling the stub login()
      await login()
      localStorage.setItem('adminUser', username)
      localStorage.setItem('adminAuth', 'true')
      setFormMessage({ type: 'success', text: 'Login exitoso. Redirigiendo...' })
      navigate('/dashboard')
      return
    } catch (error) {
      console.error('Login error:', error)
      setFormMessage({ type: 'error', text: 'Error de red. Intenta más tarde.' })
    } finally {
      setIsLoading(false)
    }
  }
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <Loader size="full" />
      </div>
    )
  }
  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: 100, rotateY: -90 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      exit={{ opacity: 0, x: -100, rotateY: 90 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="p-8 md:p-10 bg-white/95 backdrop-blur-sm rounded-3xl w-88 md:w-96 shadow-2xl border border-white/20"
    >
      <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <h3 className="font-bold text-2xl text-slate-900">Iniciar sesión</h3>
        <p className="text-slate-500 mt-1">¿No tienes cuenta? <button onClick={() => { onSwitchToRegister?.(); setFormMessage({ type: null, text: '' }) }} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">Regístrate</button></p>
      </motion.div>
      {(formMessage.type || authError) && (
        <motion.div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${(authError || formMessage.type === 'error') ? 'bg-red-50 text-red-700 border border-red-200' : formMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          <div className="flex items-center">
            {(authError || formMessage.type === 'error') && (
              <svg className="w-4 h-4 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {!(authError || formMessage.type === 'error') && (
              <svg className="w-4 h-4 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {authError || formMessage.text}
          </div>
        </motion.div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
            <div className="relative">
              <input className="w-full text-sm px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Email" required />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }} className="relative">
            <input className="w-full text-sm px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-10" placeholder="Contraseña" type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" aria-hidden>
                    <path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" aria-hidden>
                    <path fill="currentColor" d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0  0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>
          <motion.div className="flex items-center justify-between text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.25 }}>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <span className="ml-2 text-slate-600">Recordar sesión</span>
            </label>
            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">¿Olvidaste tu contraseña?</a>
          </motion.div>
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }} type="submit" disabled={isLoading} className="w-full flex justify-center items-center bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3.5 px-4 rounded-xl tracking-wide font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verificando...
              </>
            ) : (
              'Iniciar sesión'
            )}
          </motion.button>
          <motion.div className="mt-6 border-t border-slate-200 pt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.35 }}>
            <div className="text-sm text-slate-600">¿No tienes el sistema?</div>
            <a href="/landing" className="mt-2 inline-flex items-center justify-center w-full px-4 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors font-medium">Conoce el Sistema de Gestión</a>
          </motion.div>
        </div>
      </form>
      <motion.div className="mt-8 text-center text-slate-400 text-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.4 }}>
        &copy; 2024 RepairFlow. Todos los derechos reservados.
      </motion.div>
    </motion.div>
  )
}
