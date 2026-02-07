# Tech Stack - Cristian Marzetti Peluquería

> Documentación completa del stack tecnológico y arquitectura del proyecto para contexto de IA

## 📋 Información General del Proyecto

- **Nombre**: Peluquería Marzetti
- **Tipo**: Single Page Application (SPA) - Sitio web corporativo
- **Versión**: 0.0.0
- **Propietario**: MatyAlts
- **Repositorio**: cristian-marzetti-peluqueria
- **Branch Principal**: main

## 🏗️ Arquitectura

### Tipo de Aplicación
- **SPA (Single Page Application)** con React
- **Arquitectura basada en componentes**
- **Client-side routing** con React Router
- **Hash-based routing** (`HashRouter`) para compatibilidad con hosting estático

### Estructura de Carpetas
```
/
├── components/          # Componentes reutilizables de UI
│   ├── Button.tsx
│   ├── FloatingWhatsApp.tsx
│   ├── Footer.tsx
│   ├── Navbar.tsx
│   └── PageLoader.tsx
├── pages/              # Componentes de página/rutas
│   ├── About.tsx       # /nosotros
│   ├── Academy.tsx     # /academia
│   ├── Booking.tsx     # /turnos
│   ├── Contact.tsx     # /contacto
│   ├── Home.tsx        # /
│   └── Products.tsx    # /productos
├── public/
│   └── images/         # Assets de imágenes
│       ├── academia/
│       ├── equipo/
│       ├── hero/
│       ├── nosotros/
│       └── productos/
├── App.tsx             # Componente raíz con routing
├── index.tsx           # Entry point
├── constants.ts        # Datos estáticos y configuración
├── types.ts            # Definiciones de TypeScript
└── vite.config.ts      # Configuración del bundler
```

## 🛠️ Stack Tecnológico Principal

### Frontend Framework
- **React 19.2.3** - Biblioteca principal de UI
  - Uso de hooks modernos (useState, useEffect, useLocation)
  - Componentes funcionales
  - TypeScript para type safety

### Lenguaje
- **TypeScript 5.8.2**
  - Target: ES2022
  - JSX: react-jsx
  - Module: ESNext
  - Configuración: bundler module resolution
  - Path aliases: `@/*` apunta a la raíz

### Build Tool & Dev Server
- **Vite 6.2.0** - Bundler y servidor de desarrollo
  - Puerto: 3000
  - Host: 0.0.0.0 (accesible desde red local)
  - HMR (Hot Module Replacement) habilitado
  - Plugin React oficial (@vitejs/plugin-react 5.0.0)

### Routing
- **React Router DOM 7.12.0**
  - HashRouter para compatibilidad con hosting estático
  - Rutas definidas:
    - `/` - Home
    - `/nosotros` - About
    - `/productos` - Products
    - `/academia` - Academy
    - `/turnos` - Booking
    - `/contacto` - Contact

### Animaciones
- **Framer Motion 12.26.1**
  - AnimatePresence para transiciones entre páginas
  - motion.div para animaciones declarativas
  - Transiciones con duración de 0.2-0.3s
  - Page loader animado
  - Optimizado para iOS con hardware acceleration

### Iconos
- **Lucide React 0.562.0**
  - Biblioteca de iconos SVG moderna
  - Iconos usados: Scissors, Palette, Sparkles, Heart, Home

### Estilos
- **CSS-in-JS / Tailwind-like utilities**
  - Inline styles con React
  - Flexbox para layouts
  - Optimizaciones específicas para iOS:
    - `-webkit-overflow-scrolling: touch`
    - `-webkit-tap-highlight-color: transparent`
    - `transform: translateZ(0)` para GPU acceleration
    - `will-change: transform`

## 📦 Dependencias Completas

### Producción
```json
{
  "react": "^19.2.3",
  "react-dom": "^19.2.3",
  "react-router-dom": "^7.12.0",
  "framer-motion": "^12.26.1",
  "lucide-react": "^0.562.0"
}
```

### Desarrollo
```json
{
  "typescript": "~5.8.2",
  "vite": "^6.2.0",
  "@vitejs/plugin-react": "^5.0.0",
  "@types/node": "^22.14.0"
}
```

