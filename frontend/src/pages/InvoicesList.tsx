import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Download,
  Plus,
  FileDown,
  Mail,
  Trash2,
  RefreshCw,
  Edit,
  Filter,
  TrendingUp,
  Clock,
  Wallet,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import DataTable from '../components/data-table';
interface Invoice {
  id: string;
  number: string;
  date: string;
  customer: string;
  cuit: string;
  amount: number;
  status: 'authorized' | 'pending' | 'error';
}
export default function InvoicesList() {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [invoiceType, setInvoiceType] = useState('All');
  const [paymentStatus, setPaymentStatus] = useState('All Statuses');
  const [arcaStatus, setArcaStatus] = useState('Any Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const invoices: Invoice[] = [
    {
      id: '1',
      number: 'A-0001-00000123',
      date: 'Oct 24, 2023',
      customer: 'Global Tech Solutions',
      cuit: '30-71234567-9',
      amount: 1250.0,
      status: 'authorized',
    },
    {
      id: '2',
      number: 'B-0001-00000124',
      date: 'Oct 25, 2023',
      customer: 'Individual Client',
      cuit: '22.456.789',
      amount: 420.0,
      status: 'error',
    },
    {
      id: '3',
      number: 'A-0001-00000125',
      date: 'Oct 26, 2023',
      customer: 'Modern Retail Corp',
      cuit: '30-55889911-2',
      amount: 3800.0,
      status: 'pending',
    },
    {
      id: '4',
      number: 'A-0001-00000126',
      date: 'Oct 26, 2023',
      customer: 'Software Lab SA',
      cuit: '30-11223344-5',
      amount: 5600.0,
      status: 'authorized',
    },
  ];
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'authorized':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
            <span className="size-1.5 rounded-full bg-green-500"></span>
            Autorizada
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-500"></span>
            Pendiente
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
            <span className="size-1.5 rounded-full bg-red-500"></span>
            Error
          </span>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = arcaStatus === 'Any Status' || 
                         (arcaStatus === 'Authorized (CAE Active)' && invoice.status === 'authorized') ||
                         (arcaStatus === 'Pending' && invoice.status === 'pending') ||
                         (arcaStatus === 'Error' && invoice.status === 'error');
    return matchesSearch && matchesStatus;
  });
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const pendingCount = invoices.filter(inv => inv.status === 'pending').length;
  const unpaidAmount = 8120.50;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Facturas</h1>
          <p className="text-muted-foreground">Gestiona tus facturas electrónicas y estado ARCA</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Exportar
          </Button>
          <Link to="/create-invoice">
            <Button>
              <Plus size={16} className="mr-2" />
              Nueva factura
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total facturado</p>
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <div className="flex items-center gap-1 text-green-600 text-sm mt-2">
              <TrendingUp size={16} />
              <span>+12.5% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pendientes</p>
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-foreground">{pendingCount}</p>
            <p className="text-sm text-muted-foreground mt-2">Requieren acción ARCA</p>
          </CardContent>
        </Card>
        <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Saldo pendiente</p>
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">${unpaidAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            <p className="text-sm text-muted-foreground mt-2">14 facturas sin pagar</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Filter size={20} className="text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rango de fechas</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full rounded border border-input bg-background text-foreground py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option>Últimos 30 días</option>
                <option>Mes actual</option>
                <option>Último trimestre</option>
                <option>Personalizado</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo de factura</label>
              <div className="flex gap-2 flex-wrap">
                {['Todas', 'Factura A', 'Factura B'].map(type => (
                  <Badge
                    key={type}
                    variant={invoiceType === type ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setInvoiceType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado de pago</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full rounded border border-input bg-background text-foreground py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option>Todos los estados</option>
                <option>Pagada</option>
                <option>No pagada</option>
                <option>Parcialmente pagada</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado ARCA</label>
              <select
                value={arcaStatus}
                onChange={(e) => setArcaStatus(e.target.value)}
                className="w-full rounded border border-input bg-background text-foreground py-2 px-3 focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option>Cualquier estado</option>
                <option>Autorizada</option>
                <option>Pendiente</option>
                <option>Error</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      <DataTable
        data={filteredInvoices.map(inv => ({
          id: inv.id,
          number: inv.number,
          date: inv.date,
          customer: inv.customer,
          amount: inv.amount,
          status: inv.status,
        }))}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        loading={false}
        emptyMessage="No hay facturas registradas"
      />
    </div>
  );
}
