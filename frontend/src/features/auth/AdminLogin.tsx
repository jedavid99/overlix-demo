import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Lock, 
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../../shared/components/ui/button';
import { Input } from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import logo from '/ovelix-claro.png';

// Admin credentials from environment variables (more secure)
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';
export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Check if environment variables are configured
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      setError('Configuración de administrador no disponible. Contacte al soporte técnico.');
      setIsLoading(false);
      return;
    }
    
    // Simulate API call delay
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Store admin session
        localStorage.setItem('admin_session', 'true');
        localStorage.setItem('admin_email', email);
        navigate('/admin/generate-codes');
      } else {
        setError('Credenciales incorrectas');
      }
      setIsLoading(false);
    }, 500);
  };
  return (
    <main className="flex min-h-screen flex-col lg:flex-row bg-[#f9f9ff] text-[#191b23] select-none">
      {/* Left section - branding */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1588515603140-81bd9f7d1db0?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent/95 to-transparent/70 z-10"></div>
        <div className="relative z-20 max-w-lg text-white flex flex-col justify-center items-center h-full text-center py-16">
          <div className="flex flex-col items-center space-y-6">
            <motion.div
              className="relative group"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 -z-10 bg-gradient-to-tr from-slate-800 via-blue-900 to-indigo-900 blur-2xl rounded-full scale-150"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="p-[3px] rounded-full bg-gradient-to-br from-slate-400 via-blue-300 to-slate-600 shadow-2xl shadow-blue-900/40 transition-all duration-700 group-hover:shadow-blue-700/70">
                <img src={logo} alt="Overlix" className="w-40 h-40 rounded-full object-cover border-4 border-white/80 bg-black/30" />
              </div>
            </motion.div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                Panel de Administración
              </span>
              <br />
              <span className="text-blue-200/60 text-base lg:text-xl font-light tracking-[0.2em] uppercase">
                Generación de Códigos
              </span>
            </h1>
          </div>
        </div>
      </section>
      {/* Right section - form */}
      <section className="flex-1 flex flex-col justify-between min-h-screen p-6 lg:p-12 relative">
        {/* Mobile logo */}
        <div className="w-full lg:hidden flex items-center justify-center py-4">
          <img src={logo} alt="Overlix" className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white/80 bg-black/30" />
        </div>
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-[440px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-xl border border-[#c2c6d6]/60 p-8 lg:p-10"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#191b23] tracking-tight mb-2">
                  Acceso Administrativo
                </h2>
                <p className="text-sm text-[#424754]">
                  Ingresa tus credenciales para generar códigos de activación
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@overlix.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={error}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#727785] hover:text-[#191b23] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-500 font-medium"
                  >
                    {error}
                  </motion.p>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-4 bg-[#0058be] text-white hover:bg-[#2170e4] active:scale-[0.99] font-medium text-sm rounded-xl shadow-md cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verificando...' : 'Ingresar'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </form>
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate('/')}
                  className="text-sm text-[#727785] hover:text-[#0058be] transition-colors"
                >
                  ← Volver al login principal
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
