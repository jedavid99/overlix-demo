# Guía de Despliegue en Vercel

Esta guía te llevará paso a paso a través del proceso de configuración y despliegue de tu proyecto React + Vite en Vercel.

## 📋 Requisitos Previos

- Cuenta en GitHub, GitLab o Bitbucket
- Cuenta en Vercel (gratuita en https://vercel.com)
- Git instalado en tu máquina
- PowerShell (Windows) o terminal compatible

## 🚀 Paso 1: Ejecutar el Script de Configuración

El script `setup-git.ps1` configurará automáticamente:
- Repositorio Git inicializado
- Ramas `main` (producción) y `develop` (desarrollo)
- Protección de archivos de entorno en `.gitignore`
- Archivo `.env.example` con variables de ejemplo

### Ejecución del Script

Abre PowerShell en el directorio del proyecto y ejecuta:

```powershell
.\setup-git.ps1
```

Si PowerShell bloquea la ejecución de scripts, ejecuta primero:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 📤 Paso 2: Subir el Código a GitHub/GitLab/Bitbucket

### Opción A: GitHub

1. Ve a https://github.com/new
2. Crea un nuevo repositorio vacío (NO inicialices con README, .gitignore o license)
3. Copia la URL del repositorio
4. En PowerShell, ejecuta:

```powershell
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git push -u origin main
git push -u origin develop
```

### Opción B: GitLab

1. Ve a https://gitlab.com/projects/new
2. Crea un nuevo proyecto vacío
3. Copia la URL del repositorio
4. En PowerShell, ejecuta:

```powershell
git remote add origin https://gitlab.com/tu-usuario/tu-repositorio.git
git push -u origin main
git push -u origin develop
```

### Opción C: Bitbucket

1. Ve a https://bitbucket.org/repo/create
2. Crea un nuevo repositorio vacío
3. Copia la URL del repositorio
4. En PowerShell, ejecuta:

```powershell
git remote add origin https://bitbucket.org/tu-usuario/tu-repositorio.git
git push -u origin main
git push -u origin develop
```

## 🌐 Paso 3: Importar en Vercel

### 3.1 Conectar Repositorio

1. Ve a https://vercel.com/new
2. Inicia sesión con tu cuenta de GitHub, GitLab o Bitbucket
3. Vercel te pedirá permiso para acceder a tus repositorios
4. Selecciona el repositorio que acabas de crear

### 3.2 Configurar el Proyecto

Vercel detectará automáticamente que es un proyecto Vite. Verifica la configuración:

| Configuración | Valor |
|--------------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `./` (o la carpeta de tu proyecto) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### 3.3 Desplegar

Haz clic en **"Deploy"**. Vercel construirá y desplegará tu proyecto automáticamente.

## 🔐 Paso 4: Configurar Variables de Entorno en Vercel

### 4.1 Acceder a Configuración de Variables

1. En el proyecto de Vercel, ve a **Settings** → **Environment Variables**
2. Haz clic en **"Add New"**

### 4.2 Añadir Variables

Añade las siguientes variables según el entorno:

#### Variables de Producción (rama `main`)

| Variable | Valor | Entorno |
|----------|-------|---------|
| `VITE_API_URL` | `https://tu-api-produccion.com/api` | Production |
| `VITE_APP_TITLE` | `Mi App (PROD)` | Production |

#### Variables de Preview (rama `develop` y PRs)

| Variable | Valor | Entorno |
|----------|-------|---------|
| `VITE_API_URL` | `https://tu-api-staging.com/api` | Preview, Development |
| `VITE_APP_TITLE` | `Mi App (DEV)` | Preview, Development |

### 4.3 Seleccionar Entornos

Para cada variable:
- Marca **Production** para la rama `main`
- Marca **Preview** para la rama `develop` y Pull Requests
- Marca **Development** (opcional) para entornos de desarrollo

### 4.4 Importante

- Las variables de entorno en Vercel deben comenzar con `VITE_` para que Vite las exponga al frontend
- Los archivos `.env.local` NO se suben a Git (están protegidos en `.gitignore`)
- Usa `.env.example` como plantilla para desarrollo local

## 🔄 Paso 5: Flujo de Trabajo Recomendado

### Desarrollo Diario (rama `develop`)

```powershell
# Cambiar a rama develop
git checkout develop

# Hacer cambios
# ... editar archivos ...

# Commit y push
git add .
git commit -m "feat: nueva funcionalidad"
git push origin develop
```

**Resultado:** Vercel creará automáticamente un **Preview Deployment** para cada push a `develop`.

### Despliegue a Producción (rama `main`)

```powershell
# Cambiar a rama main
git checkout main

# Fusionar cambios de develop
git merge develop

# Push a main
git push origin main
```

**Resultado:** Vercel desplegará automáticamente a **producción** desde `main`.

### Pull Requests (Opcional)

Si prefieres usar Pull Requests:

1. Crea una rama desde `develop`:
   ```powershell
   git checkout develop
   git checkout -b feature/nueva-funcionalidad
   ```

2. Haz tus cambios y push:
   ```powershell
   git add .
   git commit -m "feat: nueva funcionalidad"
   git push origin feature/nueva-funcionalidad
   ```

3. Crea un Pull Request en GitHub/GitLab/Bitbucket
4. Vercel creará un **Preview Deployment** para el PR
5. Al hacer merge a `develop`, se actualizará el preview de develop
6. Al hacer merge a `main`, se desplegará a producción

## 📝 Paso 6: Configuración Local

### Copiar Archivo de Entorno

```powershell
Copy-Item .env.example .env.local
```

### Editar Variables Locales

Edita `.env.local` con tus valores de desarrollo:

```env
VITE_API_URL=http://localhost:4000/api
VITE_APP_TITLE=Mi App (DEV)
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
```

### Ejecutar Localmente

```powershell
npm install
npm run dev
```

## ⚠️ Notas Importantes

### Seguridad

- **NUNCA** subas archivos `.env.local`, `.env.production.local` o similares a Git
- Las variables sensibles (API keys, tokens) deben configurarse en Vercel, no en código
- Usa `.env.example` como plantilla para que otros desarrolladores sepan qué variables necesitan

### Branch Protection (Recomendado)

En GitHub/GitLab/Bitbucket, configura protecciones de rama:

- **Rama `main`:** Requiere aprobación antes de merge
- **Rama `develop`:** Permite commits directos o requiere PR según tu flujo

### Preview Deployments

- Vercel crea automáticamente URLs de preview para cada push a `develop` o PRs
- Las URLs de preview tienen el formato: `https://tu-proyecto-git-branch.vercel.app`
- Los previews se eliminan automáticamente después de 30 días (configurable)

### Dominios Personalizados

1. En Vercel, ve a **Settings** → **Domains**
2. Añade tu dominio personalizado
3. Configura los DNS según las instrucciones de Vercel
4. Vercel proporcionará certificados SSL automáticamente

## 🐛 Solución de Problemas

### Error: Build Failed

1. Verifica que el `build command` sea `npm run build`
2. Verifica que el `output directory` sea `dist`
3. Revisa los logs de build en Vercel
4. Verifica que todas las dependencias estén en `package.json`

### Variables de Entorno No Funcionan

1. Verifica que las variables comiencen con `VITE_`
2. Verifica que hayas seleccionado el entorno correcto (Production/Preview)
3. Revisa que estés usando `import.meta.env.VITE_NOMBRE_VARIABLE` en el código
4. Haz un nuevo deploy después de cambiar variables

### Error: Module Not Found

1. Verifica que `package.json` esté en el root del proyecto
2. Verifica que el `install command` sea `npm install`
3. Revisa que todas las dependencias estén correctamente listadas

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Vite](https://vitejs.dev/)
- [Variables de Entorno en Vite](https://vitejs.dev/guide/env-and-mode.html)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)

## ✅ Checklist de Despliegue

- [ ] Ejecutar script `setup-git.ps1`
- [ ] Crear repositorio en GitHub/GitLab/Bitbucket
- [ ] Push ramas `main` y `develop`
- [ ] Importar proyecto en Vercel
- [ ] Configurar build settings en Vercel
- [ ] Añadir variables de entorno en Vercel
- [ ] Configurar `.env.local` para desarrollo local
- [ ] Desplegar a producción (push a `main`)
- [ ] Verificar preview deployment (push a `develop`)
- [ ] Configurar dominio personalizado (opcional)

---

**¡Listo para desplegar! 🎉**