## 🔧 Scripts Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo en puerto 3000
npm run build    # Construye para producción
npm run preview  # Preview del build de producción
```

## 🌐 Integración Externa

### API de Google Gemini
- Variable de entorno: `GEMINI_API_KEY`
- Configurada en `.env.local`
- Expuesta en build como `process.env.API_KEY` y `process.env.GEMINI_API_KEY`

### WhatsApp Business
- Componente flotante (FloatingWhatsApp)
- Número de contacto: +5492612692207

### Google Maps
- Embebido en página de contacto
- Dirección: Santiago Araujo 637, Mendoza, Argentina
- URL del mapa: https://maps.app.goo.gl/PbmJfDhcqRcasP95A

## 📊 Modelos de Datos (TypeScript Interfaces)

### Product
```typescript
{
  id: string;
  name: string;
  price: string;      // String formateado (ej: "$8.500")
  category: string;
  image: string;
}
```

### Service
```typescript
{
  id: string;
  name: string;
  description: string;
  iconName: string;   // Nombre del icono de Lucide
}
```

### TeamMember
```typescript
{
  id: string;
  name: string;
  role: string;
  image: string;
}
```

### Course
```typescript
{
  id: string;
  title: string;
  duration: string;
  description: string;
  image: string;
}
```

### NavItem
```typescript
{
  label: string;
  path: string;
}
```

## 🎨 Características de UI/UX

### Navegación
- Navbar sticky/fixed en la parte superior
- Menú responsive (hamburger en móvil)
- Links de navegación con estado activo
- Smooth scroll entre secciones

### Animaciones
- Page transitions con fade in/out
- Page loader con spinner animado (1 segundo de duración)
- Scroll suave al cambiar de página
- Momentum scrolling en iOS
- Hardware acceleration para mejor performance

### Componentes Principales
1. **Navbar** - Navegación principal
2. **Footer** - Pie de página con información
3. **FloatingWhatsApp** - Botón flotante de contacto
4. **PageLoader** - Spinner de carga entre páginas
5. **Button** - Componente de botón reutilizable

### Optimizaciones iOS
- Scroll horizontal optimizado con momentum nativo
- Touch handlers con delays apropiados
- GPU acceleration en elementos animados
- Scroll snap type proximity para mejor UX
- Overscroll behavior controlado
- Font smoothing mejorado

## 📱 Responsive Design

- **Mobile-first approach**
- **Breakpoints estándar**
- **Imágenes optimizadas**
- **Touch-friendly** (botones, enlaces)
- **Scroll horizontal** en secciones de productos
- **Infinite scroll** con auto-scroll opcional

## 🗂️ Datos Estáticos (constants.ts)

### Información de Contacto
- Nombre: Cristian Marzetti
- Teléfono: +5492612692207
- Dirección: Santiago Araujo 637, Mendoza, Argentina
- Horario: Lun-Vie 9-20hs, Sáb 9-18hs

### Servicios Ofrecidos
1. Corte y Styling
2. Coloración (Balayage, Babylights, Correcciones)
3. Tratamientos (Hidratación, Nutrición, Keratina)
4. Novias y Eventos
5. Servicio a Domicilio

### Productos Disponibles
- Shampoo Profesional
- Sérum Reparador
- Aceite de Argan
- Máscara Capilar
- Spray Fijador

### Cursos de Academia
1. Peinados y Recogidos (3 meses)
2. Colorimetría Avanzada (4 meses)
3. Corte Femenino (5 meses)

### Equipo
1. Cristian Marzetti - Fundador & Master Stylist
2. Laura Gómez - Colorista Senior
3. Pablo Ruiz - Estilista Senior

## ⚙️ Configuración TypeScript

```json
{
  "target": "ES2022",
  "experimentalDecorators": true,
  "useDefineForClassFields": false,
  "module": "ESNext",
  "lib": ["ES2022", "DOM", "DOM.Iterable"],
  "skipLibCheck": true,
  "moduleResolution": "bundler",
  "isolatedModules": true,
  "jsx": "react-jsx",
  "paths": {
    "@/*": ["./*"]
  },
  "allowImportingTsExtensions": true,
  "noEmit": true
}
```

## 🚀 Deployment

- **Tipo**: Static site hosting
- **Build output**: `dist/` (generado por Vite)
- **Routing**: Hash-based (#/) para compatibilidad con servidores estáticos
- **Assets**: Todas las imágenes en `/public/images/`

## 📝 Notas de Desarrollo

### Estado de Carga
- Implementado con `useState` hook
- Duración: 1000ms (1 segundo)
- Scroll to top en cada cambio de ruta
- Transición de opacidad suave

### Patrones de Código
- **Componentes funcionales** con hooks
- **Props typing** estricto con TypeScript
- **Separación de concerns**: componentes, páginas, datos, tipos
- **Path alias** `@/` para imports limpios
- **Animaciones declarativas** con Framer Motion

### Performance
- Lazy loading de rutas (potencial mejora futura)
- Imágenes placeholder de Picsum (reemplazar con assets reales)
- Hardware acceleration en elementos animados
- Optimizaciones específicas para iOS Safari

## 🔒 Variables de Entorno

```env
GEMINI_API_KEY=<tu_api_key_aqui>
```

## 🎯 Casos de Uso Principales

1. **Visitante navega el sitio** - Explora servicios, productos, equipo
2. **Cliente busca información** - Horarios, ubicación, contacto
3. **Prospecto de academia** - Revisa cursos disponibles
4. **Cliente reserva turno** - A través de la página de booking
5. **Contacto directo** - Via WhatsApp flotante o formulario

## 📚 Recursos Adicionales

- **README.md** - Instrucciones de instalación y ejecución
- **OPTIMIZACIONES_IOS.md** - Detalles de optimizaciones mobile
- **metadata.json** - Metadata del proyecto (posiblemente para AI Studio)

## 🔄 Estado Actual del Proyecto

- ✅ Estructura base completada
- ✅ Routing implementado
- ✅ Componentes principales creados
- ✅ Animaciones configuradas
- ✅ Optimizaciones iOS aplicadas
- 🔄 Imágenes usando placeholders (pendiente assets reales)
- 🔄 Integración Gemini API configurada (uso pendiente)

---

**Última actualización**: Enero 2026
**Mantenedor**: MatyAlts
**Versión del documento**: 1.0
