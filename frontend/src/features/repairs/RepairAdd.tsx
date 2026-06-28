import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowLeft, User, Check, X, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientService } from '@/services/clientService'
import { repairService } from '@/services/repairService'
import { Client } from '@/types/client.types'
import { RepairCreate } from '@/types/repair.types'
import { logger } from '@/utils/logger';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { repairCreateSchema, RepairCreateFormData } from '@/validations/repair.validation'

export default function RepairAdd() {
  const navigate = useNavigate()
  
  // Estados
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [lastClient, setLastClient] = useState<Client | null>(null)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Client[]>([])
  const [searching, setSearching] = useState(false)
  
  // React Hook Form con Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<RepairCreateFormData>({
    resolver: zodResolver(repairCreateSchema),
    defaultValues: {
      dispositivo: '',
      marca: '',
      modelo: '',
      problema_reportado: '',
      diagnosis: '',
      prioridad: 'medium',
      fecha_ingreso: new Date().toISOString().split('T')[0],
      notas: '',
      tecnico_asignado_id: ''
    }
  })

  // Cargar último cliente al montar
  useEffect(() => {
    const fetchLastClient = async () => {
      try {
        const response = await clientService.list({ limit: 1, sort: 'created_at:desc' })
        // Backend usa TransformInterceptor: { data: {...}, statusCode, timestamp, path }
        const clients = response?.data?.data?.clientes || response?.data?.data || []
        if (clients.length > 0) {
          setLastClient(clients[0])
        }
      } catch (error) {
        console.error('Error al cargar último cliente:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchLastClient()
  }, [])

  // Búsqueda con debounce
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setSearching(true)
        try {
          const response = await clientService.list({ search: searchQuery, limit: 10 })
          // Backend usa TransformInterceptor: { data: {...}, statusCode, timestamp, path }
          setSearchResults(response?.data?.data?.clientes || response?.data?.data || [])
        } catch (error) {
          console.error('Error en búsqueda:', error)
          setSearchResults([])
        } finally {
          setSearching(false)
        }
      } else {
        setSearchResults([])
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  // Handlers
  const handleSelectClient = useCallback((client: Client) => {
    setSelectedClient(client)
    setSearchQuery('')
    setSearchResults([])
  }, [])

  const handleSelectLastClient = useCallback(() => {
    if (lastClient) {
      setSelectedClient(lastClient)
    }
  }, [lastClient])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const onSubmit = async (data: RepairCreateFormData) => {
    // Validación de cliente seleccionado
    if (!selectedClient) {
      toast({
        title: 'Error de validación',
        description: 'Debe seleccionar un cliente para la reparación',
        variant: 'destructive'
      })
      return
    }

    setSubmitting(true)

    const payload: RepairCreate = {
      cliente_id: selectedClient.id,
      dispositivo: data.dispositivo,
      marca: data.marca || undefined,
      modelo: data.modelo || undefined,
      problema_reportado: data.problema_reportado,
      diagnosis: data.diagnosis || undefined,
      prioridad: data.prioridad,
      fecha_ingreso: data.fecha_ingreso,
      tecnico_asignado_id: data.tecnico_asignado_id || undefined,
      notas: data.notas || undefined
    }

    try {
      const result = await repairService.create(payload)
      
      toast({
        title: 'Éxito',
        description: '¡Reparación registrada correctamente!',
      })
      
      navigate(`/reparaciones/${result.id}`)
    } catch (error) {
      logger.error('Error al crear reparación:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/reparaciones/list')
  }

  const handleChangeClient = () => {
    setSelectedClient(null)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nueva Reparación</h1>
            <p className="text-sm text-muted-foreground">Registro de orden de servicio</p>
          </div>
        </div>

        {/* Último cliente registrado */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Último cliente registrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-10 w-32" />
              </div>
            ) : lastClient ? (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{lastClient.nombre_completo}</p>
                  <p className="text-sm text-muted-foreground">DNI: {lastClient.dni || '—'}</p>
                  <p className="text-sm text-muted-foreground">Tel: {lastClient.telefono}</p>
                  <p className="text-sm text-muted-foreground">{lastClient.email || 'Sin email'}</p>
                </div>
                <Button
                  onClick={handleSelectLastClient}
                  disabled={selectedClient?.id === lastClient.id}
                  className="shrink-0"
                >
                  {selectedClient?.id === lastClient.id ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Seleccionado
                    </>
                  ) : (
                    'Seleccionar este cliente'
                  )}
                </Button>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No hay clientes registrados aún
              </p>
            )}
          </CardContent>
        </Card>

        {/* Cliente seleccionado */}
        {selectedClient && (
          <Card className="border-primary bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {selectedClient.nombre_completo.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{selectedClient.nombre_completo}</p>
                      <Badge variant="default" className="text-xs">Cliente seleccionado</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedClient.telefono}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleChangeClient}
                >
                  Cambiar cliente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Buscador de clientes */}
        {!selectedClient && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Buscar cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, DNI o teléfono..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>

              {searching && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Nombre</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">DNI</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Teléfono</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Email</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-muted-foreground">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {searchResults.map((client) => (
                        <tr key={client.id} className="hover:bg-muted/50">
                          <td className="px-4 py-2 text-sm font-medium text-foreground">{client.nombre_completo}</td>
                          <td className="px-4 py-2 text-sm text-muted-foreground">{client.dni || '—'}</td>
                          <td className="px-4 py-2 text-sm text-muted-foreground">{client.telefono}</td>
                          <td className="px-4 py-2 text-sm text-muted-foreground">{client.email || '—'}</td>
                          <td className="px-4 py-2 text-right">
                            <Button
                              size="sm"
                              onClick={() => handleSelectClient(client)}
                            >
                              Seleccionar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {searchQuery.length >= 2 && searchResults.length === 0 && !searching && (
                <p className="text-center text-muted-foreground py-4">
                  No se encontraron clientes
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Formulario de reparación */}
        {selectedClient && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Datos de la reparación</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dispositivo">Dispositivo *</Label>
                    <Input
                      id="dispositivo"
                      {...register('dispositivo')}
                      placeholder="ej. iPhone 13, Samsung Galaxy..."
                    />
                    {errors.dispositivo && (
                      <p className="text-sm text-destructive">{errors.dispositivo.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Input
                      id="marca"
                      {...register('marca')}
                      placeholder="ej. Apple, Samsung..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input
                      id="modelo"
                      {...register('modelo')}
                      placeholder="ej. A2633, S21..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prioridad">Prioridad</Label>
                    <select
                      id="prioridad"
                      {...register('prioridad')}
                      className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                      <option value="critical">Urgente</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha_ingreso">Fecha de ingreso *</Label>
                    <Input
                      id="fecha_ingreso"
                      type="date"
                      {...register('fecha_ingreso')}
                    />
                    {errors.fecha_ingreso && (
                      <p className="text-sm text-destructive">{errors.fecha_ingreso.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tecnico_asignado_id">Técnico asignado</Label>
                    <Input
                      id="tecnico_asignado_id"
                      {...register('tecnico_asignado_id')}
                      placeholder="ID del técnico (opcional)"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problema_reportado">Problema reportado *</Label>
                  <textarea
                    id="problema_reportado"
                    {...register('problema_reportado')}
                    placeholder="Describe el problema del dispositivo..."
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  {errors.problema_reportado && (
                    <p className="text-sm text-destructive">{errors.problema_reportado.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <textarea
                    id="diagnosis"
                    {...register('diagnosis')}
                    placeholder="Diagnosis técnica del problema..."
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notas">Notas adicionales</Label>
                  <textarea
                    id="notas"
                    {...register('notas')}
                    placeholder="Notas adicionales sobre la reparación..."
                    rows={2}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  {errors.notas && (
                    <p className="text-sm text-destructive">{errors.notas.message}</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={submitting || isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || isSubmitting}
                  >
                    {submitting || isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      'Guardar reparación'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
