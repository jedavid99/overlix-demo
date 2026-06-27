import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../features/dashboard/home'
import Login from '../features/auth/index'
import Register from '../features/auth/Register'
import AdminActivationCodes from '../features/auth/AdminActivationCodes'
import AdminLogin from '../features/auth/AdminLogin'
import SimpleCodeGenerator from '../features/auth/SimpleCodeGenerator'
import Dashboard from '../features/dashboard/index'
import Clients from '../features/clients/index'
import Sales from '../features/sales/index'
import Stock from '../features/products/index'
import Providers from '../features/shipments/providers'
import Settings from '../features/settings/index'
import RootLayout from './layout'
import AdminLayout from '../shared/components/layouts/AdminLayout'
import RepairsList from '../features/repairs/components/RepairList'
import RepairAdd from '../features/repairs/components/RepairAdd'
import RepairFlow from '../features/repairs/RepairFlow'
import RepairAddSimple from '../features/repairs/RepairAdd'
import Budgets from '../features/repairs/components/Budgets'
import ClientAdd from '../features/clients/Add'
import SaleAdd from '../features/sales/Add'
import StockAdd from '../features/products/Add'
import ProviderAdd from '../features/shipments/Add'
import ProvidersOrders from '../features/shipments/Orders'
import OrdersList from '../features/shipments/OrdersList'
import OrderForm from '../features/shipments/OrderForm'
import OrderDetail from '../features/shipments/OrderDetail'
import Billing from '../features/business/billing'
import Expenses from '../features/expenses/index'
import ExpensesAdd from '../features/expenses/Add'
import ExpensesCategories from '../features/expenses/Categories'
import Developer from '../features/settings/developer'
import Profile from '../features/settings/profile'
import CajaDiaria from '../features/sales/cash-register'
import ARCA from '../features/business/arca'
import ARCAIVA from '../features/business/ARCAIVA'
import CreateInvoice from '../features/sales/invoice'
import InvoicesList from '../features/sales/invoices'
import IphoneSales from '../features/sales/iphone/Sales'
import IphoneRecords from '../features/sales/iphone/Records'
import IphoneInsurance from '../features/sales/iphone/Insurance'
import IphoneCanje from '../features/sales/iphone/Canje'
import CanjeNew from '../features/sales/iphone/CanjeNew'
import IPhoneInventory from '../features/products/IPhoneInventory'
import IPhoneInventoryList from '../features/products/IPhoneInventoryList'
import IPhoneInsurance from '../features/products/IPhoneInsurance'
import StockRepuestos from '../features/products/Repuestos'
import StockAdjustments from '../features/products/Adjustments'
import Notifications from '../features/settings/notifications'
import Tracking from '../features/shipments/Tracking'
import Remises from '../features/shipments/Remises'
import ReportsSales from '../features/reports/SalesReport'
import ReportsStock from '../features/reports/StockReport'
import ReportsFinancial from '../features/reports/FinancialReport'
import Docs from '../features/settings/docs'
import Help from '../features/settings/help'
import RepairsReport from '@/features/reports/RepairsReport'
import OrderConfirmation from '../features/repairs/OrderConfirmation'
import RepairEdit from '../features/repairs/components/RepairEdit'
import ProtectedRoute from '../components/ProtectedRoute'
import PublicRoute from '../components/PublicRoute'
export function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
      <Route path="/admin/generate-codes" element={<PublicRoute><SimpleCodeGenerator /></PublicRoute>} />
      <Route path="/admin/activation-codes" element={<PublicRoute><AdminActivationCodes /></PublicRoute>} />
      <Route path="/home" element={<Home />} />
      {/* Rutas protegidas */}
      <Route path="/dashboard" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><AdminLayout><Clients /></AdminLayout></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><AdminLayout><Sales /></AdminLayout></ProtectedRoute>} />
      <Route path="/stock" element={<ProtectedRoute><AdminLayout><Stock /></AdminLayout></ProtectedRoute>} />
      <Route path="/providers" element={<ProtectedRoute><AdminLayout><Providers /></AdminLayout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Navigate to="/reports/sales" replace /></ProtectedRoute>} />
      <Route path="/billing" element={<ProtectedRoute><AdminLayout><InvoicesList /></AdminLayout></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><AdminLayout><Expenses /></AdminLayout></ProtectedRoute>} />
      <Route path="/developer" element={<ProtectedRoute><AdminLayout><Developer /></AdminLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AdminLayout><Profile /></AdminLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AdminLayout><Settings /></AdminLayout></ProtectedRoute>} />
      <Route path="/clients/add" element={<ProtectedRoute><AdminLayout><ClientAdd /></AdminLayout></ProtectedRoute>} />
      <Route path="/sales/add" element={<ProtectedRoute><AdminLayout><SaleAdd /></AdminLayout></ProtectedRoute>} />
      <Route path="/stock/add" element={<ProtectedRoute><AdminLayout><StockAdd /></AdminLayout></ProtectedRoute>} />
      <Route path="/providers/add" element={<ProtectedRoute><AdminLayout><ProviderAdd /></AdminLayout></ProtectedRoute>} />
      <Route path="/expenses/add" element={<ProtectedRoute><AdminLayout><ExpensesAdd /></AdminLayout></ProtectedRoute>} />
      {/* keep backwards compatibility: direct /envios goes to tracking as well */}
      <Route path="/envios" element={<ProtectedRoute><AdminLayout><Tracking /></AdminLayout></ProtectedRoute>} />
      <Route path="/envios/tracking" element={<ProtectedRoute><AdminLayout><Tracking /></AdminLayout></ProtectedRoute>} />
      <Route path="/caja-diaria" element={<ProtectedRoute><AdminLayout><CajaDiaria /></AdminLayout></ProtectedRoute>} />
      <Route path="/reparaciones/list" element={<ProtectedRoute><AdminLayout><RepairsList /></AdminLayout></ProtectedRoute>} />
      <Route path="/reparaciones/add" element={<ProtectedRoute><AdminLayout><RepairFlow /></AdminLayout></ProtectedRoute>} />
      <Route path="/reparaciones/add-simple" element={<ProtectedRoute><AdminLayout><RepairAddSimple /></AdminLayout></ProtectedRoute>} />
      <Route path="/reparaciones/edit/:id" element={<ProtectedRoute><AdminLayout><RepairEdit /></AdminLayout></ProtectedRoute>} />
      <Route path="/reparaciones/confirmation" element={<ProtectedRoute><AdminLayout><OrderConfirmation /></AdminLayout></ProtectedRoute>} />
      <Route path="/reparaciones/budgets" element={<ProtectedRoute><AdminLayout><Budgets /></AdminLayout></ProtectedRoute>} />
      <Route path="/billing/ARCA" element={<ProtectedRoute><AdminLayout><ARCA /></AdminLayout></ProtectedRoute>} />
      <Route path="/billing/ARCA/iva" element={<ProtectedRoute><AdminLayout><ARCAIVA /></AdminLayout></ProtectedRoute>} />
      <Route path="/billing/create" element={<ProtectedRoute><AdminLayout><CreateInvoice /></AdminLayout></ProtectedRoute>} />
      <Route path="/iphone/sales" element={<ProtectedRoute><AdminLayout><IphoneSales /></AdminLayout></ProtectedRoute>} />
      <Route path="/iphone/records" element={<ProtectedRoute><AdminLayout><IphoneRecords /></AdminLayout></ProtectedRoute>} />
      <Route path="/iphone/insurance" element={<ProtectedRoute><AdminLayout><IphoneInsurance /></AdminLayout></ProtectedRoute>} />
      <Route path="/iphone-canje" element={<ProtectedRoute><AdminLayout><IphoneCanje /></AdminLayout></ProtectedRoute>} />
      <Route path="/iphone-canje/new" element={<ProtectedRoute><AdminLayout><CanjeNew /></AdminLayout></ProtectedRoute>} />
      <Route path="/stock/iphone" element={<ProtectedRoute><AdminLayout><IPhoneInventoryList /></AdminLayout></ProtectedRoute>} />
      <Route path="/stock/iphone-add" element={<ProtectedRoute><AdminLayout><IPhoneInventory /></AdminLayout></ProtectedRoute>} />
      <Route path="/stock/iphone-insurance" element={<ProtectedRoute><AdminLayout><IPhoneInsurance /></AdminLayout></ProtectedRoute>} />
      <Route path="/stock/repuestos" element={<ProtectedRoute><AdminLayout><StockRepuestos /></AdminLayout></ProtectedRoute>} />
      <Route path="/stock/adjustments" element={<ProtectedRoute><AdminLayout><StockAdjustments /></AdminLayout></ProtectedRoute>} />
      <Route path="/providers/orders" element={<ProtectedRoute><AdminLayout><OrdersList /></AdminLayout></ProtectedRoute>} />
      <Route path="/providers/orders/add" element={<ProtectedRoute><AdminLayout><OrderForm /></AdminLayout></ProtectedRoute>} />
      <Route path="/providers/orders/edit/:id" element={<ProtectedRoute><AdminLayout><OrderForm /></AdminLayout></ProtectedRoute>} />
      <Route path="/providers/orders/:id" element={<ProtectedRoute><AdminLayout><OrderDetail /></AdminLayout></ProtectedRoute>} />
      <Route path="/expenses/categories" element={<ProtectedRoute><AdminLayout><ExpensesCategories /></AdminLayout></ProtectedRoute>} />
      <Route path="/reports/sales" element={<ProtectedRoute><AdminLayout><ReportsSales /></AdminLayout></ProtectedRoute>} />
      <Route path="/reports/stock" element={<ProtectedRoute><AdminLayout><ReportsStock /></AdminLayout></ProtectedRoute>} />
      <Route path="/reports/financial" element={<ProtectedRoute><AdminLayout><ReportsFinancial /></AdminLayout></ProtectedRoute>} />
      
      <Route path="/reports/repairs" element={<ProtectedRoute><AdminLayout><RepairsReport /></AdminLayout></ProtectedRoute>} />
      <Route path="/envios/remises" element={<ProtectedRoute><AdminLayout><Remises /></AdminLayout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><AdminLayout><Notifications /></AdminLayout></ProtectedRoute>} />
      <Route path="/docs" element={<ProtectedRoute><AdminLayout><Docs /></AdminLayout></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute><AdminLayout><Help /></AdminLayout></ProtectedRoute>} />
    </Routes>
  )
}
