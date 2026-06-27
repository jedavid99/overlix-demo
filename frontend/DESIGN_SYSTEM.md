# 🎨 Sistema de Diseño — Overlix

> **Versión:** 2.0  
> **Proyecto:** Sistema de gestión para servicio técnico multimarca (celulares, PC, notebooks, consolas, tablets)  
> **Región:** Argentina  
> **Idioma:** Español argentino  
> **Moneda:** $ARS (pesos argentinos)  
> **Inspiración premium:** Linear, Vercel Dashboard, Stripe  
> **Stack técnico:** React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui + React Hook Form + Zod + TanStack Table + Framer Motion + Recharts + date-fns  

---

## 1. 🧠 Principios de diseño
1. **Premium y minimalista** – Menos es más. Espacios generosos, jerarquía clara. **Nunca genérico**: evitar fondos blancos planos sin tratamiento, tablas HTML básicas sin estilo, o sombras de `box-shadow` por defecto del navegador.
2. **Funcionalidad primero** – Cada elemento debe tener un propósito. Las animaciones deben guiar al usuario, no distraer.
3. **Profundidad sutil** – Usar capas (z-index, sombras, glassmorphism) con moderación para crear jerarquía visual sin sobrecargar.
4. **Coherencia absoluta** – Cualquier pantalla debe parecer parte del mismo ecosistema. Mismos tokens, mismos componentes, mismo tono de voz.
5. **Accesibilidad** – Contraste mínimo AA (4.5:1 para texto normal), navegación por teclado, foco visible (`ring-2`).
6. **Regionalización** – Textos en español argentino, fechas en formato `DD/MM/AAAA`, moneda en `$ARS` con separador de miles `.` y decimales `,`.
7. **Único, no genérico** – Toques distintivos: patrón geométrico sutil en fondos de tarjetas métricas, gradientes suaves en áreas clave, glowing dot en el ítem activo del menú.

---

## 2. 🎨 Paleta de colores

### Modo claro
| Token | Valor Tailwind | Uso |
|-------|----------------|-----|
| `background` | `#FAFAFA` | Fondo principal de la app |
| `card` | `#FFFFFF` | Tarjetas, diálogos, superficies elevadas |
| `border` | `#E4E4E7` | Bordes suaves |
| `input` | `#E4E4E7` | Borde de campos de entrada |
| `muted` | `#F4F4F5` | Fondos secundarios, skeletons |
| `foreground` | `#18181B` | Texto principal |
| `muted-foreground` | `#71717A` | Texto secundario, placeholders, iconos no activos |

### Modo oscuro
| Token | Valor Tailwind | Uso |
|-------|----------------|-----|
| `background` | `#0A0A0A` | Fondo principal |
| `card` | `#1A1A1A` | Tarjetas, diálogos |
| `border` | `#2A2A2A` | Bordes |
| `input` | `#2A2A2A` | Borde de inputs |
| `muted` | `#1A1A1A` | Fondos secundarios |
| `foreground` | `#FAFAFA` | Texto principal |
| `muted-foreground` | `#A1A1AA` | Texto secundario |

### Primarios
| Token | Valor Tailwind | Uso |
|-------|----------------|-----|
| `primary` | `#0066FF` | Acciones principales, enlaces, activos, foco |
| `primary-hover` | `#0052CC` | Hover sobre primary |
| `primary-active` | `#003D99` | Presionado |
| `primary-foreground` | `#FFFFFF` | Texto sobre fondo primary |
| `ring` | `rgba(0,102,255,0.5)` | Anillo de foco |

### Semánticos
| Token | Valor Tailwind | Uso |
|-------|----------------|-----|
| `success` | `#16A34A` | Éxito, stock disponible, pagado |
| `warning` | `#F59E0B` | Pendiente, bajo stock |
| `destructive` | `#EF4444` | Error, agotado, eliminación |
| `info` | `#3B82F6` | Información, ayuda |

---

## 3. 🔤 Tipografía
- **Familia:** `Inter` (sans-serif). Cargar desde Google Fonts (pesos 400, 500, 600, 700).
- **Clase base:** `font-sans antialiased` en `<body>`.
- **Escala:**
  - `text-xs` (12px) – badges, etiquetas pequeñas, overline.
  - `text-sm` (14px) – textos secundarios, descripciones, inputs pequeños.
  - `text-base` (16px) – cuerpo de texto, inputs estándar.
  - `text-lg` (18px) – subtítulos.
  - `text-xl` (20px) – títulos de sección.
  - `text-2xl` (24px) – títulos de página.
  - `text-3xl` (30px) – números grandes en KPIs.
  - `text-4xl` (36px) – datos muy destacados.
- **Pesos semánticos:**
  - Títulos: `font-semibold` o `font-bold`.
  - Overline / badges: `font-semibold uppercase tracking-wider`.
  - Cuerpo: `font-normal` o `font-medium`.

---

## 4. 📏 Espaciado y grilla
- **Base:** múltiplos de 4px (`0.5rem = 8px`, `1rem = 16px`, etc.).
- **Padding estándar de tarjetas:** `p-6` (24px).
- **Padding de página:** `p-4 sm:p-6 lg:p-8`.
- **Gaps:** `gap-4` (16px) entre elementos relacionados, `gap-6` (24px) entre secciones.

---

## 5. 🌗 Sombras (Elevación)
- **Solo para tarjetas y modales.** Evitar sombras en botones (usar color de borde/fondo).
- `shadow-sm` – Elevación sutil para tarjetas en reposo.
- `shadow` – Tarjetas interactivas en hover (`hover:shadow-md`).
- `shadow-lg` – Modales y dropdowns.
- `shadow-xl` – Solo para elementos muy elevados (ej. command palette).

---

