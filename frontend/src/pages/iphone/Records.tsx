import React, { useState } from 'react';
import {
  ChevronRight,
  Smartphone,
  Search,
  Package,
  User,
  Mail,
  Shield,
  CreditCard,
  Wallet,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
export default function IPhoneRecords() {
  const [currentStep, setCurrentStep] = useState(1);
  const [insuranceEnabled, setInsuranceEnabled] = useState(true);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    model: 'iPhone 15 Pro Max',
    color: 'Titanium Black',
    imei: '',
    fullName: '',
    email: '',
    insurancePlan: 'Full Coverage (Theft + Damage)',
    premium: 14.99,
  });
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const devicePrice = 1199.00;
  const salesTax = devicePrice * 0.08;
  const insurancePremium = insuranceEnabled ? formData.premium : 0;
  const total = devicePrice + salesTax + insurancePremium;
  const progressPercentage = (currentStep / 4) * 100;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Registro de Ventas iPhone</h1>
          <p className="text-muted-foreground">
            Paso {currentStep} de 4: {currentStep === 1 ? 'Producto' : currentStep === 2 ? 'Cliente' : currentStep === 3 ? 'Seguro' : 'Pago'}
          </p>
        </div>
        <div className="flex gap-1 h-2 w-32 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      <div className="space-y-6">
        {/* Section 1: Product Selection */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center size-8 bg-primary/10 text-primary rounded-full font-bold text-sm">
                1
              </div>
              <h2 className="text-foreground text-xl font-bold">Selección de Producto</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-foreground">Modelo iPhone</span>
                <select
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12"
                >
                  <option>iPhone 15 Pro Max</option>
                  <option>iPhone 15 Pro</option>
                  <option>iPhone 15 Plus</option>
                  <option>iPhone 15</option>
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-foreground">Variante de Color</span>
                <select
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12"
                >
                  <option>Titanio Negro</option>
                  <option>Titanio Natural</option>
                  <option>Titanio Azul</option>
                  <option>Titanio Blanco</option>
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-foreground">Número IMEI</span>
                <input
                  type="text"
                  value={formData.imei}
                  onChange={(e) => handleInputChange('imei', e.target.value)}
                  placeholder="IMEI de 15 dígitos"
                  className="rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12"
                />
              </label>
            </div>
          </CardContent>
        </Card>
        {/* Section 2: Customer Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center size-8 bg-primary/10 text-primary rounded-full font-bold text-sm">
                2
              </div>
              <h2 className="text-foreground text-xl font-bold">Información del Cliente</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                  <User size={16} /> Nombre Completo
                </span>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Juan Pérez"
                  className="rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                  <Mail size={16} /> Correo Electrónico
                </span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="juan@ejemplo.com"
                  className="rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12"
                />
              </label>
            </div>
          </CardContent>
        </Card>
        {/* Section 3: Insurance Options */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-8 bg-primary/10 text-primary rounded-full font-bold text-sm">
                  3
                </div>
                <h2 className="text-foreground text-xl font-bold">Seguro iPhone</h2>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={insuranceEnabled}
                  onChange={(e) => setInsuranceEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                <span className="ml-3 text-sm font-medium text-foreground">Activar Cobertura</span>
              </label>
            </div>
            {insuranceEnabled && (
              <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-foreground flex items-center gap-1">
                      <Shield size={16} /> Plan de Seguro
                    </span>
                    <select
                      value={formData.insurancePlan}
                      onChange={(e) => handleInputChange('insurancePlan', e.target.value)}
                      className="rounded-lg border border-input bg-background text-foreground py-3 px-4 focus:outline-none focus:ring-2 focus:ring-ring/20 h-12"
                    >
                      <option>Cobertura Completa (Robo + Daño)</option>
                      <option>Pro (Daño Accidental)</option>
                      <option>Básico (Extendido de Fabricante)</option>
                    </select>
                  </label>
                  <div>
                    <span className="text-sm font-semibold text-foreground block mb-2">Ciclo de Facturación</span>
                    <div className="flex bg-background p-1 rounded-lg border border-input">
                      <Button
                        variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setBillingCycle('monthly')}
                        className="flex-1"
                      >
                        Mensual
                      </Button>
                      <Button
                        variant={billingCycle === 'annual' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setBillingCycle('annual')}
                        className="flex-1"
                      >
                        Anual
                      </Button>
                    </div>
                  </div>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-foreground">Prima del Seguro</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                      <input
                        type="text"
                        disabled
                        value={formData.premium.toFixed(2)}
                        className="rounded-lg border border-input bg-muted text-primary py-3 pl-8 pr-4 focus:outline-none w-full h-12 font-bold"
                      />
                    </div>
                  </label>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Section 4: Payment Details */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center size-8 bg-primary/10 text-primary rounded-full font-bold text-sm">
                4
              </div>
              <h2 className="text-foreground text-xl font-bold">Detalles de Pago</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className="w-full justify-start h-auto py-4"
                >
                  <CreditCard size={24} className="mr-3" />
                  <div className="flex-1 text-left">
                    <p className="font-bold">Tarjeta de Crédito / Débito</p>
                    <p className="text-xs text-muted-foreground">Pago seguro vía Stripe</p>
                  </div>
                  {paymentMethod === 'card' && <CheckCircle size={20} />}
                </Button>
                <Button
                  variant={paymentMethod === 'finance' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('finance')}
                  className="w-full justify-start h-auto py-4"
                >
                  <Wallet size={24} className="mr-3" />
                  <div className="flex-1 text-left">
                    <p className="font-bold">Plan de Financiamiento</p>
                    <p className="text-xs text-muted-foreground">Aprobación en 60 segundos</p>
                  </div>
                  {paymentMethod === 'finance' && <CheckCircle size={20} />}
                </Button>
              </div>
              <Card className="bg-muted/50">
                <CardContent className="p-6 flex flex-col gap-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">iPhone 15 Pro Max (256GB)</span>
                    <span className="font-medium text-foreground">${devicePrice.toFixed(2)}</span>
                  </div>
                  {insuranceEnabled && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                      <span>Prima de Seguro (Mensual)</span>
                      <span>${insurancePremium.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Impuesto Estimado (8%)</span>
                    <span className="font-medium text-foreground">${salesTax.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-border my-2"></div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-bold text-foreground">Total a Pagar Hoy</span>
                    <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between py-6 border-t border-border">
          <Button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            variant="outline"
          >
            Atrás
          </Button>
          <Button
            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
            disabled={currentStep === 4}
            size="lg"
          >
            <span>{currentStep === 4 ? 'Finalizar Venta y Activar Seguro' : 'Siguiente Paso'}</span>
            <ArrowRight size={20} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
