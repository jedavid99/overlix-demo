# Loading Global - Guía de Uso

## Descripción
El contexto de loading global permite mostrar un spinner con mensaje personalizado en toda la aplicación durante operaciones asíncronas.

## Instalación
El contexto ya está configurado en `frontend/src/app/providers.tsx` con el componente `GlobalLoader`.

## Uso en Componentes

```typescript
import { useLoading } from '@/contexts/LoadingContext';

function MyComponent() {
  const { isLoading, setLoading, loadingMessage, setMessage } = useLoading();

  const handleAsyncOperation = async () => {
    setLoading(true);
    setMessage('Procesando...');
    
    try {
      await someAsyncOperation();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <p>{loadingMessage}</p>}
      <button onClick={handleAsyncOperation}>Iniciar</button>
    </div>
  );
}
```

## Uso en Hooks de Mutación
Ya está implementado en `useClientMutations`. Ejemplo:

```typescript
export const useClientMutations = () => {
  const { setLoading: setGlobalLoading, setMessage: setGlobalMessage } = useLoading();

  const createClient = async (data: ClientCreate) => {
    setGlobalLoading(true);
    setGlobalMessage('Creando cliente...');
    try {
      await clientService.create(data);
    } finally {
      setGlobalLoading(false);
    }
  };
};
```

## API

### useLoading()
Retorna un objeto con:
- `isLoading: boolean` - Estado del loading global
- `setLoading(loading: boolean)` - Activar/desactivar loading
- `loadingMessage: string` - Mensaje actual del loading
- `setMessage(message: string)` - Cambiar el mensaje del loading

## Componente GlobalLoader
El componente `GlobalLoader` se renderiza automáticamente cuando `isLoading` es true, mostrando:
- Overlay oscuro con backdrop blur
- Spinner animado
- Mensaje personalizado

## Notas
- Solo debe haber una instancia de loading activa a la vez
- Usar mensajes cortos y descriptivos (máximo 50 caracteres)
- El loading se cierra automáticamente cuando se llama a `setLoading(false)`
