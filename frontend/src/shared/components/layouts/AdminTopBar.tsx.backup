"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Bell, User, ChevronDown, ArrowRightToLine, LogOut } from 'lucide-react'
import { MdSearch, MdSettings, MdBarChart, MdInventory2, MdAttachMoney, MdReceipt } from 'react-icons/md'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover'

const categories = [
  { value: 'all', label: 'Todo', placeholder: 'Buscar en Overlix...', route: '/dashboard' },
  { value: 'sales', label: 'Ventas', placeholder: 'Buscar venta...', route: '/sales' },
  { value: 'repairs', label: 'Reparaciones', placeholder: 'Buscar reparación...', route: '/reparaciones/list' },
  { value: 'clients', label: 'Clientes', placeholder: 'Buscar cliente...', route: '/clients' },
  { value: 'expenses', label: 'Gastos', placeholder: 'Buscar gasto...', route: '/expenses' },
  { value: 'stock', label: 'Stock', placeholder: 'Buscar producto...', route: '/stock' },
  { value: 'shipments', label: 'Envíos', placeholder: 'Buscar envío...', route: '/envios/tracking' },
  { value: 'orders', label: 'Órdenes de Compra', placeholder: 'Buscar orden de compra...', route: '/providers/orders', icon: <MdReceipt size={16} /> },
  { value: 'reports-sales', label: 'Reporte Ventas', placeholder: 'Buscar en reporte de ventas...', route: '/reports/sales', icon: <MdBarChart size={16} /> },
  { value: 'reports-stock', label: 'Reporte Stock', placeholder: 'Buscar en reporte de stock...', route: '/reports/stock', icon: <MdInventory2 size={16} /> },
  { value: 'reports-financial', label: 'Reporte Financiero', placeholder: 'Buscar en reporte financiero...', route: '/reports/financial', icon: <MdAttachMoney size={16} /> },
]

export const AdminTopBar = ({
  onMenuClick = () => {},
  onToggleCollapse = () => {},
  sidebarCollapsed = false,
}: {
  onMenuClick?: () => void
  onToggleCollapse?: () => void
  sidebarCollapsed?: boolean
}) => {
  const [searchFocused, setSearchFocused] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const navigateL = useNavigate()

  const handleLogout = () => {
    // Limpiar sesión aquí si es necesario
    navigateL('/')
  }

  const currentCategory = categories.find(cat => cat.value === selectedCategory) || categories[0]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const route = currentCategory.route
      navigate(`${route}?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const notifications = [
    { id: 1, title: 'Nueva venta registrada', time: 'Hace 5 min', icon: '💰', color: 'bg-green-100 text-green-600' },
    { id: 2, title: 'Stock bajo: iPhone 15', time: 'Hace 1 h', icon: '📦', color: 'bg-yellow-100 text-yellow-600' },
    { id: 3, title: 'Reparación completada', time: 'Hace 2 h', icon: '🔧', color: 'bg-blue-100 text-blue-600' },
    { id: 4, title: 'Nuevo cliente registrado', time: 'Hace 3 h', icon: '👤', color: 'bg-purple-100 text-purple-600' },
    { id: 5, title: 'Pedido enviado #ORD-1234', time: 'Hace 4 h', icon: '🚚', color: 'bg-indigo-100 text-indigo-600' },
  ]

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 bg-card/80 backdrop-blur-md border-b border-border z-30 sticky top-0">
      <div className="flex items-center gap-3">
        <Button onClick={onMenuClick} variant="ghost" size="icon-sm" className="lg:hidden">
          <Menu size={18} />
        </Button>
        <Button onClick={onToggleCollapse} variant="ghost" size="icon-sm" className="hidden lg:inline-flex">
          <ArrowRightToLine size={18} className={`transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="hidden md:flex items-center gap-0 w-64">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 h-9 px-3 rounded-l-full border border-input border-r-0 bg-muted/50 text-sm text-muted-foreground hover:bg-muted transition-colors">
                {currentCategory.label}
                <ChevronDown size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              {categories.map(cat => (
                <DropdownMenuItem
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={selectedCategory === cat.value ? 'bg-muted' : ''}
                >
                  <div className="flex items-center gap-2">
                    {cat.icon}
                    {cat.label}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative flex-1">
            <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={currentCategory.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`h-9 w-full rounded-r-full border border-input bg-muted/50 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none transition-all duration-150 ${searchFocused ? 'ring-1 ring-primary/20 border-primary' : ''}`}
            />
          </div>
        </div>

        {/* 🪟 Notificaciones con Popover (CORREGIDO) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="relative">
              <Bell size={18} className="text-muted-foreground" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                {notifications.length}
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 p-0 max-h-[70vh] overflow-hidden z-50">
            <div className="flex flex-col">
              {/* Cabecera */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h4 className="font-semibold text-foreground">Notificaciones</h4>
                <span className="text-xs text-muted-foreground">{notifications.length} nuevas</span>
              </div>

              {/* Lista con scroll */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => console.log('Notificación clickeada:', notif)}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${notif.color}`}>
                      {notif.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{notif.title}</p>
                      <p className="text-xs text-muted-foreground">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pie */}
              <div className="p-3 border-t border-border text-center">
                <button
                  onClick={() => navigate('/notifications')}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Ver todas las notificaciones
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-muted/50 rounded-lg px-2 py-1.5 transition-colors">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                D
              </div>
              <ChevronDown size={14} className="hidden sm:block text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <User size={16} className="mr-2" />
                Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer">
                <MdSettings size={16} className="mr-2" />
                Configuración
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer">
              <button onClick={handleLogout} className="flex items-center gap-2 w-full">
                Cerrar sesión <LogOut size={18} />
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default AdminTopBar