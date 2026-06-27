'use client'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Skeleton } from './ui/skeleton'
import { ChevronLeft, ChevronRight } from 'lucide-react'
interface DataTableProps {
  data: Array<{
    id: number
    name: string
    email: string
    status: string
    joinDate: string
    transactions: number
  }>
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  loading?: boolean
  emptyMessage?: string
}
const getStatusBadge = (status: string) => {
  const statusStyles: Record<string, { variant: 'success' | 'warning' | 'secondary' | 'destructive'; label: string }> = {
    'Activo': { variant: 'success', label: 'Activo' },
    'Inactivo': { variant: 'secondary', label: 'Inactivo' },
    'Pendiente': { variant: 'warning', label: 'Pendiente' },
    'Completado': { variant: 'success', label: 'Completado' },
    'Error': { variant: 'destructive', label: 'Error' },
  }
  const style = statusStyles[status] || statusStyles['Inactivo']
  return (
    <Badge variant={style.variant} size="sm">
      {style.label}
    </Badge>
  )
}
export default function DataTable({
  data,
  currentPage,
  totalPages,
  onPageChange,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
}: DataTableProps) {
  return (
    <div className="flex flex-col h-full bg-card rounded-lg border border-border shadow-sm dark:shadow-none overflow-hidden transition-all duration-150">
      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full">
          <thead className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fecha Registro</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transacciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3"><Skeleton variant="text" className="w-16" /></td>
                  <td className="px-4 py-3"><Skeleton variant="text" className="w-32" /></td>
                  <td className="px-4 py-3"><Skeleton variant="text" className="w-40" /></td>
                  <td className="px-4 py-3"><Skeleton variant="rectangular" className="w-20 h-6" /></td>
                  <td className="px-4 py-3"><Skeleton variant="text" className="w-24" /></td>
                  <td className="px-4 py-3"><Skeleton variant="text" className="w-16 ml-auto" /></td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row.id}
                  className="hover:bg-muted/50 transition-colors duration-150"
                >
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">#{row.id}</td>
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{row.email}</td>
                  <td className="px-4 py-3 text-sm">{getStatusBadge(row.status)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{row.joinDate}</td>
                  <td className="px-4 py-3 text-sm text-foreground font-medium text-right">{row.transactions}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {!loading && data.length > 0 && (
        <div className="bg-muted/30 border-t border-border px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Página <span className="font-semibold text-foreground">{currentPage}</span> de <span className="font-semibold text-foreground">{totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <Button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    variant={currentPage === pageNum ? 'default' : 'ghost'}
                    size="sm"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
