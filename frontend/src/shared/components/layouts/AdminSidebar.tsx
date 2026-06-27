import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, Users, Wrench, ShoppingCart, BarChart2, Box, Truck, 
  CreditCard, DollarSign, Send, User, Code, Settings, 
  ChevronDown, Plus, List, LogOut, X, Smartphone, 
  Package, ClipboardList, Calendar, TrendingUp, Shield,
  Building2, HelpCircle, Bell, FileText, Printer, PanelLeft, Receipt
} from 'lucide-react'
import { Badge } from '../../components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
interface NavItem {
  title: string
  href: string
  icon?: React.ReactNode
  children?: NavItem[]
  badge?: number
}
// Organización por módulos
const navItems: NavItem[] = [
  {
    title: 'PRINCIPAL',
    href: '#',
    children: [
      { title: 'Dashboard', href: '/dashboard', icon: <Home size={18} /> },
    ]
  },
  {
    title: 'VENTAS Y CLIENTES',
    href: '#',
    children: [
      { 
        title: 'Clientes', 
        href: '/clients', 
        icon: <Users size={18} />,
        children: [
          { title: 'Listar Clientes', href: '/clients', icon: <List size={14} /> },
          { title: 'Agregar Cliente', href: '/clients/add', icon: <Plus size={14} /> },
        ]
      },
      { 
        title: 'Ventas', 
        href: '/sales', 
        icon: <ShoppingCart size={18} />,
        children: [
          { title: 'Nueva Venta', href: '/sales/add', icon: <Plus size={14} /> },
          { title: 'Listar Ventas', href: '/sales', icon: <List size={14} /> },
          { title: 'Facturación', href: '/billing', icon: <FileText size={14} /> },
          { title: 'Caja Diaria', href: '/caja-diaria', icon: <Calendar size={14} /> },
        ]
      },
      { 
        title: 'iPhone', 
        href: '/iphone', 
        icon: <Smartphone size={18} />,
        children: [
          { title: 'Ventas iPhone', href: '/iphone/sales', icon: <ShoppingCart size={14} /> },
          { title: 'Seguros', href: '/iphone/insurance', icon: <Shield size={14} /> },
          { title: 'Stock iPhone', href: '/stock/iphone', icon: <Package size={14} /> },
          { title: 'Programa de Canje', href: '/iphone-canje', icon: <TrendingUp size={14} /> },
        ]
      },
    ]
  },
  {
    title: 'SERVICIOS',
    href: '#',
    children: [
      { 
        title: 'Reparaciones', 
        href: '/reparaciones/list', 
        icon: <Wrench size={18} />,
        children: [
          { title: 'Listar Reparaciones', href: '/reparaciones/list', icon: <List size={14} /> },
          { title: 'Nueva Reparación', href: '/reparaciones/add', icon: <Plus size={14} /> },
          { title: 'Presupuestos', href: '/reparaciones/budgets', icon: <ClipboardList size={14} /> },
        ]
      },
      { 
        title: 'Envíos', 
        href: '/envios', 
        icon: <Send size={18} />,
        children: [
          { title: 'Seguimiento', href: '/envios/tracking', icon: <List size={14} /> },
          
          { title: 'Remises', href: '/envios/remises', icon: <TrendingUp size={14} /> },
        ]
      },
    ]
  },
  {
    title: 'INVENTARIO',
    href: '#',
    children: [
      { 
        title: 'Stock', 
        href: '/stock', 
        icon: <Box size={18} />,
        children: [
          { title: 'Listar Stock', href: '/stock', icon: <List size={14} /> },
          { title: 'Agregar Producto', href: '/stock/add', icon: <Plus size={14} /> },
          { title: 'Stock Repuestos', href: '/stock/repuestos', icon: <Wrench size={14} /> },
          { title: 'Ajustes de Stock', href: '/stock/adjustments', icon: <Settings size={14} /> },
        ]
      },
      { 
        title: 'Proveedores', 
        href: '/providers', 
        icon: <Truck size={18} />,
        children: [
          { title: 'Listar Proveedores', href: '/providers', icon: <List size={14} /> },
          { title: 'Agregar Proveedor', href: '/providers/add', icon: <Plus size={14} /> },
          { title: 'Órdenes de Compra', href: '/providers/orders', icon: <Receipt size={14} /> },
        ]
      },
    ]
  },
  {
    title: 'FINANZAS',
    href: '#',
    children: [
      { 
        title: 'Gastos', 
        href: '/expenses', 
        icon: <DollarSign size={18} />,
        children: [
          { title: 'Listar Gastos', href: '/expenses', icon: <List size={14} /> },
          { title: 'Registrar Gasto', href: '/expenses/add', icon: <Plus size={14} /> },
          { title: 'Categorías', href: '/expenses/categories', icon: <Settings size={14} /> },
        ]
      },
      { 
        title: 'Reportes', 
        href: '#',
        icon: <BarChart2 size={18} />,
        children: [
          { title: 'Ventas', href: '/reports/sales', icon: <TrendingUp size={14} /> },
          { title: 'Stock', href: '/reports/stock', icon: <Package size={14} /> },
          { title: 'Financiero', href: '/reports/financial', icon: <DollarSign size={14} /> },
            { title: 'Reparaciones', href: '/reports/repairs', icon: <Wrench size={14} /> },
     
        ]
      },
      { 
        title: 'ARCA', 
        href: '/billing/ARCA', 
        icon: <FileText size={18} />,
        children: [
          { title: 'Facturación Electrónica', href: '/billing/ARCA', icon: <Printer size={14} /> },
          { title: 'Libro de IVA', href: '/billing/ARCA/iva', icon: <ClipboardList size={14} /> },
        ]
      },
    ]
  },
  // {
  //   title: 'ADMINISTRACIÓN',
  //   href: '#',
  //   children: [
      
  //     { title: 'Configuración', href: '/settings', icon: <Settings size={18} /> },
  //     { title: 'Notificaciones', href: '/notifications', icon: <Bell size={18} />, badge: 0 },
  //   ]
  // },
  // {
  //   title: 'DESARROLLO',
  //   href: '#',
  //   children: [
  //     { title: 'Developer', href: '/developer', icon: <Code size={18} /> },
  //     { title: 'Documentación', href: '/docs', icon: <FileText size={18} /> },
  //     { title: 'Ayuda', href: '/help', icon: <HelpCircle size={18} /> },
  //   ]
  // }
]
export const AdminSidebar = ({
  isOpen = false,
  onClose = () => {},
  collapsed = false,
  onToggleCollapse = () => {},
  orders = [],
  notificationsCount = 0,
}: {
  isOpen?: boolean
  onClose?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
  orders?: any[]
  notificationsCount?: number
}) => {
  const location = useLocation()
  // apply dynamic notification count if provided
  const itemsWithBadge = navItems.map(section => {
    if (section.title === 'ADMINISTRACIÓN' && section.children) {
      return {
        ...section,
        children: section.children.map(item =>
          item.title === 'Notificaciones' ? { ...item, badge: notificationsCount } : item
        ),
      }
    }
    return section
  })
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }
  const handleLogout = () => {
    logout()
  }
  // Auto-expandir secciones basado en la ruta actual
  useEffect(() => {
    const path = location.pathname
    const newOpenSections: Record<string, boolean> = {}
    
    itemsWithBadge.forEach(section => {
      const expandSection = section.children?.some(item => {
        if (item.href === path) return true
        if (item.children) {
          return item.children.some(subItem => subItem.href === path)
        }
        return false
      })
      if (expandSection) {
        newOpenSections[section.title] = true
      }
    })
    
    setOpenSections(prev => ({ ...prev, ...newOpenSections }))
  }, [location.pathname])
  const isActive = (href: string) => location.pathname === href
  const isChildActive = (children?: NavItem[]) => {
    if (!children) return false
    return children.some(item => 
      item.href === location.pathname || 
      item.children?.some(sub => sub.href === location.pathname)
    )
  }
  const renderNavItem = (item: NavItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isItemActive = isActive(item.href)
    const isParentActive = hasChildren && isChildActive(item.children)
    const paddingLeft = depth * 12
    if (hasChildren) {
      return (
        <div key={item.title} className="mb-1">
          <button
            onClick={() => toggleSection(item.title)}
            className={`w-full flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 whitespace-nowrap
              ${collapsed ? 'justify-center px-0' : 'px-4 mx-2'}
              ${isParentActive 
                ? 'bg-primary/10 text-primary border-l-4 border-primary' 
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            style={{ paddingLeft: collapsed ? undefined : `${paddingLeft + 16}px` }}
            title={collapsed ? item.title : undefined}
          >
            <span className="h-5 w-5 flex items-center justify-center shrink-0">{item.icon}</span>
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.title}</span>
                {item.badge && item.badge > 0 && (
                  <Badge variant="secondary" size="sm">{item.badge}</Badge>
                )}
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 text-muted-foreground ${
                    openSections[item.title] ? 'rotate-180' : ''
                  }`} 
                />
              </>
            )}
          </button>
          <AnimatePresence>
            {openSections[item.title] && !collapsed && item.children && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-1">
                  {item.children.map(child => renderNavItem(child, depth + 1))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )
    }
    return (
      <Link
        key={item.href}
        to={item.href}
        className={`flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 whitespace-nowrap group
          ${collapsed ? 'justify-center px-0' : 'px-4 mx-2'}
          ${isItemActive 
            ? 'bg-primary/10 text-primary border-l-4 border-primary' 
            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
          }`}
        style={{ paddingLeft: collapsed ? undefined : `${paddingLeft + 16}px` }}
        title={collapsed ? item.title : undefined}
      >
        <span className="h-5 w-5 flex items-center justify-center shrink-0">{item.icon}</span>
        {!collapsed && (
          <>
            <span className="flex-1">{item.title}</span>
            {item.badge && item.badge > 0 && (
              <Badge variant="secondary" size="sm">{item.badge}</Badge>
            )}
          </>
        )}
      </Link>
    )
  }
  return (
    <>
      {/* Overlay para mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <motion.aside
        initial={isOpen ? { x: -280 } : { x: 0 }}
        animate={isOpen ? { x: 0 } : { x: 0 }}
        exit={isOpen ? { x: -280 } : { x: 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed z-40 inset-y-0 left-0 bg-card border-r border-border transition-[width] duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
          ${collapsed ? 'lg:w-16' : 'lg:w-60'}
          shadow-xl lg:shadow-none`}
      >
        <div className="h-full flex flex-col">
          {/* Header con logo */}
          <div className={`${collapsed ? 'px-0' : 'px-4'} py-5 border-b border-border`}>
            <div className="flex items-center justify-between">
              <Link to="/dashboard" className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold shadow-sm flex-shrink-0">
                  A
                </div>
                {!collapsed && (
                  <div>
                    <span className="font-semibold text-foreground block">Admin Panel</span>
                    <span className="text-xs text-muted-foreground">v2.0.0</span>
                  </div>
                )}
              </Link>
              {/* Botón cerrar mobile */}
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          {/* Navegación principal */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 scrollbar-thin scrollbar-thumb-slate-300">
            {itemsWithBadge.map(section => (
              <div key={section.title} className="mb-6">
                {!collapsed && (
                  <h3 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                {section.children?.map(item => (
                  <React.Fragment key={item.href}>
                    {renderNavItem(item)}
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
          {/* Footer */}
          <div className="border-t border-border-light dark:border-border-dark p-4 space-y-2">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors whitespace-nowrap
                ${collapsed ? 'justify-center px-0' : 'px-4 mx-2'}`}
              title="Cerrar sesión"
            >
              <LogOut size={18} className="h-5 w-5 flex items-center justify-center shrink-0" />
              {!collapsed && (
                <span className="flex-1 text-left">Cerrar sesión</span>
              )}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
export default AdminSidebar
