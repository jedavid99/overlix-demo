# TechRepair Pro

Sistema de gestión para talleres de reparación técnica.

## Estructura del Proyecto

```
techrepair-pro/
├── frontend/          # Aplicación React + Vite + TypeScript
├── backend/           # API NestJS
├── .gitignore         # Archivos ignorados por Git
└── README.md          # Este archivo
```

## Características

- Gestión reparaciones
- Gestión clientes
- Gestión productos
- Gestión ventas
- Reportes y estadísticas
- Configuración del negocio
- Autenticación y autorización
- Generación de PDFs

## Tecnologías

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- React Hook Form
- Axios

### Backend
- NestJS
- TypeScript
- PostgreSQL
- JWT Authentication
- Swagger/OpenAPI

## Instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn
- PostgreSQL 14+

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### Backend

```bash
cd backend
npm install
npm run start:dev
```

El backend estará disponible en `http://localhost:3000`

## Variables de Entorno

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/techrepair
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d
```

## Scripts

### Frontend
- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run preview` - Previsualizar build de producción
- `npm run lint` - Ejecutar linter

### Backend
- `npm run start` - Iniciar aplicación en modo producción
- `npm run start:dev` - Iniciar en modo desarrollo con hot reload
- `npm run build` - Compilar para producción
- `npm run test` - Ejecutar tests
- `npm run lint` - Ejecutar linter

## API Documentation

La documentación de la API está disponible en:
- Swagger UI: `http://localhost:3000/api`
- OpenAPI JSON: `http://localhost:3000/api-json`

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Contacto

Para soporte o preguntas, por favor abre un issue en el repositorio.
