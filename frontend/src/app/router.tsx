import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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
import PrivateRoute from '../shared/components/PrivateRoute'
export function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<PrivateRoute><Login /></PrivateRoute>} />
      <Route path="/register" element={<PrivateRoute><Register /></PrivateRoute>} />
      <Route path="/admin/login" element={<PrivateRoute><AdminLogin /></PrivateRoute>} />
      <Route path="/admin/generate-codes" element={<PrivateRoute><SimpleCodeGenerator /></PrivateRoute>} />
      <Route path="/admin/activation-codes" element={<PrivateRoute><AdminActivationCodes /></PrivateRoute>} />
      {/* Rutas protegidas */}
      <Route path="/dashboard" element={<PrivateRoute><AdminLayout><Dashboard /></AdminLayout></PrivateRoute>} />
      <Route path="/clients" element={<PrivateRoute><AdminLayout><Clients /></AdminLayout></PrivateRoute>} />
      <Route path="/sales" element={<PrivateRoute><AdminLayout><Sales /></AdminLayout></PrivateRoute>} />
      <Route path="/stock" element={<PrivateRoute><AdminLayout><Stock /></AdminLayout></PrivateRoute>} />
      <Route path="/providers" element={<PrivateRoute><AdminLayout><Providers /></AdminLayout></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><Navigate to="/reports/sales" replace /></PrivateRoute>} />
      <Route path="/billing" element={<PrivateRoute><AdminLayout><InvoicesList /></AdminLayout></PrivateRoute>} />
      <Route path="/expenses" element={<PrivateRoute><AdminLayout><Expenses /></AdminLayout></PrivateRoute>} />
      <Route path="/developer" element={<PrivateRoute><AdminLayout><Developer /></AdminLayout></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><AdminLayout><Profile /></AdminLayout></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><AdminLayout><Settings /></AdminLayout></PrivateRoute>} />
      <Route path="/clients/add" element={<PrivateRoute><AdminLayout><ClientAdd /></AdminLayout></PrivateRoute>} />
      <Route path="/sales/add" element={<PrivateRoute><AdminLayout><SaleAdd /></AdminLayout></PrivateRoute>} />
      <Route path="/stock/add" element={<PrivateRoute><AdminLayout><StockAdd /></AdminLayout></PrivateRoute>} />
      <Route path="/providers/add" element={<PrivateRoute><AdminLayout><ProviderAdd /></AdminLayout></PrivateRoute>} />
      <Route path="/expenses/add" element={<PrivateRoute><AdminLayout><ExpensesAdd /></AdminLayout></PrivateRoute>} />
      {/* keep backwards compatibility: direct /envios goes to tracking as well */}
      <Route path="/envios" element={<PrivateRoute><AdminLayout><Tracking /></AdminLayout></PrivateRoute>} />
      <Route path="/envios/tracking" element={<PrivateRoute><AdminLayout><Tracking /></AdminLayout></PrivateRoute>} />
      <Route path="/caja-diaria" element={<PrivateRoute><AdminLayout><CajaDiaria /></AdminLayout></PrivateRoute>} />
      <Route path="/reparaciones/list" element={<PrivateRoute><AdminLayout><RepairsList /></AdminLayout></PrivateRoute>} />
      <Route path="/reparaciones/add" element={<PrivateRoute><AdminLayout><RepairFlow /></AdminLayout></PrivateRoute>} />
      <Route path="/reparaciones/add-simple" element={<PrivateRoute><AdminLayout><RepairAddSimple /></AdminLayout></PrivateRoute>} />
      <Route path="/reparaciones/edit/:id" element={<PrivateRoute><AdminLayout><RepairEdit /></AdminLayout></PrivateRoute>} />
      <Route path="/reparaciones/confirmation" element={<PrivateRoute><AdminLayout><OrderConfirmation /></AdminLayout></PrivateRoute>} />
      <Route path="/reparaciones/budgets" element={<PrivateRoute><AdminLayout><Budgets /></AdminLayout></PrivateRoute>} />
      <Route path="/billing/ARCA" element={<PrivateRoute><AdminLayout><ARCA /></AdminLayout></PrivateRoute>} />
      <Route path="/billing/ARCA/iva" element={<PrivateRoute><AdminLayout><ARCAIVA /></AdminLayout></PrivateRoute>} />
      <Route path="/billing/create" element={<PrivateRoute><AdminLayout><CreateInvoice /></AdminLayout></PrivateRoute>} />
      <Route path="/iphone/sales" element={<PrivateRoute><AdminLayout><IphoneSales /></AdminLayout></PrivateRoute>} />
      <Route path="/iphone/records" element={<PrivateRoute><AdminLayout><IphoneRecords /></AdminLayout></PrivateRoute>} />
      <Route path="/iphone/insurance" element={<PrivateRoute><AdminLayout><IphoneInsurance /></AdminLayout></PrivateRoute>} />
      <Route path="/iphone-canje" element={<PrivateRoute><AdminLayout><IphoneCanje /></AdminLayout></PrivateRoute>} />
      <Route path="/iphone-canje/new" element={<PrivateRoute><AdminLayout><CanjeNew /></AdminLayout></PrivateRoute>} />
      <Route path="/stock/iphone" element={<PrivateRoute><AdminLayout><IPhoneInventoryList /></AdminLayout></PrivateRoute>} />
      <Route path="/stock/iphone-add" element={<PrivateRoute><AdminLayout><IPhoneInventory /></AdminLayout></PrivateRoute>} />
      <Route path="/stock/iphone-insurance" element={<PrivateRoute><AdminLayout><IPhoneInsurance /></AdminLayout></PrivateRoute>} />
      <Route path="/stock/repuestos" element={<PrivateRoute><AdminLayout><StockRepuestos /></AdminLayout></PrivateRoute>} />
      <Route path="/stock/adjustments" element={<PrivateRoute><AdminLayout><StockAdjustments /></AdminLayout></PrivateRoute>} />
      <Route path="/providers/orders" element={<PrivateRoute><AdminLayout><OrdersList /></AdminLayout></PrivateRoute>} />
      <Route path="/providers/orders/add" element={<PrivateRoute><AdminLayout><OrderForm /></AdminLayout></PrivateRoute>} />
      <Route path="/providers/orders/edit/:id" element={<PrivateRoute><AdminLayout><OrderForm /></AdminLayout></PrivateRoute>} />
      <Route path="/providers/orders/:id" element={<PrivateRoute><AdminLayout><OrderDetail /></AdminLayout></PrivateRoute>} />
      <Route path="/expenses/categories" element={<PrivateRoute><AdminLayout><ExpensesCategories /></AdminLayout></PrivateRoute>} />
      <Route path="/reports/sales" element={<PrivateRoute><AdminLayout><ReportsSales /></AdminLayout></PrivateRoute>} />
      <Route path="/reports/stock" element={<PrivateRoute><AdminLayout><ReportsStock /></AdminLayout></PrivateRoute>} />
      <Route path="/reports/financial" element={<PrivateRoute><AdminLayout><ReportsFinancial /></AdminLayout></PrivateRoute>} />
      
      <Route path="/reports/repairs" element={<PrivateRoute><AdminLayout><RepairsReport /></AdminLayout></PrivateRoute>} />
      <Route path="/envios/remises" element={<PrivateRoute><AdminLayout><Remises /></AdminLayout></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute><AdminLayout><Notifications /></AdminLayout></PrivateRoute>} />
      <Route path="/docs" element={<PrivateRoute><AdminLayout><Docs /></AdminLayout></PrivateRoute>} />
      <Route path="/help" element={<PrivateRoute><AdminLayout><Help /></AdminLayout></PrivateRoute>} />
    </Routes>
  )
}
