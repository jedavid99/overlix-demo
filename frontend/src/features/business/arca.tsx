import React, { useState } from 'react';
import {
  Key,
  Zap,
  Shield,
  AlertCircle,
  CheckCircle,
  Upload,
  Save,
  Bell,
  User,
  Gauge,
  Lock,
  FileText,
  Database,
} from 'lucide-react';
// Datos mock eliminados - conectar con API real
export default function ARCA() {
  const [isConnected, setIsConnected] = useState(false);
  const [formData, setFormData] = useState({
    cuit: '20-12345678-9',
    pointOfSale: '0001',
    environment: 'Testing (Homologación)',
    serviceType: 'WSFE (Factura Electrónica)',
    businessType: 'Responsable Inscripto',
    defaultVAT: '21% (Standard)',
    enablePercepciones: false,
  });
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
    
      <main className="max-w-6xl mx-auto w-full p-6 lg:p-10">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">ARCA Integration Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your connection to ARCA (ex-AFIP) Web Services</p>
        </div>
        {/* Connection Status Card */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className={`size-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              isConnected
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}>
              {isConnected ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Connection Status</h2>
              <p className={`flex items-center gap-2 font-bold text-sm ${
                isConnected
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                <span className={`size-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'} ${!isConnected && 'animate-pulse'}`}></span>
                {isConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsConnected(!isConnected)}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm"
            >
              <Zap size={16} />
              Test Connection
            </button>
            <label className="relative flex h-7 w-12 cursor-pointer items-center rounded-full bg-slate-200 dark:bg-slate-800 p-0.5 transition-colors has-[:checked]:bg-blue-600">
              <input
                type="checkbox"
                checked={isConnected}
                onChange={(e) => setIsConnected(e.target.checked)}
                className="sr-only peer"
              />
              <div className="h-full w-5 rounded-full bg-white shadow-md transition-all peer-checked:translate-x-5"></div>
            </label>
          </div>
        </div>
        {/* Business Credentials & Digital Certificate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Business Credentials */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Key size={20} className="text-blue-600" />
              Business Credentials
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">CUIT Number</label>
                <input
                  type="text"
                  placeholder="20-12345678-9"
                  value={formData.cuit}
                  onChange={(e) => handleInputChange('cuit', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Point of Sale</label>
                  <input
                    type="text"
                    placeholder="0001"
                    value={formData.pointOfSale}
                    onChange={(e) => handleInputChange('pointOfSale', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Environment</label>
                  <select
                    value={formData.environment}
                    onChange={(e) => handleInputChange('environment', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Testing (Homologación)</option>
                    <option>Production (Producción)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Service Type</label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>WSFE (Factura Electrónica)</option>
                  <option>WSMTX (Detalle de Mercaderías)</option>
                  <option>WSFEX (Exportación)</option>
                  <option>WSBFE (Bienes de Capital)</option>
                </select>
              </div>
            </div>
          </div>
          {/* Digital Certificate */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Shield size={20} className="text-blue-600" />
              Digital Certificate
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Upload Certificate (.crt)</label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer group">
                  <Upload className="text-slate-400 group-hover:text-blue-600 mx-auto mb-2" size={24} />
                  <p className="text-xs text-slate-500 dark:text-slate-400">Drag or click to upload</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Private Key (.key)</label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer group">
                  <Lock className="text-slate-400 group-hover:text-blue-600 mx-auto mb-2" size={24} />
                  <p className="text-xs text-slate-500 dark:text-slate-400">Drag or click to upload</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">Certificates are encrypted and stored securely.</p>
            </div>
          </div>
        </div>
        {/* Tax Configuration */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm mb-8">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <FileText size={20} className="text-blue-600" />
            Tax Configuration
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Business Type</label>
              <select
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Responsable Inscripto</option>
                <option>Monotributista</option>
                <option>Exento</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Default VAT (IVA)</label>
              <select
                value={formData.defaultVAT}
                onChange={(e) => handleInputChange('defaultVAT', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>21% (Standard)</option>
                <option>10.5% (Reduced)</option>
                <option>27% (Enhanced)</option>
                <option>0% (Exempt)</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="percepciones"
                checked={formData.enablePercepciones}
                onChange={(e) => handleInputChange('enablePercepciones', e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="percepciones" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Enable Percepciones
              </label>
            </div>
          </div>
        </div>
        {/* Synchronization Logs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Database size={20} className="text-blue-600" />
              Synchronization Logs (Last 10)
            </h3>
            <button className="text-blue-600 hover:text-blue-700 dark:hover:text-blue-400 text-sm font-medium transition-colors">
              Clear Logs
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Request Type</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">CAE / Response</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* Conectar con API real: api.get('/arca/logs') */}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-slate-900 dark:text-slate-100">-</td>
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">-</td>
                  <td className="px-6 py-4">-</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400 max-w-40 truncate">-</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Footer Actions */}
        <div className="flex justify-end gap-4">
          <button className="px-6 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Discard Changes
          </button>
          <button className="px-8 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
            <Save size={16} />
            Save Settings
          </button>
        </div>
      </main>
    </div>
  );
}
