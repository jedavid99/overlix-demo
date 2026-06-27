import React, { useState, FormEvent } from 'react'
import {
  Bell, Search, AlertTriangle, Cpu, CheckCircle, Clock,
  Phone, MoreVertical, Bold, Italic, List, AtSign, Smile,
  Paperclip, Image, Send, Hash, User, Settings,
  MessageSquare, Wrench, Truck, ShoppingCart, Package,
  ChevronDown, ChevronUp, Star, Filter, X,
  ThumbsUp, ThumbsDown, Award, Calendar, Circle,
  Home, BarChart2, Box, CreditCard, LogOut
} from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
interface NotificationItem {
  id: string
  type: 'urgent' | 'system' | 'sale' | 'general'
  title: string
  time: string
  message: string
  action: string
  icon: keyof typeof iconMap
  read?: boolean
}
interface ChatMessage {
  id: string
  author?: string
  avatar?: string
  time?: string
  content: React.ReactNode
  self?: boolean
  system?: boolean
}
interface TeamMember {
  name: string
  role: string
  avatar: string
  online: boolean
  status: string
}
interface Ticket {
  id: string
  title: string
  status: string
  priority: string
  active: number
  device: string
}
const iconMap = {
  warning: AlertTriangle,
  hardware: Cpu,
  check_circle: CheckCircle,
  schedule: Clock,
}
const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Low Stock Alert',
    time: '2 min',
    message: 'iPhone 14 Pro Max screens are below 5 units. Re-order recommended.',
    action: 'Create Order',
    icon: 'warning',
    read: false
  },
  {
    id: '2',
    type: 'system',
    title: 'New Repair Ticket',
    time: '14 min',
    message: '#TK-8842: Samsung S23 Ultra - Water Damage. Assigned to Technical A.',
    action: 'View Ticket',
    icon: 'hardware',
    read: false
  },
  {
    id: '3',
    type: 'sale',
    title: 'Sale Completed',
    time: '1 hour',
    message: 'Repair #TK-8831 has been picked up and paid. Total: $249.00',
    action: 'Receipt',
    icon: 'check_circle',
    read: true
  },
  {
    id: '4',
    type: 'general',
    title: 'Shift Reminder',
    time: '4 hours',
    message: "Tomorrow's staff meeting starts at 08:30 AM in the lounge.",
    action: 'Dismiss',
    icon: 'schedule',
    read: true
  },
]
const initialChat: ChatMessage[] = [
  {
    id: 'm1',
    author: 'Alex (Senior Tech)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    time: '10:45 AM',
    content: (
      <span>
        Hey team, checking the water damage on #TK-8842. The charging coil looks corroded.
        Should we replace or just clean with IPA?
      </span>
    ),
  },
  {
    id: 'm2',
    author: 'You',
    time: '10:48 AM',
    self: true,
    content: (
      <>
        Better replace it. Cleaning might fail in a month. I've attached the circuit diagram
        for reference where the short might be.
        <div className="mt-2 w-64 ml-auto rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
          <img
            alt="Circuit diagram"
            className="w-full h-auto"
            src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400"
          />
        </div>
      </>
    ),
  },
  {
    id: 'm3',
    author: 'Sarah',
    avatar: 'https://images.unsplash.com/photo-1494790108777-466d853a7733?w=150',
    time: '11:02 AM',
    content: (
      <span>
        <span className="text-blue-600 font-bold">@Alex</span> go ahead with the replacement. We
        have 4 in stock. I'll update the customer on the revised quote.
      </span>
    ),
  },
]
const teamMembers: TeamMember[] = [
  { name: 'Alex Chen', role: 'Senior Tech', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', online: true, status: 'Working on #TK-8842' },
  { name: 'Sarah Johnson', role: 'Manager', avatar: 'https://images.unsplash.com/photo-1494790108777-466d853a7733?w=150', online: true, status: 'In meeting' },
  { name: 'Mike Rodriguez', role: 'Technician', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', online: false, status: 'Away' },
  { name: 'Lisa Wang', role: 'Sales', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', online: true, status: 'With customer' },
  { name: 'Carlos Mendez', role: 'Technician', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', online: true, status: 'Break' },
]
const tickets: Ticket[] = [
  { id: '#TK-8842', title: 'S23 Ultra Water Damage', status: 'In Progress', priority: 'High', active: 3, device: 'Samsung S23 Ultra' },
  { id: '#TK-8843', title: 'iPhone 14 Screen', status: 'Waiting Parts', priority: 'Medium', active: 2, device: 'iPhone 14' },
  { id: '#TK-8844', title: 'Pixel 7 Battery', status: 'Completed', priority: 'Low', active: 0, device: 'Google Pixel 7' },
]
export default function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent' | 'system'>('all')
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)
  const [messages, setMessages] = useState<ChatMessage[]>(initialChat)
  const [input, setInput] = useState('')
  const [activeTab, setActiveTab] = useState<'equipo' | 'tickets'>('equipo')
  const [selectedTicket, setSelectedTicket] = useState<string>('#TK-8842')
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    if (filter === 'urgent') return n.type === 'urgent'
    if (filter === 'system') return n.type === 'system'
    return true
  })
  const unreadCount = notifications.filter(n => !n.read).length
  const sendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const newMessage: ChatMessage = {
      id: `m${messages.length + 1}`,
      author: 'You',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      self: true,
      content: input,
    }
    setMessages(prev => [...prev, newMessage])
    setInput('')
  }
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }
  return (
    <div className="space-y-6">
      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Panel Izquierdo - Equipo/Tickets */}
        <div className="col-span-12 lg:col-span-3">
          <Card>
            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('equipo')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'equipo'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Equipo
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'tickets'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Tickets
              </button>
            </div>
            {/* Contenido */}
            <CardContent className="p-3">
              {activeTab === 'equipo' ? (
                <div className="space-y-3">
                  {teamMembers.map(member => (
                    <div key={member.name} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
                      <div className="relative">
                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-lg object-cover" />
                        {member.online && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                        <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{member.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {tickets.map(ticket => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedTicket === ticket.id
                          ? 'bg-primary/5 border border-primary/20'
                          : 'hover:bg-muted border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{ticket.id}</span>
                        <Badge variant={
                          ticket.priority === 'High' ? 'destructive' :
                          ticket.priority === 'Medium' ? 'default' :
                          'secondary'
                        } className="text-[10px]">
                          {ticket.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{ticket.title}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Circle size={8} className="fill-green-500 text-green-500" />
                          {ticket.active} activos
                        </span>
                        <span className="text-muted-foreground/30">•</span>
                        <span className="text-muted-foreground">{ticket.device}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Panel Central - Chat */}
        <div className="col-span-12 lg:col-span-6">
          <Card className="flex flex-col h-[calc(100vh-10rem)]">
            {/* Chat Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Hash size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Ticket #TK-8842</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      3 activos
                    </span>
                    <span className="text-muted-foreground/30">•</span>
                    <span className="text-muted-foreground">Samsung S23 Ultra</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Phone size={16} />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical size={16} />
                </Button>
              </div>
            </div>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => {
                if (msg.self) {
                  return (
                    <div key={msg.id} className="flex gap-3 justify-end">
                      <div className="max-w-[70%]">
                        <div className="flex items-center gap-2 justify-end mb-1">
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                          <span className="text-sm font-medium text-foreground">Tú</span>
                        </div>
                        <div className="bg-primary text-primary-foreground p-3 rounded-lg rounded-tr-none">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  )
                }
                return (
                  <div key={msg.id} className="flex gap-3">
                    <img src={msg.avatar} alt={msg.author} className="w-8 h-8 rounded-lg object-cover" />
                    <div className="max-w-[70%]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{msg.author}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Chat Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-border">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-3 py-2 bg-muted rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring/20 text-sm"
                  rows={2}
                />
                <Button
                  type="submit"
                  disabled={!input.trim()}
                  size="icon"
                  className="rounded-lg"
                >
                  <Send size={18} />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Button type="button" variant="ghost" size="icon">
                  <Paperclip size={14} />
                </Button>
                <Button type="button" variant="ghost" size="icon">
                  <Image size={14} />
                </Button>
                <Button type="button" variant="ghost" size="icon">
                  <Smile size={14} />
                </Button>
              </div>
            </form>
          </Card>
        </div>
        {/* Panel Derecho - Notificaciones */}
        <div className="col-span-12 lg:col-span-3">
          <Card>
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-foreground">Notificaciones</h3>
                <Button variant="ghost" size="sm">
                  Marcar todas
                </Button>
              </div>
              
              <div className="flex gap-2">
                {['all', 'unread', 'urgent', 'system'].map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(f as any)}
                    className="text-xs"
                  >
                    {f === 'all' ? 'Todos' :
                     f === 'unread' ? 'No leídas' :
                     f === 'urgent' ? 'Urgentes' : 'Sistema'}
                  </Button>
                ))}
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-20rem)] p-3 space-y-3">
              {filteredNotifications.map(n => {
                const IconComponent = iconMap[n.icon as keyof typeof iconMap] || AlertTriangle
                
                return (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-sm ${
                      n.type === 'urgent' ? 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10' :
                      n.type === 'system' ? 'border-l-blue-500' :
                      n.type === 'sale' ? 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10' :
                      'border-l-muted-foreground'
                    } ${!n.read ? 'bg-card' : 'bg-muted/50 opacity-75'}`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        n.type === 'urgent' ? 'bg-red-100 dark:bg-red-900/20' :
                        n.type === 'system' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        n.type === 'sale' ? 'bg-green-100 dark:bg-green-900/20' :
                        'bg-muted'
                      }`}>
                        <IconComponent size={16} className={
                          n.type === 'urgent' ? 'text-red-600 dark:text-red-400' :
                          n.type === 'system' ? 'text-blue-600 dark:text-blue-400' :
                          n.type === 'sale' ? 'text-green-600 dark:text-green-400' :
                          'text-muted-foreground'
                        } />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {n.title}
                          </h4>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {n.message}
                        </p>
                        
                        <Button
                          variant={n.type === 'urgent' ? 'destructive' : n.type === 'sale' ? 'default' : 'outline'}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            alert(`${n.action} clicked`)
                          }}
                          className="text-xs"
                        >
                          {n.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