## 6. 🔘 Bordes redondeados
- `rounded-sm` (6px) – badges pequeños.
- `rounded-md` (8px) – botones, inputs.
- `rounded-lg` (12px) – tarjetas.
- `rounded-xl` (16px) – modales.
- `rounded-full` – badges píldora, avatares.

---

## 7. 🧩 Componentes UI (shadcn/ui + Stack)

### Button
- `active:scale-[0.97]` para feedback táctil.
- `transition-all duration-150`.
- Tamaños: `sm` (h-8), `default` (h-10), `lg` (h-12), `icon` (h-10 w-10).
- Variante `link` sin subrayado por defecto, solo en hover.

### Input / Select / Textarea (con React Hook Form)
- Estilo base: `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150`.
- Errores de validación: borde `border-destructive` y mensaje debajo con `text-destructive text-sm flex items-center gap-1.5 mt-1.5`.

### Badge
- Siempre `rounded-full`.
- Variante `success` (verde semitransparente), `warning` (naranja semitransparente), `destructive` (rojo semitransparente), `outline` (borde y texto).
- Sin íconos internos a menos que sea necesario (ej. un Badge de estado con un punto indicador).

### Card
- `rounded-lg border bg-card text-card-foreground shadow-sm`.
- Variante `interactive`: `hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`.
- **Toque único:** Las tarjetas de KPI pueden tener un sutil patrón geométrico en el fondo (opacidad 5%) o un gradiente radial muy leve.

### Modal (Dialog)
- Overlay: `bg-black/40 backdrop-blur-sm`.
- Contenido: `bg-card rounded-xl shadow-lg p-6`.
- Animación de entrada/salida con Framer Motion: `scale` (0.95 → 1) + `opacity` (0 → 1), duración 200ms.
- Botón de cierre con `MdClose` arriba a la derecha.

### DropdownMenu
- Contenido: `min-w-[8rem] rounded-md border bg-card p-1 shadow-md`.
- Animación: `fade-in-up` (200ms) con Framer Motion.
- Item: `rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors`.

### Toast
- Posición: `fixed bottom-4 right-4 z-50 flex flex-col gap-2`.
- Diseño: tarjeta con borde izquierdo de 4px del color semántico, icono, título, descripción y botón cerrar.
- Animación: desliza desde la derecha con Framer Motion.

### DataTable (con TanStack Table)
- Cabecera: `sticky top-0 z-10 bg-card/80 backdrop-blur-sm border-b`.
- Filas: `border-b hover:bg-muted/50 transition-colors`.
- Paginación: `flex items-center justify-between px-2 py-4`. Botones `outline` tamaño `sm`.
- Celdas de acciones: `text-right` con botones `ghost` tamaño `icon-sm`.

### Chart / Gráfico (con Recharts)
- Colores: usar tokens semánticos (`success`, `primary`, `warning`).
- Tooltip: `bg-card border shadow-lg rounded-lg p-3 text-sm` (personalizado con `content` de Recharts).
- Sin grid lines excesivas, solo las necesarias.

---

## 8. 🧭 Iconografía
- **Librería exclusiva:** `react-icons/md` (Material Design).
- **Prohibido:** emojis en la interfaz.
- **Tamaños:**
  - `h-4 w-4` (16px) – dentro de botones, inputs, badges.
  - `h-5 w-5` (20px) – iconos de menú, tarjetas.
  - `h-12 w-12` – iconos de estado vacío (con opacidad 0.5).
- **Estados vacíos:** icono grande + texto `text-muted-foreground` + botón de acción.

---

## 9. 🌐 Regionalización (Argentina)

### Moneda
- Formato: `$ 1.500,00`.
- Función JS: `new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })`.

### Fechas
- Formato: `DD/MM/AAAA` (ej. 24/12/2024).
- Librería: `date-fns` con locale `es-AR` (`format(date, 'dd/MM/yyyy')`).

### Idioma
- Todos los textos visibles en español argentino.
- Glosario: "Celular", "Cargador", "Pantalla", "Reparación", "Presupuesto", "Orden", "Cliente", "Stock", "Caja diaria", "Factura", "Seña".

---

## 10. 📐 Layout principal
- **Sidebar:** 240px (expandido) / 60px (colapsado, solo iconos). Fondo `bg-card`, borde derecho `border-r`.
  - Ítem activo: `bg-primary/10 text-primary font-medium` + indicador (barra lateral `bg-primary` o glowing dot).
- **Topbar:** 56px, `sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b`.
- **Área de contenido:** `flex-1 overflow-auto bg-background p-6 lg:p-8`.
- **Responsive:** En móvil, el sidebar es un drawer con overlay que se abre con Framer Motion.

---

## 11. 🧪 Estados de UI obligatorios
1. **Carga:** Componente `Skeleton` con shimmer. Botones con `disabled` y texto "Guardando..." + `MdRefresh` animado.
2. **Vacío:** Contenedor flex-col centrado. Ícono `h-12 w-12 text-muted-foreground/50`. Texto descriptivo. Botón de acción primario.
3. **Error:** Similar al vacío pero con icono `MdErrorOutline`. Mensaje "Ocurrió un error al cargar los datos." y botón "Reintentar".
4. **Éxito (toast):** Aparece toast verde con check y mensaje.

## 12. ✨ Animaciones
- **Duración estándar:** 150-200ms.
- **Transiciones CSS:** para hover, foco, cambios de estado (`transition-all`).
- **Framer Motion:** para montaje/desmontaje (modales, drawer, toast, páginas).
  - `initial={{ opacity: 0, y: 10 }}` `animate={{ opacity: 1, y: 0 }}` (fade-in-up).
  - `exit={{ opacity: 0, scale: 0.95 }}` para modales.