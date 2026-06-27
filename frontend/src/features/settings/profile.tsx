import React, { useState } from 'react'
import { Edit, Lock, Smartphone, ArrowUpRight, ArrowDownRight, Download, UserPlus, X, Users } from 'lucide-react'
import { MdInfo, MdContentCopy, MdBarChart } from 'react-icons/md'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import CreateUserModal from './CreateUserModal'
// Tipos
interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: 'active' | 'inactive'
  joinDate: string
}
export default function Profile() {
  // 📦 Estado del usuario logueado – vacío (cargar desde API)
  const [userData] = useState({
    name: '',
    role: '',
    employeeId: '',
    department: '',
    email: '',
    phone: '',
    rating: 0,
    ratingMax: 5.0,
    status: '',
  })
  // 📦 Actividad – vacía (cargar desde API)
  const [activities] = useState<{
    time: string
    type: string
    entity: string
    description: string
    status: string
  }[]>([])
  // 📦 Rendimiento – vacío (cargar desde API)
  const [performanceData] = useState<{
    period: string
    resolved: string
    avgTime: string
    compliance: string
    rating: string
    trend: string
  }[]>([])
  // 📦 Lista de usuarios – vacía (cargar desde API)
  const [users, setUsers] = useState<User[]>([])
  // Estado del modal de crear usuario
  const [showUserModal, setShowUserModal] = useState(false)
  const handleCreateUser = (user: any) => {
    console.log('Usuario creado:', user)
    // Aquí iría la lógica para guardar el usuario en la API
    // Simulamos agregar a la lista local
    const newUser: User = {
      id: Date.now().toString(),
      name: user.fullName,
      email: user.email,
      role: user.role || 'Técnico',
      department: user.department || 'Taller',
      status: 'active',
      joinDate: new Date().toLocaleDateString('es-AR'),
    }
    setUsers([...users, newUser])
    setShowUserModal(false)
  }
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 lg:p-8 shadow-md">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Avatar & Info */}
            <div className="flex gap-6">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {userData.name ? userData.name.charAt(0) : '?'}
              </div>
              <div className="flex-1 pt-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                      {userData.name || 'Sin nombre'}
                    </h1>
                    <p className="text-sm lg:text-base text-muted-foreground mt-1">
                      {userData.role || 'Sin rol asignado'}
                    </p>
                  </div>
                  <button className="p-2 rounded-full hover:bg-muted/50 text-muted-foreground">
                    <Edit size={20} />
                  </button>
                </div>
                <div className="mt-3 text-xs lg:text-sm text-muted-foreground space-y-1">
                  <p>
                    {userData.employeeId ? `🆔 ${userData.employeeId}` : 'Sin ID de empleado'}
                    {userData.department && ` • ${userData.department}`}
                  </p>
                </div>
              </div>
            </div>
            {/* Rating Card */}
            <div className="bg-gradient-to-br from-primary to-primary-hover rounded-lg p-6 flex flex-col items-center justify-center text-primary-foreground min-w-max">
              <p className="text-xs font-medium text-primary-foreground/80 mb-2">RATING MENSUAL</p>
              <div className="text-4xl lg:text-5xl font-bold">
                {userData.rating || '—'}
                <span className="text-2xl lg:text-3xl font-normal text-primary-foreground/80">
                  /{userData.ratingMax}
                </span>
              </div>
              <div className="mt-3 px-3 py-1 bg-primary-foreground/20 rounded-full text-xs font-semibold">
                {userData.status || 'Sin calificación'}
              </div>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Information Section */}
          <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                <MdInfo size={12} className="text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Información</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  NOMBRE COMPLETO
                </label>
                <p className="mt-2 text-foreground font-medium">
                  {userData.name || '—'}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  ID DE EMPLEADO
                </label>
                <p className="mt-2 text-foreground font-medium">
                  {userData.employeeId || '—'}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  CORREO ELECTRÓNICO
                </label>
                <p className="mt-2 text-foreground font-medium">
                  {userData.email || '—'}
                </p>
              </div>
            </div>
          </div>
          {/* Security & Access Section */}
          <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock size={14} className="text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Seguridad y Acceso</h2>
            </div>
            <div className="space-y-4">
              {/* Change Password */}
              <div className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium text-foreground">Cambiar Contraseña</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {userData.email ? 'Actualizado recientemente' : 'Sin actualizar'}
                  </p>
                </div>
                <button className="text-primary hover:text-primary-hover text-sm font-medium">
                  Gestionar
                </button>
              </div>
              {/* Two-Factor Auth */}
              <div className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone size={18} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Autenticación 2FA</p>
                    <p className="text-xs text-muted-foreground mt-1">DESACTIVADO</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-muted rounded-full relative cursor-pointer">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Activity Log */}
        <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MdContentCopy size={20} />
              <h2 className="text-lg font-semibold text-foreground">Registro de Actividad</h2>
            </div>
            <button className="text-primary text-sm font-medium hover:underline">
              Ver todas ↓
            </button>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Historial completo de acciones administrativas y de reparación
          </p>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="font-medium">No hay actividad registrada</p>
              <p className="text-xs">Las acciones recientes aparecerán aquí</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light dark:border-border-dark">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">HORA</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">TIPO</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">ENTIDAD</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">DESCRIPCIÓN</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">ESTADO</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, idx) => (
                    <tr key={idx} className="border-b border-border-light dark:divide-border-dark hover:bg-muted/50">
                      <td className="py-4 px-4 text-muted-foreground">{activity.time}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          activity.type === 'REPAIR' ? 'bg-green-500/10 text-green-600' :
                          activity.type === 'ASSIGNMENT' ? 'bg-primary/10 text-primary' :
                          'bg-muted/50 text-muted-foreground'
                        }`}>
                          {activity.type}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-foreground">{activity.entity}</td>
                      <td className="py-4 px-4 text-muted-foreground max-w-xs truncate">{activity.description}</td>
                      <td className="py-4 px-4">
                        <span className={`flex items-center gap-1 text-xs font-semibold ${
                          activity.status === 'SUCCESS' ? 'text-green-600' :
                          activity.status === 'PENDING' ? 'text-yellow-600' :
                          'text-muted-foreground'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            activity.status === 'SUCCESS' ? 'bg-green-600' :
                            activity.status === 'PENDING' ? 'bg-yellow-600' :
                            'bg-muted-foreground'
                          }`}></span>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-4 text-center">
            <button className="text-primary text-sm font-medium">
              VER AUDITORÍA COMPLETA →
            </button>
          </div>
        </div>
        {/* Performance Analytics */}
        <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <MdBarChart size={20} />
              <div>
                <h2 className="text-lg font-semibold text-foreground">Análisis de Rendimiento</h2>
                <p className="text-xs text-muted-foreground">Datos históricos de eficiencia y puntuación del técnico</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-full">
              <Download size={16} />
              Exportar CSV
            </button>
          </div>
          {performanceData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="font-medium">No hay datos de rendimiento disponibles</p>
              <p className="text-xs">Los datos se mostrarán una vez que haya actividad</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light dark:border-border-dark">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">PERIODO</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">RESUELTOS</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">TIEMPO PROM.</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">CUMPLIMIENTO SLA</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">CALIFICACIÓN</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">TENDENCIA</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceData.map((data, idx) => (
                    <tr key={idx} className="border-b border-border-light dark:divide-border-dark hover:bg-muted/50">
                      <td className="py-4 px-4 font-medium text-foreground">{data.period}</td>
                      <td className="py-4 px-4 text-muted-foreground">{data.resolved}</td>
                      <td className="py-4 px-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          {data.avgTime && (
                            data.avgTime.includes('42') ? (
                              <ArrowDownRight size={16} className="text-green-600" />
                            ) : (
                              <ArrowUpRight size={16} className="text-muted-foreground" />
                            )
                          )}
                          {data.avgTime || '—'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {data.compliance ? (
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary to-primary-hover"
                                style={{ width: `${Math.min(parseInt(data.compliance), 100)}%` }}
                              ></div>
                            </div>
                            <span className="font-medium text-foreground">{data.compliance}</span>
                          </div>
                        ) : '—'}
                      </td>
                      <td className="py-4 px-4 font-medium text-foreground">{data.rating || '—'}</td>
                      <td className="py-4 px-4">
                        {data.trend && (
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <ArrowUpRight size={14} />
                            {data.trend}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* ========== NUEVA SECCIÓN: USUARIOS DEL SISTEMA ========== */}
        <div className="bg-card-light dark:bg-card-dark rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users size={20} />
              <h2 className="text-lg font-semibold text-foreground">Usuarios del Sistema</h2>
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                {users.length}
              </span>
            </div>
            <Button
              onClick={() => setShowUserModal(true)}
              className="bg-[#0058be] hover:bg-[#2170e4] flex items-center gap-2"
              size="sm"
            >
              <UserPlus size={16} />
              Agregar Usuario
            </Button>
          </div>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users size={48} className="mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-medium">No hay usuarios registrados</p>
              <p className="text-xs">Agrega usuarios para gestionar el acceso al sistema</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light dark:border-border-dark">
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">NOMBRE</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">EMAIL</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">ROL</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">DEPARTAMENTO</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">ESTADO</th>
                    <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs">FECHA DE REGISTRO</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border-light dark:divide-border-dark hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium text-foreground">{user.name}</td>
                      <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.role === 'Administrador' ? 'bg-primary/10 text-primary' :
                          user.role === 'Técnico' ? 'bg-green-500/10 text-green-600' :
                          'bg-muted/50 text-muted-foreground'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{user.department}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{user.joinDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Modal de creación de usuario */}
        <CreateUserModal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          onCreateUser={handleCreateUser}
        />
      </div>
    </div>
  )
}
