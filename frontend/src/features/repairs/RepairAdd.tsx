import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowLeft, User, Check, X, Loader2 } from 'lucide-react'
import { clientService } from '@/services/clientService'
import { repairService } from '@/services/repairService'
import { Client } from '@/types/client.types'
import { RepairCreate } from '@/types/repair.types'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Skeleton } from '@/shared/components/ui/skeleton'

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
  
  const [formData, setFormData] = useState({
    dispositivo: '',
    marca: '',
    modelo: '',
    problema_reportado: '',
    diagnosis: '',
    prioridad: 'media' as 'baja' | 'media' | 'alta' | 'urgente',
    fecha_ingreso: new Date().toISOString().split('T')[0],
    notas: '',
    tecnico_asignado_id: ''
  })

  // Cargar último cliente al montar
  useEffect(() => {
    const fetchLastClient = async () => {
      try {
        const response = await clientService.list({ limit: 1, sort: 'created_at:desc' })
        if (response?.data?.length > 0) {
          setLastClient(response.data[0])
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
          setSearchResults(response?.data || [])
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validaciones
    if (!selectedClient) {
      toast({
        title: 'Error de validación',
        description: 'Debe seleccionar un cliente para la reparación',
        variant: 'destructive'
      })
      return
    }

    if (formData.dispositivo.length < 3) {
      toast({
        title: 'Error de validación',
        description: 'El dispositivo debe tener al menos 3 caracteres',
        variant: 'destructive'
      })
      return
    }

    if (formData.problema_reportado.length < 5) {
      toast({
        title: 'Error de validación',
        description: 'El problema reportado debe tener al menos 5 caracteres',
        variant: 'destructive'
      })
      return
    }

    if (!formData.fecha_ingreso) {
      toast({
        title: 'Error de validación',
        description: 'La fecha de ingreso es requerida',
        variant: 'destructive'
      })
      return
    }

    setSubmitting(true)

    const payload = {
      cliente_id: selectedClient.id,
      dispositivo: formData.dispositivo,
      marca: formData.marca || undefined,
      modelo: formData.modelo || undefined,
      problema_reportado: formData.problema_reportado,
      diagnosis: formData.diagnosis || undefined,
      prioridad: formData.prioridad,
      fecha_ingreso: formData.fecha_ingreso,
      tecnico_asignado_id: formData.tecnico_asignado_id || undefined,
      notas: formData.notas || undefined
    }

    try {
      toast.promise(
        repairService.create(payload),
        {
          loading: 'Guardando reparación...',
          success: '¡Reparación registrada correctamente!',
          error: (err: any) => err?.response?.data?.message || 'Error al guardar la reparación'
        }
      )
      
      const result = await repairService.create(payload)
      navigate(`/reparaciones/${result.id}`)
    } catch (error) {
      console.error('Error al crear reparación:', error)
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
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dispositivo">Dispositivo *</Label>
                    <Input
                      id="dispositivo"
                      name="dispositivo"
                      value={formData.dispositivo}
                      onChange={handleInputChange}
                      placeholder="ej. iPhone 13, Samsung Galaxy..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Input
                      id="marca"
                      name="marca"
                      value={formData.marca}
                      onChange={handleInputChange}
                      placeholder="ej. Apple, Samsung..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input
                      id="modelo"
                      name="modelo"
                      value={formData.modelo}
                      onChange={handleInputChange}
                      placeholder="ej. A2633, S21..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prioridad">Prioridad</Label>
                    <select
                      id="prioridad"
                      name="prioridad"
                      value={formData.prioridad}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha_ingreso">Fecha de ingreso *</Label>
                    <Input
                      id="fecha_ingreso"
                      name="fecha_ingreso"
                      type="date"
                      value={formData.fecha_ingreso}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tecnico_asignado_id">Técnico asignado</Label>
                    <Input
                      id="tecnico_asignado_id"
                      name="tecnico_asignado_id"
                      value={formData.tecnico_asignado_id}
                      onChange={handleInputChange}
                      placeholder="ID del técnico (opcional)"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problema_reportado">Problema reportado *</Label>
                  <textarea
                    id="problema_reportado"
                    name="problema_reportado"
                    value={formData.problema_reportado}
                    onChange={handleInputChange}
                    placeholder="Describe el problema del dispositivo..."
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <textarea
                    id="diagnosis"
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    placeholder="Diagnosis técnica del problema..."
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notas">Notas adicionales</Label>
                  <textarea
                    id="notas"
                    name="notas"
                    value={formData.notas}
                    onChange={handleInputChange}
                    placeholder="Notas adicionales sobre la reparación..."
                    rows={2}
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
