import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '../../ui/button'
import { Avatar, AvatarFallback } from '../../ui/avatar'
import { Card } from '../../ui/card'
import { Notification } from './notification.types'
interface NotificationItemProps {
  notification: Notification
  onRead: (id: number) => void
  onDelete: (id: number) => void
}
export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  onDelete
}) => {
  const handleClick = () => {
    if (!notification.read) {
      onRead(notification.id)
    }
    if (notification.link) {
      window.location.href = notification.link
    }
  }
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(notification.id)
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
    >
      <Card className={`relative group transition-all duration-200 cursor-pointer
        ${notification.read 
          ? 'bg-muted/30 border-border hover:bg-muted/50' 
          : 'bg-card border-primary/20 hover:border-primary/30 hover:shadow-sm'
        }`}
      >
        <div className="p-4">
          {/* Indicador de no leído */}
          {!notification.read && (
            <div className="absolute top-4 right-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
          )}
          <div className="flex items-start gap-3">
            {/* Avatar con icono */}
            <Avatar className={`h-10 w-10 shrink-0 ${notification.color}`}>
              <AvatarFallback className={notification.color}>
                <span className="text-lg">{notification.icon}</span>
              </AvatarFallback>
            </Avatar>
            {/* Contenido */}
            <div className="flex-1 min-w-0 pr-6">
              <h4 className={`text-sm font-semibold mb-1 ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                {notification.title}
              </h4>
              {notification.description && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {notification.description}
                </p>
              )}
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {notification.time}
              </p>
            </div>
            {/* Botón eliminar */}
            <button
              onClick={handleDelete}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded-md"
              title="Eliminar notificación"
            >
              <X size={14} className="text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
export default NotificationItem
