import React, { useState } from 'react';
import {
  Search,
  Smartphone,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Shield,
  Mail,
  Phone,
  MapPin,
  Plus,
  Minus,
  X,
  CheckCircle,
  ChevronRight,
  User,
  CreditCard,
} from 'lucide-react';
import { MdPhoneAndroid } from 'react-icons/md';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
interface CartItem {
  id: string;
  model: string;
  price: number;
  storage: string;
  color: string;
  quantity: number;
  insurance?: string;
}
interface IPhoneProduct {
  id: string;
  name: string;
  model: string;
  price: number;
  storage: string;
  color: string;
  stock: 'in' | 'low' | 'out';
  quantity?: number;
}
export default function IPhoneSales() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [insuranceSelection, setInsuranceSelection] = useState<Record<string, string>>({});
  // 📦 Catálogo de productos – vacío (cargar desde API)
  const iphones: IPhoneProduct[] = [];
  // 📦 Planes de seguro – vacío (cargar desde API o dejar vacío)
  const insurancePlans: { id: string; name: string; price: number; features?: string }[] = [];
  const addToCart = (phone: IPhoneProduct) => {
    if (phone.stock === 'out') return;
    
    const cartItem: CartItem = {
      id: `${phone.id}-${Date.now()}`,
      model: phone.name,
      price: phone.price,
      storage: phone.storage,
      color: phone.color,
      quantity: 1,
    };
    setCart([...cart, cartItem]);
  };
  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    ));
  };
  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const insuranceTotal = cart.reduce((sum, item) => {
    const plan = insurancePlans.find(p => p.id === insuranceSelection[item.id]);
    return sum + (plan ? plan.price * item.quantity : 0);
  }, 0);
  const total = subtotal + tax + insuranceTotal;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Ventas iPhone</h1>
          <p className="text-muted-foreground">Flujo de ventas completo con inventario en tiempo real</p>
        </div>
        <Badge variant={cart.length > 0 ? 'default' : 'outline'}>
          <ShoppingCart size={14} className="mr-1" />
          {cart.length} en carrito
        </Badge>
      </div>
      {/* KPI Cards (datos en 0) */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Inventario Total</p>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-2">0</p>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <TrendingUp size={16} className="text-muted-foreground" />
                <span>Sin datos</span>
              </div>
            </CardContent>
          </Card>
          <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ventas Hoy</p>
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-2">0</p>
              <p className="text-muted-foreground text-sm">{cart.length} en carrito</p>
            </CardContent>
          </Card>
          <Card variant="interactive" className="hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ventas Totales</p>
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-2">$0.00</p>
              <p className="text-muted-foreground text-sm">Sin registros</p>
            </CardContent>
          </Card>
        </div>
      )}
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4">
        {[1, 2, 3, 4].map(step => (
          <React.Fragment key={step}>
            <button
              onClick={() => currentStep <= step && setCurrentStep(step)}
              className={`w-10 h-10 rounded-full font-semibold flex items-center justify-center transition-all ${
                currentStep >= step
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {currentStep > step ? <CheckCircle size={20} /> : step}
            </button>
            {step < 4 && <ChevronRight size={20} className="text-muted-foreground" />}
          </React.Fragment>
        ))}
      </div>
      {/* Step 1: Product Catalog (vacío) */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar modelos de iPhone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          {iphones.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MdPhoneAndroid size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No hay productos disponibles</p>
                <p className="text-sm text-muted-foreground">Agrega productos desde el panel de administración</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Aquí irían los productos si hubiera */}
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              onClick={() => setCurrentStep(2)}
              disabled={cart.length === 0}
            >
              Continuar al carrito <ChevronRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      )}
      {/* Step 2: Shopping Cart */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Carrito de compras ({cart.length})</h2>
          {cart.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {cart.map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-foreground">{item.model}</h3>
                          <p className="text-sm text-muted-foreground">{item.storage} • {item.color}</p>
                        </div>
                        <Button variant="ghost" size="icon-sm" onClick={() => removeFromCart(item.id)}>
                          <X size={16} className="text-destructive" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <Button variant="outline" size="icon-sm" onClick={() => updateQuantity(item.id, -1)}>
                          <Minus size={16} />
                        </Button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <Button variant="outline" size="icon-sm" onClick={() => updateQuantity(item.id, 1)}>
                          <Plus size={16} />
                        </Button>
                      </div>
                      {/* Insurance - oculto si no hay planes */}
                      {insurancePlans.length > 0 && (
                        <div className="border-t border-border pt-4">
                          <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Shield size={16} /> Agregar seguro
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {insurancePlans.map(plan => (
                              <Button
                                key={plan.id}
                                variant={insuranceSelection[item.id] === plan.id ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setInsuranceSelection({ ...insuranceSelection, [item.id]: plan.id })}
                              >
                                {plan.name}
                                {plan.price > 0 && <span className="text-[10px]"> (+${plan.price})</span>}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                        <span className="font-bold text-foreground">Subtotal:</span>
                        <span className="text-lg font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="h-fit sticky top-20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-4">Resumen del pedido</h3>
                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Impuesto (8%)</span>
                      <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                    </div>
                    {insuranceTotal > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Seguro</span>
                        <span className="font-medium text-foreground">${insuranceTotal.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between mb-6">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                  <Button onClick={() => setCurrentStep(3)} className="w-full mb-3">
                    Continuar a información del cliente
                  </Button>
                  <Button onClick={() => setCurrentStep(1)} variant="outline" className="w-full">
                    Volver al catálogo
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Tu carrito está vacío</p>
                <Button onClick={() => setCurrentStep(1)} className="mt-4">
                  Continuar comprando
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      {/* Step 3: Customer Information */}
      {currentStep === 3 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Información del cliente</h2>
          <Card>
            <CardContent className="p-6 space-y-5">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <User size={16} /> Nombre completo
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                  placeholder="Nombre completo"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Mail size={16} /> Email
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                    placeholder="Correo electrónico"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Phone size={16} /> Teléfono
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                    placeholder="Número de teléfono"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <MapPin size={16} /> Dirección
                </label>
                <input
                  type="text"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                  placeholder="Dirección de entrega"
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-3 justify-end">
            <Button onClick={() => setCurrentStep(2)} variant="outline">
              Atrás
            </Button>
            <Button
              onClick={() => setCurrentStep(4)}
              disabled={!customerInfo.name || !customerInfo.email}
            >
              Continuar al pago <ChevronRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      )}
      {/* Step 4: Payment & Checkout */}
      {currentStep === 4 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Pago y confirmación</h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-4">Revisión del pedido</h3>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center pb-3 border-b border-border">
                      <div>
                        <p className="font-medium text-foreground">{item.model} x{item.quantity}</p>
                        <p className="text-sm text-muted-foreground">{item.storage} • {item.color}</p>
                      </div>
                      <p className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">Entregar a</h3>
                <p className="text-foreground">{customerInfo.name}</p>
                <p className="text-sm text-muted-foreground">{customerInfo.email}</p>
                <p className="text-sm text-muted-foreground">{customerInfo.phone}</p>
                <p className="text-sm text-muted-foreground">{customerInfo.address}</p>
              </div>
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard size={18} /> Método de pago
                </h3>
                <div className="space-y-2">
                  {[
                    { id: 'card', label: 'Tarjeta de crédito/débito', icon: CreditCard },
                    { id: 'cash', label: 'Efectivo contra entrega', icon: DollarSign },
                  ].map(method => (
                    <label
                      key={method.id}
                      className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-input hover:border-primary'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <method.icon size={18} className="mr-2" />
                      {method.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Impuesto</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                {insuranceTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Seguro</span>
                    <span className="font-medium">${insuranceTotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold text-primary pt-2 border-t border-border">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-3">
            <Button onClick={() => setCurrentStep(3)} variant="outline" className="flex-1">
              Atrás
            </Button>
            <Button
              onClick={() => {
                alert(`Venta completada! Total: $${total.toFixed(2)}`);
                setCart([]);
                setCustomerInfo({ name: '', email: '', phone: '', address: '' });
                setCurrentStep(1);
              }}
              className="flex-1"
            >
              <CheckCircle size={20} className="mr-2" /> Completar venta
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
