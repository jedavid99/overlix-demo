import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Button } from '../../ui/button'
import { ScrollArea } from '../../ui/scroll-area'
import { Separator } from '../../ui/separator'
import { Notification, NotificationGroup } from './notification.types'
import { NotificationItem } from './NotificationItem'
interface NotificationListProps {
  notifications: Notification[]
  onNotificationRead: (id: number) => void
  onNotificationDelete: (id: number) => void
  onMarkAllRead: () => void
  onViewAll: () => void
}
export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onNotificationRead,
  onNotificationDelete,
  onMarkAllRead,
  onViewAll
}) => {
  const unreadCount = notifications.filter(n => !n.read).length
  // Agrupar notificaciones por fecha
  const groupedNotifications = useMemo(() => {
    const groups: NotificationGroup[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const thisWeek = new Date(today)
    thisWeek.setDate(thisWeek.getDate() - 7)
    const todayNotifs: Notification[] = []
    const yesterdayNotifs: Notification[] = []
    const thisWeekNotifs: Notification[] = []
    const olderNotifs: Notification[] = []
    notifications.forEach(notif => {
      // Simular fecha basada en el string de tiempo
      const timeStr = notif.time.toLowerCase()
      if (timeStr.includes('min') || timeStr.includes('hora') || timeStr.includes('hace 0')) {
        todayNotifs.push(notif)
      } else if (timeStr.includes('ayer')) {
        yesterdayNotifs.push(notif)
      } else if (timeStr.includes('día') && !timeStr.includes('ayer')) {
        thisWeekNotifs.push(notif)
      } else {
        olderNotifs.push(notif)
      }
    })
    if (todayNotifs.length > 0) {
      groups.push({ label: 'Hoy', notifications: todayNotifs })
    }
    if (yesterdayNotifs.length > 0) {
      groups.push({ label: 'Ayer', notifications: yesterdayNotifs })
    }
    if (thisWeekNotifs.length > 0) {
      groups.push({ label: 'Esta semana', notifications: thisWeekNotifs })
    }
    if (olderNotifs.length > 0) {
      groups.push({ label: 'Más antiguo', notifications: olderNotifs })
    }
    return groups
  }, [notifications])
  return (
    <div className="flex flex-col h-full">
      {/* Cabecera */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-3">
          <h4 className="font-semibold text-foreground">Notificaciones</h4>
          {unreadCount > 0 && (
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {unreadCount} nuevas
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllRead}
            className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
          >
            <Check size={14} className="mr-1" />
            Marcar todas como leídas
          </Button>
        )}
      </div>
      {/* Lista con scroll */}
      <ScrollArea className="flex-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <X size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">No tienes notificaciones</p>
            <p className="text-xs text-muted-foreground text-center">
              Te avisaremos cuando haya novedades
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            <AnimatePresence mode="popLayout">
              {groupedNotifications.map((group, groupIndex) => (
                <motion.div
                  key={group.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Etiqueta de grupo */}
                  <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm px-3 py-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {group.label}
                    </span>
                  </div>
                  
                  {/* Notificaciones del grupo */}
                  <div className="space-y-1">
                    {group.notifications.map(notification => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRead={onNotificationRead}
                        onDelete={onNotificationDelete}
                      />
                    ))}
                  </div>
                  {/* Separador entre grupos */}
                  {groupIndex < groupedNotifications.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>
      {/* Pie */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-border bg-card/50">
          <Button
            variant="ghost"
            onClick={onViewAll}
            className="w-full text-sm font-medium text-primary hover:text-primary/80"
          >
            Ver todas las notificaciones
          </Button>
        </div>
      )}
    </div>
  )
}
export default NotificationList
