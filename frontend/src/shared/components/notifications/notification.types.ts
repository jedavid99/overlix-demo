export interface Notification {
  id: number
  title: string
  description?: string
  time: string
  icon: string
  color: string
  read: boolean
  type: 'sale' | 'stock' | 'repair' | 'client' | 'shipment' | 'system'
  link?: string
}

export interface NotificationGroup {
  label: string
  notifications: Notification[]
}

export type NotificationType = Notification['type'];
