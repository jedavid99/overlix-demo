# Script de PowerShell para inicializar Git y configurar ramas
# Autor: DevOps Setup
# Descripción: Configura Git, ramas main/develop y protege archivos de entorno

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configuración de Git para Vercel Deploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si estamos en un directorio de Git
$gitDir = git rev-parse --git-dir 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "⚠️  Este directorio ya es un repositorio Git." -ForegroundColor Yellow
    $response = Read-Host "¿Deseas continuar con la configuración? (y/n)"
    if ($response -ne 'y' -and $response -ne 'Y') {
        Write-Host "❌ Operación cancelada." -ForegroundColor Red
        exit 0
    }
} else {
    # Inicializar repositorio Git
    Write-Host "📦 Inicializando repositorio Git..." -ForegroundColor Green
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al inicializar Git." -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Repositorio Git inicializado." -ForegroundColor Green
}

# Configurar nombre de usuario y email si no están configurados
$gitUser = git config --get user.name
if ([string]::IsNullOrEmpty($gitUser)) {
    Write-Host "⚠️  No tienes configurado tu nombre de usuario Git." -ForegroundColor Yellow
    $userName = Read-Host "Ingresa tu nombre de usuario Git"
    git config user.name $userName
}

$gitEmail = git config --get user.email
if ([string]::IsNullOrEmpty($gitEmail)) {
    Write-Host "⚠️  No tienes configurado tu email Git." -ForegroundColor Yellow
    $userEmail = Read-Host "Ingresa tu email Git"
    git config user.email $userEmail
}

# Actualizar .gitignore para proteger archivos de entorno
Write-Host ""
Write-Host "🔒 Actualizando .gitignore para proteger archivos de entorno..." -ForegroundColor Green

$gitignorePath = ".gitignore"
$gitignoreContent = @"
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
Thumbs.db
"@

# Verificar si .gitignore existe
if (Test-Path $gitignorePath) {
    $existingContent = Get-Content $gitignorePath -Raw
    # Verificar si ya contiene las líneas de env
    if ($existingContent -notmatch "\.env\.local") {
        Add-Content -Path $gitignorePath -Value "`n# Local env files" -Force
        Add-Content -Path $gitignorePath -Value ".env" -Force
        Add-Content -Path $gitignorePath -Value ".env.local" -Force
        Add-Content -Path $gitignorePath -Value ".env.development.local" -Force
        Add-Content -Path $gitignorePath -Value ".env.test.local" -Force
        Add-Content -Path $gitignorePath -Value ".env.production.local" -Force
        Write-Host "✅ .gitignore actualizado con protecciones de archivos de entorno." -ForegroundColor Green
    } else {
        Write-Host "✅ .gitignore ya contiene protecciones de archivos de entorno." -ForegroundColor Green
    }
} else {
    Set-Content -Path $gitignorePath -Value $gitignoreContent -Force
    Write-Host "✅ .gitignore creado con protecciones de archivos de entorno." -ForegroundColor Green
}

# Crear archivo .env.example
Write-Host ""
Write-Host "📄 Creando archivo .env.example..." -ForegroundColor Green

$envExamplePath = ".env.example"
$envExampleContent = @"
# Variables de Entorno de Ejemplo
# Copia este archivo a .env.local y completa los valores reales

# API Configuration
VITE_API_URL=http://localhost:4000/api

# App Configuration
VITE_APP_TITLE=Mi App (DEV)

# Feature Flags (opcional)
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true
"@

Set-Content -Path $envExamplePath -Value $envExampleContent -Force
Write-Host "✅ Archivo .env.example creado." -ForegroundColor Green

# Crear rama main
Write-Host ""
Write-Host "🌳 Configurando ramas de Git..." -ForegroundColor Green

# Verificar si existe la rama main
$mainBranchExists = git show-ref --verify --quiet refs/heads/main 2>$null
if ($LASTEXITCODE -ne 0) {
    # Verificar si existe master (nombre antiguo)
    $masterBranchExists = git show-ref --verify --quiet refs/heads/master 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "🔄 Renombrando rama 'master' a 'main'..." -ForegroundColor Yellow
        git branch -m master main
    } else {
        # Crear rama main desde el estado actual
        git checkout -b main
    }
    Write-Host "✅ Rama 'main' creada/renombrada (producción)." -ForegroundColor Green
} else {
    Write-Host "✅ Rama 'main' ya existe." -ForegroundColor Green
}

# Crear rama develop
$developBranchExists = git show-ref --verify --quiet refs/heads/develop 2>$null
if ($LASTEXITCODE -ne 0) {
    git checkout -b develop
    Write-Host "✅ Rama 'develop' creada (desarrollo)." -ForegroundColor Green
} else {
    Write-Host "✅ Rama 'develop' ya existe." -ForegroundColor Green
}

# Volver a main para configurarla como por defecto
git checkout main

# Configurar main como rama por defecto
git config init.defaultBranch main

