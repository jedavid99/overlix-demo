# TODOs Encontrados en el Código

## Archivos con TODOs pendientes

### 1. features/sales/cash-register.tsx (Línea 42)
```typescript
// TODO: persist closing data
```
**Descripción**: Función para persistir datos de cierre de caja
**Prioridad**: Media
**Acción sugerida**: Implementar guardado de datos de cierre en backend

---

## Notas adicionales

### Código repetido identificado
- **OrderForm.tsx duplicado**: Existen versiones similares en:
  - `pages/providers/OrderForm.tsx`
  - `features/shipments/OrderForm.tsx`
  - Ambos tienen código casi idéntico para manejo de órdenes de compra

- **OrdersList.tsx duplicado**: Existen versiones similares en:
  - `pages/providers/OrdersList.tsx`
  - `features/shipments/OrdersList.tsx`
  - Ambos tienen código casi idéntico para listado de órdenes

- **Sales.tsx duplicado**: Existen versiones similares en:
  - `pages/iphone/Sales.tsx`
  - `features/sales/iphone/Sales.tsx`
  - Ambos manejan ventas de iPhone

### Recomendaciones de refactorización
1. Unificar OrderForm en un componente compartido
2. Unificar OrdersList en un componente compartido
3. Unificar Sales de iPhone en un componente compartido
4. Crear hooks personalizados para lógica compartida

### Imports no usados
Se detectaron múltiples archivos con imports que podrían no estar siendo utilizados. Se recomienda ejecutar un linter para identificarlos específicamente.
