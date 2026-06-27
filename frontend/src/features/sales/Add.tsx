import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Plus, Minus, CreditCard, DollarSign, ShoppingCart, ChevronRight } from 'lucide-react'
type CatalogItem = {
  id: string
  title: string
  price: number
  stock?: number
  img?: string
  badge?: string
}
// 📦 CATÁLOGO VACÍO – reemplazar con llamada a la API
const CATALOG: CatalogItem[] = []
export default function SaleAdd() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('') // vacío
  const [items, setItems] = useState<{ item: CatalogItem; qty: number }[]>([]) // carrito vacío
  // Filtrado (con catálogo vacío no muestra nada)
  const filtered = useMemo(
    () => CATALOG.filter(c => c.title.toLowerCase().includes(query.toLowerCase())),
    [query]
  )
  const addItem = (it: CatalogItem) => {
    setItems(prev => {
      const existing = prev.find(p => p.item.id === it.id)
      if (existing) {
        return prev.map(p =>
          p.item.id === it.id
            ? { ...p, qty: Math.min((p.qty || 0) + 1, it.stock || 9999) }
            : p
        )
      }
      return [{ item: it, qty: 1 }, ...prev]
    })
  }
  const changeQty = (id: string, delta: number) => {
    setItems(prev =>
      prev.map(p =>
        p.item.id === id
          ? {
              ...p,
              qty: Math.max(1, Math.min((p.qty || 1) + delta, p.item.stock || 9999)),
            }
          : p
      )
    )
  }
  const removeItem = (id: string) =>
    setItems(prev => prev.filter(p => p.item.id !== id))
  const subtotal = items.reduce((s, p) => s + p.item.price * p.qty, 0)
  const taxRate = 0.08
  const tax = +(subtotal * taxRate).toFixed(2)
  const total = +(subtotal + tax).toFixed(2)
  return (
    <div className="h-full flex flex-col gap-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Crear Venta</h1>
        
      </div>
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Catálogo */}
        <section className="flex-1 min-w-0 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold">Catálogo</h2>
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-lg bg-primary text-white text-xs font-bold flex items-center gap-2">
                <Plus size={14} /> Item Personalizado
              </button>
            </div>
          </div>
          {/* Buscador */}
          <div className="p-4 flex gap-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-primary focus:border-primary"
                placeholder="Buscar por nombre, categoría o SKU..."
              />
            </div>
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500">
              <Filter size={16} />
            </button>
          </div>
         
          {/* Grid de productos */}
          <div className="flex-1 overflow-y-auto p-4">
            {filtered.length === 0 ? (
              <div className="text-center text-slate-400 py-12">
                <ShoppingCart className="mx-auto mb-4 opacity-20" size={48} />
                <p className="font-medium">No hay productos disponibles</p>
                <p className="text-sm">Agrega items desde el panel de administración</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(it => (
                  <button
                    key={it.id}
                    onClick={() => addItem(it)}
                    className="group flex flex-col text-left p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary hover:shadow-md transition-all"
                  >
                    <div className="aspect-square w-full rounded-lg bg-slate-100 dark:bg-slate-700 mb-3 flex items-center justify-center overflow-hidden">
                      <ShoppingCart size={36} className="text-slate-500" />
                    </div>
                    <p className="font-bold text-sm mb-1 truncate">{it.title}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-bold">${it.price.toFixed(2)}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 font-bold uppercase tracking-tight">
                        {it.badge ?? (it.stock ? `${it.stock} en stock` : 'Servicio')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
        {/* Venta Actual */}
         <section className="w-[420px] shrink-0 flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm h-full max-h-[calc(100vh-120px)]">
  {/* Cabecera: cliente y número de venta - fijo */}
  {/* <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-3 flex-shrink-0">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold">Venta Actual</h2>
      <span className="text-slate-500 text-sm">#Nuevo</span>
    </div>
    <div className="relative">
      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <Search className="text-slate-400" />
        <div className="flex-1">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Cliente</p>
          <p className="text-sm font-bold">
            {selectedCustomer || 'Seleccionar cliente'}
          </p>
        </div>
        <button
          onClick={() => setSelectedCustomer('Cliente en Caja')}
          className="text-primary text-xs font-bold px-2 py-1 rounded bg-primary/10"
        >
          Cambiar
        </button>
      </div>
    </div>
  </div> */}
  {/* Lista de items del carrito (scroll) - con altura limitada */}
  <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[100px] max-h-[280px]">
    {items.length === 0 ? (
      <div className="text-center text-slate-400 py-12">
        <ShoppingCart className="mx-auto mb-4 opacity-20" size={48} />
        <p className="font-medium">Carrito vacío</p>
        <p className="text-sm">Selecciona productos del catálogo</p>
      </div>
    ) : (
      items.map(p => (
        <div key={p.item.id} className="flex items-start gap-3">
          <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <ShoppingCart className="text-slate-500" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-0.5">
              <p className="text-sm font-bold">{p.item.title}</p>
              <p className="text-sm font-bold">${(p.item.price).toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeQty(p.item.id, -1)}
                  className="size-6 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-bold">{p.qty}</span>
                <button
                  onClick={() => changeQty(p.item.id, 1)}
                  className="size-6 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={() => removeItem(p.item.id)}
                className="text-red-500 text-xs font-bold hover:underline"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
  {/* Totales y botón - fijo abajo */}
  <div className="p-6 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 space-y-4 flex-shrink-0">
    <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
      <span>Subtotal</span>
      <span>${subtotal.toFixed(2)}</span>
    </div>
    <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
      <div className="flex items-center gap-1">
        <span>Impuesto</span>
        <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1 rounded">8%</span>
      </div>
      <span>${tax.toFixed(2)}</span>
    </div>
    <div className="flex items-center justify-between text-sm text-slate-500 font-medium pb-2 border-b border-dashed border-slate-300 dark:border-slate-600">
    
    </div>
    <div className="flex items-center justify-between text-xl font-extrabold text-slate-900 dark:text-slate-100 py-2">
      <span>Total</span>
      <span className="text-primary">${total.toFixed(2)}</span>
    </div>
    {/* Botón principal */}
    <button
      onClick={() => navigate('/sales')}
      className="w-full mt-4 py-5 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-2"
    >
      Completar Transacción
      <ChevronRight size={20} />
    </button>
  </div>
</section>
      </div>
    </div>
  )
}
