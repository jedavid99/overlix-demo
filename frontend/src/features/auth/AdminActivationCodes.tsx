import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Key, 
  Copy, 
  Plus, 
  Trash2, 
  Shield,
  LogOut,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '../../shared/components/ui/button';
import { Card } from '../../shared/components/ui/card';
import logo from '/ovelix-claro.png';
// Admin email for access control
const ADMIN_EMAIL = 'admin@overlix.com';
interface ActivationCode {
  id: string;
  code: string;
  createdAt: string;
  used: boolean;
  usedAt?: string;
}
export default function AdminActivationCodes() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [codes, setCodes] = useState<ActivationCode[]>([]);
  const [newCode, setNewCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  // Check admin access
  useEffect(() => {
    const checkAdminAccess = () => {
      const token = localStorage.getItem('access_token');
      const userEmail = localStorage.getItem('user_email');
      
      if (!token) {
        navigate('/');
        return;
      }
      // Check if user is admin (you can modify this logic as needed)
      if (userEmail === ADMIN_EMAIL) {
        setIsAdmin(true);
        loadCodes();
      } else {
        navigate('/dashboard'); // Redirect non-admin users
      }
      
      setIsChecking(false);
    };
    checkAdminAccess();
  }, [navigate]);
  // Load codes from localStorage
  const loadCodes = () => {
    const storedCodes = localStorage.getItem('activation_codes');
    if (storedCodes) {
      setCodes(JSON.parse(storedCodes));
    }
  };
  // Generate activation code
  const generateCode = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const code = 'OVERLIX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const newActivationCode: ActivationCode = {
        id: Date.now().toString(),
        code,
        createdAt: new Date().toISOString(),
        used: false
      };
      const updatedCodes = [newActivationCode, ...codes];
      localStorage.setItem('activation_codes', JSON.stringify(updatedCodes));
      setCodes(updatedCodes);
      setNewCode(code);
      setIsGenerating(false);
    }, 500);
  };
  // Copy code to clipboard
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };
  // Delete code
  const deleteCode = (id: string) => {
    const updatedCodes = codes.filter(c => c.id !== id);
    localStorage.setItem('activation_codes', JSON.stringify(updatedCodes));
    setCodes(updatedCodes);
    setShowDeleteConfirm(null);
  };
  // Mark code as used
  const markAsUsed = (id: string) => {
    const updatedCodes = codes.map(c => 
      c.id === id 
        ? { ...c, used: true, usedAt: new Date().toISOString() }
        : c
    );
    localStorage.setItem('activation_codes', JSON.stringify(updatedCodes));
    setCodes(updatedCodes);
  };
  // Logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    navigate('/');
  };
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f9f9ff]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#0058be] mx-auto mb-4" />
          <p className="text-[#424754]">Verificando acceso...</p>
        </div>
      </div>
    );
  }
  if (!isAdmin) {
    return null;
  }
  return (
    <main className="min-h-screen bg-[#f9f9ff] text-[#191b23]">
      {/* Header */}
      <header className="bg-white border-b border-[#c2c6d6]/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Overlix" className="w-10 h-10 rounded-full" />
            <div>
              <h1 className="text-xl font-bold text-[#191b23]">Panel de Administración</h1>
              <p className="text-xs text-[#727785]">Gestión de Códigos de Activación</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Button>
        </div>
      </header>
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-white border border-[#c2c6d6]/60">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Key className="w-6 h-6 text-[#0058be]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#191b23]">{codes.length}</p>
                <p className="text-sm text-[#727785]">Total de códigos</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-[#c2c6d6]/60">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#191b23]">{codes.filter(c => !c.used).length}</p>
                <p className="text-sm text-[#727785]">Códigos disponibles</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white border border-[#c2c6d6]/60">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#191b23]">{codes.filter(c => c.used).length}</p>
                <p className="text-sm text-[#727785]">Códigos usados</p>
              </div>
            </div>
          </Card>
        </div>
        {/* Generate Code Section */}
        <Card className="p-6 bg-white border border-[#c2c6d6]/60 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#191b23] mb-1">Generar Nuevo Código</h2>
              <p className="text-sm text-[#727785]">Crea un código de activación para nuevos usuarios</p>
            </div>
            <Button
              onClick={generateCode}
              disabled={isGenerating}
              className="bg-[#0058be] hover:bg-[#2170e4] flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Generar Código
                </>
              )}
            </Button>
          </div>
          {newCode && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-[#191b23]">Código generado exitosamente</p>
                      <p className="text-lg font-bold text-[#0058be] font-mono">{newCode}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyCode(newCode)}
                    className="flex items-center gap-2"
                  >
                    {copiedCode === newCode ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </Card>
        {/* Codes List */}
        <Card className="bg-white border border-[#c2c6d6]/60">
          <div className="p-6 border-b border-[#c2c6d6]/60">
            <h2 className="text-lg font-semibold text-[#191b23]">Historial de Códigos</h2>
          </div>
          <div className="divide-y divide-[#c2c6d6]/60">
            {codes.length === 0 ? (
              <div className="p-12 text-center">
                <Key className="w-12 h-12 text-[#c2c6d6] mx-auto mb-4" />
                <p className="text-[#727785]">No hay códigos generados aún</p>
              </div>
            ) : (
              codes.map((code) => (
                <motion.div
                  key={code.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        code.used ? 'bg-orange-100' : 'bg-green-100'
                      }`}>
                        {code.used ? (
                          <AlertCircle className="w-5 h-5 text-orange-600" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-mono font-bold text-[#191b23]">{code.code}</p>
                        <div className="flex items-center gap-2 text-xs text-[#727785]">
                          <span>Creado: {new Date(code.createdAt).toLocaleDateString()}</span>
                          {code.used && (
                            <>
                              <span>•</span>
                              <span>Usado: {new Date(code.usedAt!).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!code.used && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyCode(code.code)}
                          className="flex items-center gap-2"
                        >
                          {copiedCode === code.code ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copiar
                            </>
                          )}
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(code.id)}
                        className="flex items-center gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                  {showDeleteConfirm === code.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <p className="text-sm text-red-800 mb-3">
                        ¿Estás seguro de que deseas eliminar este código?
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(null)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteCode(code.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