# Añadir archivos al staging
Write-Host ""
Write-Host "📝 Añadiendo archivos al staging..." -ForegroundColor Green
git add .
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Archivos añadidos al staging." -ForegroundColor Green
} else {
    Write-Host "❌ Error al añadir archivos al staging." -ForegroundColor Red
}

# Hacer commit inicial
Write-Host ""
$commitMessage = "feat: initial commit - modular frontend architecture"
Write-Host "💾 Creando commit inicial: '$commitMessage'" -ForegroundColor Green
git commit -m $commitMessage
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Commit inicial creado." -ForegroundColor Green
} else {
    Write-Host "⚠️  No se pudo crear el commit (posiblemente no hay cambios)." -ForegroundColor Yellow
}

# Mostrar resumen y siguientes pasos
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Configuración Completada" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Resumen:" -ForegroundColor Green
Write-Host "  • Repositorio Git inicializado" -ForegroundColor White
Write-Host "  • Ramas creadas: main (producción), develop (desarrollo)" -ForegroundColor White
Write-Host "  • .gitignore actualizado con protecciones de entorno" -ForegroundColor White
Write-Host "  • .env.example creado con variables de ejemplo" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Siguientes Pasos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. SUBIR EL CÓDIGO A GITHUB/GITLAB/BITBUCKET:" -ForegroundColor Cyan
Write-Host "   a) Crea un nuevo repositorio vacío en tu plataforma favorita" -ForegroundColor White
Write-Host "   b) Ejecuta:" -ForegroundColor White
Write-Host "      git remote add origin <URL_DEL_REPOSITORIO>" -ForegroundColor Gray
Write-Host "      git push -u origin main" -ForegroundColor Gray
Write-Host "      git push -u origin develop" -ForegroundColor Gray
Write-Host ""
Write-Host "2. IMPORTAR EN VERCEL:" -ForegroundColor Cyan
Write-Host "   a) Ve a https://vercel.com/new" -ForegroundColor White
Write-Host "   b) Importa tu repositorio desde GitHub/GitLab/Bitbucket" -ForegroundColor White
Write-Host "   c) Vercel detectará automáticamente que es un proyecto Vite" -ForegroundColor White
Write-Host "   d) Configura:" -ForegroundColor White
Write-Host "      - Framework Preset: Vite" -ForegroundColor Gray
Write-Host "      - Root Directory: ./ (o la carpeta de tu proyecto)" -ForegroundColor Gray
Write-Host "      - Build Command: npm run build" -ForegroundColor Gray
Write-Host "      - Output Directory: dist" -ForegroundColor Gray
Write-Host "      - Install Command: npm install" -ForegroundColor Gray
Write-Host ""
Write-Host "3. CONFIGURAR VARIABLES DE ENTORNO EN VERCEL:" -ForegroundColor Cyan
Write-Host "   a) En el proyecto de Vercel, ve a Settings → Environment Variables" -ForegroundColor White
Write-Host "   b) Añade las siguientes variables:" -ForegroundColor White
Write-Host "      • VITE_API_URL=https://tu-api-produccion.com/api" -ForegroundColor Gray
Write-Host "      • VITE_APP_TITLE=Mi App (PROD)" -ForegroundColor Gray
Write-Host "   c) Selecciona los entornos:" -ForegroundColor White
Write-Host "      - Production (para main)" -ForegroundColor Gray
Write-Host "      - Preview (para develop y PRs)" -ForegroundColor Gray
Write-Host "      - Development (opcional)" -ForegroundColor Gray
Write-Host ""
Write-Host "4. FLUJO DE TRABAJO RECOMENDADO:" -ForegroundColor Cyan
Write-Host "   • Trabaja en la rama 'develop' (desarrollo diario)" -ForegroundColor White
Write-Host "   • Haz commits y push a develop:" -ForegroundColor White
Write-Host "      git checkout develop" -ForegroundColor Gray
Write-Host "      git add ." -ForegroundColor Gray
Write-Host "      git commit -m 'tu mensaje'" -ForegroundColor Gray
Write-Host "      git push origin develop" -ForegroundColor Gray
Write-Host "   • Vercel creará automáticamente un Preview Deployment para cada push a develop" -ForegroundColor White
Write-Host "   • Cuando esté listo para producción:" -ForegroundColor White
Write-Host "      git checkout main" -ForegroundColor Gray
Write-Host "      git merge develop" -ForegroundColor Gray
Write-Host "      git push origin main" -ForegroundColor Gray
Write-Host "   • Vercel desplegará automáticamente a producción desde main" -ForegroundColor White
Write-Host ""
Write-Host "5. IMPORTANTE - ARCHIVOS LOCALES:" -ForegroundColor Cyan
Write-Host "   • NO subas .env.local a Git (está protegido en .gitignore)" -ForegroundColor White
Write-Host "   • Copia .env.example a .env.local para desarrollo local:" -ForegroundColor White
Write-Host "      Copy-Item .env.example .env.local" -ForegroundColor Gray
Write-Host "   • Edita .env.local con tus valores locales" -ForegroundColor White
Write-Host "   • Las variables de producción se configuran en Vercel, no en código" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ¡Listo para desplegar! 🎉" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
