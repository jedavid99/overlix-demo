import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Download, FileText, Package, TrendingUp, DollarSign, Lock, Save } from 'lucide-react'
import { MdWarning, MdCheckCircle } from 'react-icons/md'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Badge } from '@/shared/components/ui/badge'
import { useCashClosingMutations, useCashClosingByDate } from '@/hooks/useCashClosing'
import { CashClosingData } from '@/types/cashClosing.types'
import { logger } from '@/utils/logger'
export default function CajaDiaria() {
  const navigate = useNavigate()
  const { createCashClosing, updateCashClosing } = useCashClosingMutations()
  const today = new Date().toISOString().split('T')[0]
  const { data: existingClosing } = useCashClosingByDate(today)
  
  const [cash, setCash] = useState({
    bills100: '',
    bills50: '',
    bills20: '',
    bills10: '',
    bills5: '',
    bills1: '',
    other: '',
    notes: '',
  })
  
  const [expectedBalance, setExpectedBalance] = useState(1695.50)
  const [transactions, setTransactions] = useState(42)
  
  // Load existing closing data if available
  useEffect(() => {
    if (existingClosing) {
      setCash({
        bills100: existingClosing.bills_count.bills100.toString(),
        bills50: existingClosing.bills_count.bills50.toString(),
        bills20: existingClosing.bills_count.bills20.toString(),
        bills10: existingClosing.bills_count.bills10.toString(),
        bills5: existingClosing.bills_count.bills5.toString(),
        bills1: existingClosing.bills_count.bills1.toString(),
        other: existingClosing.bills_count.other.toString(),
        notes: existingClosing.notes || '',
      })
      setExpectedBalance(existingClosing.expected_balance)
      setTransactions(existingClosing.transactions_count)
    }
  }, [existingClosing])
  const calculateActualTotal = () => {
    const b100 = (parseFloat(cash.bills100) || 0) * 100
    const b50 = (parseFloat(cash.bills50) || 0) * 50
    const b20 = (parseFloat(cash.bills20) || 0) * 20
    const b10 = (parseFloat(cash.bills10) || 0) * 10
    const b5 = (parseFloat(cash.bills5) || 0) * 5
    const b1 = (parseFloat(cash.bills1) || 0) * 1
    const other = parseFloat(cash.other) || 0
    return (b100 + b50 + b20 + b10 + b5 + b1 + other).toFixed(2)
  }
  const actualTotal = parseFloat(calculateActualTotal())
  const discrepancy = (actualTotal - expectedBalance).toFixed(2)
  const hasDiscrepancy = discrepancy !== '0.00'
  const handleChange = (field: string, value: string) => {
    setCash(prev => ({ ...prev, [field]: value }))
  }
  
  const handleSaveProgress = async () => {
    const closingData: CashClosingData = {
      date: today,
      store_id: '104',
      cashier: 'Alex Thompson',
      expected_balance: expectedBalance,
      actual_balance: actualTotal,
      discrepancy: parseFloat(discrepancy),
      transactions_count: transactions,
      bills_count: {
        bills100: parseFloat(cash.bills100) || 0,
        bills50: parseFloat(cash.bills50) || 0,
        bills20: parseFloat(cash.bills20) || 0,
        bills10: parseFloat(cash.bills10) || 0,
        bills5: parseFloat(cash.bills5) || 0,
        bills1: parseFloat(cash.bills1) || 0,
        other: parseFloat(cash.other) || 0,
      },
      notes: cash.notes,
    }
    
    logger.log('Guardando progreso de cierre de caja:', closingData)
    
    if (existingClosing?.id) {
      await updateCashClosing(existingClosing.id, closingData)
    } else {
      await createCashClosing(closingData)
    }
  }
  
  const handleFinalize = async () => {
    const closingData: CashClosingData = {
      date: today,
      store_id: '104',
      cashier: 'Alex Thompson',
      expected_balance: expectedBalance,
      actual_balance: actualTotal,
      discrepancy: parseFloat(discrepancy),
      transactions_count: transactions,
      bills_count: {
        bills100: parseFloat(cash.bills100) || 0,
        bills50: parseFloat(cash.bills50) || 0,
        bills20: parseFloat(cash.bills20) || 0,
        bills10: parseFloat(cash.bills10) || 0,
        bills5: parseFloat(cash.bills5) || 0,
        bills1: parseFloat(cash.bills1) || 0,
        other: parseFloat(cash.other) || 0,
      },
      notes: cash.notes,
    }
    
    logger.log('Finalizando cierre de caja:', closingData)
    
    const result = existingClosing?.id 
      ? await updateCashClosing(existingClosing.id, closingData)
      : await createCashClosing(closingData)
    
    if (result) {
      alert(`Cierre de caja finalizado. Diferencia: $${discrepancy}`)
      navigate('/reports')
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Cierre de Caja</h1>
          <p className="text-muted-foreground">Conciliación para 25 de marzo, 2024 • Tienda #104</p>
        </div>
        <Button variant="outline">
          <Download size={16} className="mr-2" />
          Exportar resumen
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                <CardTitle>Saldo esperado</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Efectivo inicial</span>
                <span className="font-semibold text-foreground">$</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Ventas en efectivo (+)</span>
                <span className="font-semibold text-foreground">$</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Ventas tarjeta (ref)</span>
                <span className="font-semibold text-muted-foreground">$</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Gastos (-)</span>
                <span className="font-semibold text-destructive">$</span>
              </div>
              <div className="flex justify-between items-center pt-6">
                <span className="text-lg font-bold text-foreground">Total esperado</span>
                <span className="text-2xl font-bold text-primary">$</span>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary rounded-lg text-primary-foreground">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-sm text-primary font-semibold uppercase tracking-wider">Transacciones</p>
                  <p className="text-2xl font-bold text-foreground"> reparaciones</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign size={20} className="text-primary" />
                  <CardTitle>Conteo físico</CardTitle>
                </div>
                <Badge variant="outline" size="sm">Cajón A-1</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Billetes</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-sm font-medium text-muted-foreground">$100</span>
                      <Input
                        type="number"
                        value={cash.bills100}
                        onChange={e => handleChange('bills100', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-sm font-medium text-muted-foreground">$50</span>
                      <Input
                        type="number"
                        value={cash.bills50}
                        onChange={e => handleChange('bills50', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-sm font-medium text-muted-foreground">$20</span>
                      <Input
                        type="number"
                        value={cash.bills20}
                        onChange={e => handleChange('bills20', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-sm font-medium text-muted-foreground">$10</span>
                      <Input
                        type="number"
                        value={cash.bills10}
                        onChange={e => handleChange('bills10', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Monedas y billetes pequeños</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-sm font-medium text-muted-foreground">$5</span>
                      <Input
                        type="number"
                        value={cash.bills5}
                        onChange={e => handleChange('bills5', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-sm font-medium text-muted-foreground">$1</span>
                      <Input
                        type="number"
                        value={cash.bills1}
                        onChange={e => handleChange('bills1', e.target.value)}
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-sm font-medium text-muted-foreground">Otros</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={cash.other}
                        onChange={e => handleChange('other', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="pt-4 mt-2 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-foreground">Total actual</span>
                        <span className="text-xl font-bold text-foreground">${actualTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2 pt-6 border-t border-border">
                <Label>Notas de cierre</Label>
                <textarea
                  value={cash.notes}
                  onChange={e => handleChange('notes', e.target.value)}
                  className="w-full rounded border border-input bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                  placeholder="¿Algún problema u observación durante el conteo?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Diferencia</span>
              <div className="flex items-center gap-2">
                {hasDiscrepancy ? (
                  <>
                    <MdWarning size={24} className="text-destructive" />
                    <span className="text-3xl font-bold text-destructive">$</span>
                  </>
                ) : (
                  <>
                    <MdCheckCircle size={24} className="text-success" />
                    <span className="text-3xl font-bold text-success">$</span>
                  </>
                )}
              </div>
            </div>
            <div className="h-12 w-px bg-border hidden md:block"></div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-semibold text-muted-foreground uppercase">Cajero</span>
              <span className="text-lg font-bold text-foreground">Alex Thompson</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Button onClick={handleSaveProgress} variant="outline" size="lg">
              <Save size={18} className="mr-2" />
              Guardar progreso
            </Button>
            <Button onClick={handleFinalize} size="lg">
              <Lock size={18} className="mr-2" />
              Finalizar y cerrar día
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
