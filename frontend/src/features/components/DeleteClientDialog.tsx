import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { AlertTriangle } from 'lucide-react'

interface DeleteClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: any
  onConfirm: () => Promise<void>
  loading?: boolean
}

export default function DeleteClientDialog({ open, onOpenChange, client, onConfirm, loading }: DeleteClientDialogProps) {
  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-destructive">Eliminar Cliente</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Estás a punto de eliminar el cliente <strong>{client?.nombre_completo}</strong>. Esta acción es irreversible.
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">Información del cliente:</p>
            <div className="space-y-1">
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
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar Cliente'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
