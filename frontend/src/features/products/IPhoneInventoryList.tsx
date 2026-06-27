import React, { useState } from 'react';
import {
  Search,
  Download,
  Plus,
  TrendingUp,
  DollarSign,
  AlertCircle,
  QrCode,
  Edit,
  ChevronLeft,
  ChevronRight,
  Bell,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { MdPhoneAndroid } from 'react-icons/md';
import { Link } from 'react-router-dom';
interface iPhone {
  id: string;
  model: string;
  color: string;
  modelNumber: string;
  storage: string;
  imei: string;
  battery: number;
  status: 'Available' | 'Reserved' | 'Sold' | 'Out of Stock';
  image: React.ReactNode;
}
export default function IPhoneInventoryList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [seriesFilter, setSeriesFilter] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  // 📦 Lista de iPhone – vacía (cargar desde API)
  const iphones: iPhone[] = [];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' };
      case 'Reserved':
        return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' };
      case 'Sold':
        return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-500' };
      case 'Out of Stock':
        return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' };
      default:
        return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-500' };
    }
  };
  const getBatteryColor = (battery: number) => {
    if (battery >= 80) return 'bg-emerald-500';
    if (battery >= 50) return 'bg-amber-500';
    if (battery >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Inventario iPhone</h2>
            <p className="text-slate-500 dark:text-slate-400">Monitoreo de stock y gestión de activos en tiempo real</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium">
              <Download size={18} />
              <span>Exportar CSV</span>
            </button>
            <Link to="/stock/iphone-add">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 font-medium">
                <Plus size={18} />
                <span>Agregar nuevo stock</span>
              </button>
            </Link>
          </div>
        </div>
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
                <Search size={24} />
              </div>
              <span className="text-slate-500 text-sm font-medium flex items-center gap-1">
                <TrendingUp size={16} /> Sin datos
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Total de unidades iPhone</h3>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">0</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600">
                <DollarSign size={24} />
              </div>
              <span className="text-slate-500 text-sm font-medium">USD</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Valor de mercado</h3>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">$0.00</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center text-red-600">
                <AlertCircle size={24} />
              </div>
              <span className="text-red-500 text-sm font-medium">Crítico</span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">Modelos sin stock</h3>
            <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">0</p>
          </div>
        </div>
        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-[300px]">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar IMEI, modelo o número de serie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={seriesFilter}
                onChange={(e) => setSeriesFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option>Series: Todas</option>
                <option>iPhone 15 Series</option>
                <option>iPhone 14 Series</option>
                <option>iPhone 13 Series</option>
              </select>
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option>Condición: Todas</option>
                <option>Nuevo</option>
                <option>Usado - Como nuevo</option>
                <option>Usado - Bueno</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
                <Filter size={18} />
              </button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-600 dark:text-slate-400">
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Producto</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Almacenamiento</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">IMEI / Serial</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Batería</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Estado</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {iphones.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      <MdPhoneAndroid size={48} className="mx-auto text-slate-400/40 mb-4" />
                      <p className="font-medium text-slate-900 dark:text-white">No hay dispositivos registrados</p>
                      <p className="text-sm text-slate-500">Agrega dispositivos desde el panel de administración</p>
                    </td>
                  </tr>
                ) : (
                  iphones.map(phone => {
                    const statusColors = getStatusColor(phone.status);
                    return (
                      <tr key={phone.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-2xl">
                              {phone.image}
                            </div>
                            <div>
                              <p className={phone.status === 'Out of Stock' ? 'font-semibold text-slate-400' : 'font-semibold text-slate-900 dark:text-white'}>
                                {phone.model}
                              </p>
                              <p className="text-xs text-slate-500">{phone.color} • Modelo {phone.modelNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded text-xs font-medium ${phone.status === 'Out of Stock' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'}`}>
                            {phone.storage}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-slate-600 dark:text-slate-400">{phone.imei}</td>
                        <td className="px-6 py-4">
                          {phone.battery > 0 ? (
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${getBatteryColor(phone.battery)} transition-all`}
                                  style={{ width: `${phone.battery}%` }}
                                ></div>
                              </div>
                              <span className={`text-xs font-medium ${getBatteryColor(phone.battery) === 'bg-emerald-500' ? 'text-emerald-500' : getBatteryColor(phone.battery) === 'bg-amber-500' ? 'text-amber-500' : 'text-red-500'}`}>
                                {phone.battery}%
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-12 h-2 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                              <span className="text-xs font-medium text-slate-400">N/A</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors.bg} ${statusColors.text}`}>
                            {phone.status === 'Available' ? 'Disponible' :
                             phone.status === 'Reserved' ? 'Reservado' :
                             phone.status === 'Sold' ? 'Vendido' :
                             'Sin stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {phone.status === 'Out of Stock' ? (
                            <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-all font-medium">
                              Reponer
                            </button>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-1.5 hover:text-blue-600 transition-colors border border-slate-200 dark:border-slate-800 rounded text-slate-600 dark:text-slate-400" title="Imprimir código de barras">
                                <QrCode size={16} />
                              </button>
                              <button className="p-1.5 hover:text-blue-600 transition-colors border border-slate-200 dark:border-slate-800 rounded text-slate-600 dark:text-slate-400" title="Editar">
                                <Edit size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">Mostrando 0 de 0 entradas</p>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white text-xs font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50" disabled>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 mb-12">
          {/* Stock Distribution */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Distribución de stock por serie</h3>
              <button className="text-blue-600 text-xs font-semibold hover:underline">Ver detalles</button>
            </div>
            <div className="space-y-4">
              <div className="text-center text-slate-500 py-8">
                <p className="font-medium">Sin datos disponibles</p>
                <p className="text-sm">No hay stock registrado</p>
              </div>
            </div>
          </div>
          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Actividad reciente</h3>
            <div className="space-y-4">
              <div className="text-center text-slate-500 py-8">
                <p className="font-medium">Sin actividad reciente</p>
                <p className="text-sm">Los movimientos aparecerán aquí</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
