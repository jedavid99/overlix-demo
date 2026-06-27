    import React, { useState } from 'react';
    import {
      Search,
      Download,
      Plus,
      ChevronRight,
      ChevronLeft,
      FilterX,
      X,
      Shield,
      Smartphone,
      Calendar,
      DollarSign,
    } from 'lucide-react';
    import { Card, CardContent } from '@/shared/components/ui/card';
    import { Button } from '@/shared/components/ui/button';
    import { Badge } from '@/shared/components/ui/badge';
    import { useNavigate } from 'react-router-dom';
    interface Device {
      id: string;
      saleId: string;
      customer: string;
      email: string;
      model: string;
      imei: string;
      saleDate: string;
      status: 'active' | 'expired' | 'none';
      policyId?: string;
      planType?: string;
      startDate?: string;
      expiryDate?: string;
      claims?: {
        id: string;
        type: string;
        date: string;
        status: string;
        center: string;
      }[];
    }
    export default function IPhoneInsurance() {
      const navigate = useNavigate()  
      const [searchQuery, setSearchQuery] = useState('');
      const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
      const [modelFilter, setModelFilter] = useState('All Series');
      const [insuranceFilter, setInsuranceFilter] = useState('Active Status');
      const [expirationFilter, setExpirationFilter] = useState('Expiring Soon');
      const [currentPage, setCurrentPage] = useState(1);
      const [showAddModal, setShowAddModal] = useState(false);
      const [insuranceStep, setInsuranceStep] = useState(0);
      const [searchEmail, setSearchEmail] = useState('');
      const [foundClient, setFoundClient] = useState<Device | null>(null);
      const [clientNotFound, setClientNotFound] = useState(false);
      const [showRegisterClient, setShowRegisterClient] = useState(false);
      const [newClient, setNewClient] = useState({
        name: '',
        email: '',
        phone: '',
      });
      const [newInsurance, setNewInsurance] = useState({
        deviceId: '',
        planType: '',
        coverage: '',
        premium: 0,
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
      });
      // ?? Lista de dispositivos – vacía (cargar desde API)
      const devices: Device[] = [];
      const handleSearchClient = () => {
        const foundDevices = devices.filter(d => d.email.toLowerCase() === searchEmail.toLowerCase());
        if (foundDevices.length > 0) {
          setFoundClient(foundDevices[0]);
          setClientNotFound(false);
          setShowRegisterClient(false);
          setInsuranceStep(1);
        } else {
          setFoundClient(null);
          setClientNotFound(true);
          setShowRegisterClient(false);
        }
      };
      const handleRegisterNewClient = () => {
        const newDevice: Device = {
          id: String(devices.length + 1),
          saleId: `#SL-${Math.floor(Math.random() * 10000)}`,
          customer: newClient.name,
          email: newClient.email,
          model: '',
          imei: '',
          saleDate: new Date().toLocaleDateString(),
          status: 'none',
        };
        setFoundClient(newDevice);
        setClientNotFound(false);
        setShowRegisterClient(false);
        setInsuranceStep(1);
        setNewClient({ name: '', email: '', phone: '' });
      };
      const getStatusBadge = (status: string) => {
        switch (status) {
          case 'active':
            return <Badge variant="success">Activo</Badge>;
          case 'expired':
            return <Badge variant="destructive">Expirado</Badge>;
          case 'none':
            return <Badge variant="outline">Sin seguro</Badge>;
          default:
            return <Badge variant="outline">Desconocido</Badge>;
        }
      };
      return (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Dispositivos Vendidos y Asegurados</h1>
              <p className="text-muted-foreground text-base max-w-lg">
                Gestione registros de ventas detallados, rastree pólizas de seguro activas y monitoree fechas de vencimiento para todas las unidades iPhone.
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/stock/iphone-insurance')}
                    variant="outline"
                    className="w-full gap-2 bg-primary text-primary-foreground"
                  >
                    <Shield size={16} />
                    Agregar seguro
                  </Button>
            </div>
          </div>
          {/* Filters */}
          <div className="flex gap-3 flex-wrap items-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-input">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Modelo:</span>
              <select
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm font-semibold text-foreground cursor-pointer"
              >
                <option>Todas las Series</option>
                <option>iPhone 15 Pro</option>
                <option>iPhone 15</option>
                <option>iPhone 14</option>
              </select>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-input">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Seguro:</span>
              <select
                value={insuranceFilter}
                onChange={(e) => setInsuranceFilter(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm font-semibold text-foreground cursor-pointer"
              >
                <option>Estado Activo</option>
                <option>Activo</option>
                <option>Expirado</option>
                <option>Sin Seguro</option>
              </select>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-input">
              <span className="text-xs font-semibold uppercase text-muted-foreground">Vencimiento:</span>
              <select
                value={expirationFilter}
                onChange={(e) => setExpirationFilter(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm font-semibold text-foreground cursor-pointer"
              >
                <option>Próximo a Vencer</option>
                <option>Expirado</option>
                <option>Activo</option>
              </select>
            </div>
            <button className="ml-auto text-primary text-sm font-semibold flex items-center gap-1 hover:opacity-80">
              <FilterX size={16} />
              Limpiar Filtros
            </button>
          </div>
          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">ID Venta</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cliente</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Modelo iPhone</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">IMEI</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fecha Venta</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado Seguro</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {devices.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                          <Smartphone size={48} className="mx-auto text-muted-foreground/40 mb-4" />
                          <p className="font-medium">No hay dispositivos registrados</p>
                          <p className="text-sm">Agrega ventas desde el panel de administración</p>
                        </td>
                      </tr>
                    ) : (
                      devices.map(device => (
                        <tr
                          key={device.id}
                          onClick={() => setSelectedDevice(device)}
                          className="hover:bg-muted/30 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-5 text-sm font-semibold text-foreground">{device.saleId}</td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-foreground">{device.customer}</span>
                              <span className="text-xs text-muted-foreground">{device.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm font-medium text-foreground">{device.model}</td>
                          <td className="px-6 py-5 text-sm font-mono text-muted-foreground">{device.imei}</td>
                          <td className="px-6 py-5 text-sm text-muted-foreground">{device.saleDate}</td>
                          <td className="px-6 py-5">{getStatusBadge(device.status)}</td>
                          <td className="px-6 py-5 text-right">
                            <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 bg-muted/30 border-t border-border">
                <span className="text-sm text-muted-foreground">Mostrando {devices.length} de {devices.length} entradas</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon-sm">
                    <ChevronLeft size={16} />
                  </Button>
                  <Button variant="default" size="icon-sm">1</Button>
                  <Button variant="outline" size="icon-sm">
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Side Drawer */}
          {selectedDevice && (
            <>
              <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedDevice(null)}></div>
              <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-card shadow-2xl border-l border-border z-50 overflow-y-auto">
                <div className="flex flex-col h-full">
                  {/* Drawer Header */}
                  <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30 sticky top-0">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Detalles de Póliza</h3>
                      <p className="text-sm text-muted-foreground">Venta {selectedDevice.saleId} • {selectedDevice.customer}</p>
                    </div>
                    <Button variant="ghost" size="icon-sm" onClick={() => setSelectedDevice(null)}>
                      <X size={20} />
                    </Button>
                  </div>
                  {/* Drawer Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Insurance Policy */}
                    {selectedDevice.status !== 'none' && (
                      <section>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Póliza de Seguro</h4>
                          <Badge variant={selectedDevice.status === 'active' ? 'success' : 'destructive'}>
                            {selectedDevice.status === 'active' ? 'ACTIVO' : 'EXPIRADO'}
                          </Badge>
                        </div>
                        <Card className="bg-primary/5 border-primary/20">
                          <CardContent className="p-5">
                            <div className="grid grid-cols-2 gap-y-4">
                              <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">Tipo de Plan</p>
                                <p className="text-sm font-semibold text-foreground">{selectedDevice.planType || '—'}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">ID de Póliza</p>
                                <p className="text-sm font-semibold text-foreground">{selectedDevice.policyId || '—'}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">Fecha Inicio</p>
                                <p className="text-sm font-semibold text-foreground">{selectedDevice.startDate || '—'}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase">Expira</p>
                                <p className="text-sm font-semibold text-foreground">{selectedDevice.expiryDate || '—'}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </section>
                    )}
                    {/* Device Details */}
                    <section>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                        <Smartphone size={16} /> Info Hardware
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="text-sm text-muted-foreground">Modelo</span>
                          <span className="text-sm font-medium text-foreground">{selectedDevice.model || '—'}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="text-sm text-muted-foreground">IMEI</span>
                          <span className="text-sm font-mono text-foreground">{selectedDevice.imei || '—'}</span>
                        </div>
                        <div className="flex justify-between border-b border-border pb-2">
                          <span className="text-sm text-muted-foreground">Fecha Venta</span>
                          <span className="text-sm font-medium text-foreground">{selectedDevice.saleDate || '—'}</span>
                        </div>
                      </div>
                    </section>
                    {/* Claims */}
                    {selectedDevice.claims && selectedDevice.claims.length > 0 && (
                      <section>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                          <Shield size={16} /> Reclamaciones
                        </h4>
                        <div className="space-y-3">
                          {selectedDevice.claims.map(claim => (
                            <Card key={claim.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <p className="font-semibold text-foreground">{claim.type}</p>
                                  <Badge variant="outline" className="text-xs">{claim.status}</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{claim.date}</p>
                                <p className="text-xs text-muted-foreground">{claim.center}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      );
    }
