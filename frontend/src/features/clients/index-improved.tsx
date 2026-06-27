import React, { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { MdPerson } from 'react-icons/md'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { clientService } from '@/services/clientService'
import { toast } from '@/hooks/use-toast'

const statusColors: Record<string, string> = {
  activo: 'bg-green-100 text-green-800',
  inactivo: 'bg-gray-100 text-gray-800'
}

export default function Clients() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'inactivo'>('all')
  const pageSize = 5

  // Estado local
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  // Cargar datos UNA SOLA VEZ
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await clientService.list({ page: 1, limit: 100 })
        console.log('Respuesta completa:', response)
        
        // Extraer datos según la estructura real
        let clientesArray = response?.data?.data?.clientes ||
                           response?.data?.data?.data ||
                           response?.data?.data ||
                           response?.data ||
                           response
        
        if (!Array.isArray(clientesArray)) {
          console.error('No se encontró un array de clientes:', response)
          setClients([])
          setTotal(0)
          return
        }

        console.log('Clientes obtenidos:', clientesArray.length)
        setClients(clientesArray)
        setTotal(clientesArray.length)
      } catch (err: any) {
        console.error('Error al cargar clientes:', err)
        setError(err?.response?.data?.message || 'Error al cargar clientes')
        setClients([])
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  // Filtros locales
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let result = clients

    if (q) {
      result = result.filter(c =>
        c.nombre_completo?.toLowerCase().includes(q) ||
        c.dni?.toLowerCase().includes(q) ||
        c.telefono?.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'all') {
      result = result.filter(c => c.estado === statusFilter)
    }

    return result
  }, [clients, query, statusFilter])

  // Paginación local
  const totalFiltered = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize))
  const paginatedData = filtered.slice((page - 1) * pageSize, page * pageSize)

  const onSearch = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return
    try {
      await clientService.delete(id)
      toast({ title: 'Cliente eliminado' })
      // Recargar la lista
      const response = await clientService.list({ page: 1, limit: 100 })
      let clientesArray = response?.data?.data?.clientes || response?.data?.data || response?.data || response
      if (Array.isArray(clientesArray)) {
        setClients(clientesArray)
        setTotal(clientesArray.length)
      }
    } catch (err) {
      toast.error('Error al eliminar')
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error: {error}
        </div>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tu base de clientes ({total} registrados)
          </p>
        </div>
        <Link to="/clients/add">
          <Button className="gap-2">
            <Plus size={16} />
            Nuevo cliente
          </Button>
        </Link>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Buscar por nombre, DNI o teléfono..."
            value={query}
            onChange={e => onSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Badge
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setStatusFilter('all')}
          >
            Todos
          </Badge>
          <Badge
            variant={statusFilter === 'activo' ? 'success' : 'outline'}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setStatusFilter('activo')}
          >
            Activos
          </Badge>
          <Badge
            variant={statusFilter === 'inactivo' ? 'secondary' : 'outline'}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setStatusFilter('inactivo')}
          >
            Inactivos
          </Badge>
        </div>
        <span className="text-sm text-muted-foreground ml-auto">
          {totalFiltered} cliente{totalFiltered !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border border-border rounded-lg">
              <Skeleton variant="circle" className="h-10 w-10" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="w-32 h-4" />
                <Skeleton variant="text" className="w-48 h-3" />
              </div>
            </div>
          ))}
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="text-center py-12">
          <MdPerson size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {query || statusFilter !== 'all' ? 'No hay resultados' : 'No hay clientes aún'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {query || statusFilter !== 'all'
              ? 'Prueba con otros filtros o términos de búsqueda'
              : 'Comienza agregando tu primer cliente'}
          </p>
          {!query && statusFilter === 'all' && (
            <Link to="/clients/add">
              <Button>
                <Plus size={16} className="mr-2" />
                Agregar primer cliente
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Tabla mejorada estilo reparaciones */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Cliente</th>
                  <th className="px-4 py-3 text-left font-medium">DNI</th>
                  <th className="px-4 py-3 text-left font-medium">Teléfono</th>
                  <th className="px-4 py-3 text-left font-medium">Fecha registro</th>
                  <th className="px-4 py-3 text-left font-medium">Estado</th>
                  <th className="px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr key={row.id} className="border-t hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{row.nombre_completo}</div>
                      <div className="text-sm text-muted-foreground">{row.email || 'Sin email'}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{row.dni || '—'}</td>
                    <td className="px-4 py-3 text-sm">{row.telefono || '—'}</td>
                    <td className="px-4 py-3 text-sm">
                      {row.fecha_registro ? new Date(row.fecha_registro).toLocaleDateString('es-AR') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[row.estado] || statusColors.activo}`}>
                        {(row.estado || 'activo').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => navigate(`/clients/${row.id}`)}
                          title="Ver cliente"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => navigate(`/clients/edit/${row.id}`)}
                          title="Editar cliente"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(row.id)}
                          title="Eliminar cliente"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {paginatedData.length} de {totalFiltered} clientes
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="px-4 py-2 text-sm">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}
