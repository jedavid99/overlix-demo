import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Badge } from '@/shared/components/ui/badge'
import { Power, PowerOff } from 'lucide-react'

interface DeactivateClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: any
  onConfirm: () => Promise<void>
  loading?: boolean
  action: 'activate' | 'deactivate'
}

export default function DeactivateClientDialog({ open, onOpenChange, client, onConfirm, loading, action }: DeactivateClientDialogProps) {
  const isActivating = action === 'activate'
  const isActive = client?.estado === 'activo'

  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {isActivating ? (
              <>
                <Power className="w-5 h-5 text-success" />
                Activar Cliente
              </>
            ) : (
              <>
                <PowerOff className="w-5 h-5 text-warning" />
                Inactivar Cliente
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isActivating 
              ? 'Este cliente volverá a estar disponible en el sistema'
              : 'Este cliente no podrá realizar nuevas operaciones'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Alert variant={isActivating ? 'default' : 'destructive'}>
            {isActivating ? (
              <Power className="h-4 w-4 text-success" />
            ) : (
              <PowerOff className="h-4 w-4" />
            )}
            <AlertDescription>
              {isActivating 
                ? `Estás a punto de activar al cliente <strong>${client?.nombre_completo}</strong>. Podrá realizar operaciones normalmente.`
                : `Estás a punto de inactivar al cliente <strong>${client?.nombre_completo}</strong>. Esta acción se puede revertir más tarde.`
              }
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Estado actual:</p>
              <Badge
                variant={isActive ? 'success' : 'secondary'}
                className="capitalize"
              >
                {client?.estado || 'activo'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Nuevo estado:</p>
              <Badge
                variant={isActivating ? 'success' : 'secondary'}
                className="capitalize"
              >
                {isActivating ? 'activo' : 'inactivo'}
              </Badge>
            </div>
            <div className="pt-2 border-t mt-2">
              <p className="text-sm font-medium text-foreground">{client?.nombre_completo}</p>
              <p className="text-sm text-muted-foreground">{client?.email || 'Sin email'}</p>
              <p className="text-sm text-muted-foreground">{client?.telefono || 'Sin teléfono'}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant={isActivating ? 'default' : 'destructive'}
            onClick={handleConfirm}
            disabled={loading}
            className={isActivating ? 'bg-success hover:bg-success/90' : ''}
          >
            {loading 
              ? (isActivating ? 'Activando...' : 'Inactivando...') 
              : (isActivating ? 'Activar Cliente' : 'Inactivar Cliente')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
