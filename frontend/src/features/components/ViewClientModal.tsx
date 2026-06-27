import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog'
import { Badge } from '@/shared/components/ui/badge'
import { User, Phone, Mail, MapPin, Hash, Calendar } from 'lucide-react'

interface ViewClientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: any
}

export default function ViewClientModal({ open, onOpenChange, client }: ViewClientModalProps) {
  if (!client) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalles del Cliente</DialogTitle>
          <DialogDescription>Información completa del cliente</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Header con avatar */}
          <div className="flex items-center gap-4 pb-4 border-b">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
              {client.nombre_completo?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">{client.nombre_completo || 'Sin nombre'}</h3>
              <p className="text-sm text-muted-foreground">{client.email || 'Sin email'}</p>
            </div>
            <Badge
              variant={client.estado === 'activo' ? 'success' : 'secondary'}
              className="capitalize"
            >
              {client.estado || 'activo'}
            </Badge>
          </div>

          {/* Información personal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Información Personal</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Hash className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">DNI</p>
                  <p className="text-sm font-medium text-foreground">{client.dni || '—'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Teléfono</p>
                  <p className="text-sm font-medium text-foreground">{client.telefono || '—'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{client.email || '—'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Fecha de Registro</p>
                  <p className="text-sm font-medium text-foreground">
                    {client.fecha_registro ? new Date(client.fecha_registro).toLocaleDateString('es-AR') : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Dirección</h4>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Dirección Completa</p>
                <p className="text-sm font-medium text-foreground">
                  {client.direccion ? `${client.direccion}${client.ciudad ? `, ${client.ciudad}` : ''}${client.provincia ? `, ${client.provincia}` : ''}` : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Notas */}
          {client.notas && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Notas</h4>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-foreground">{client.notas}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
