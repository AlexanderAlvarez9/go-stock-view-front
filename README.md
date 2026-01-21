# Stock Viewer Frontend

Interfaz de usuario para visualizar y analizar recomendaciones de stocks en tiempo real.

## Tecnologías

- **Vue 3** - Framework de UI
- **TypeScript** - Tipado estático
- **Pinia** - State management
- **Tailwind CSS** - Estilos
- **Vite** - Build tool
- **Axios** - HTTP client

## Requisitos

- Node.js 18+
- npm o yarn

## Inicio Rápido

### 1. Instalar dependencias

```bash
cd go-stock-viewer-front
npm install
```

### 2. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000

### 3. Build para producción

```bash
npm run build
```

## Estructura del Proyecto

```
go-stock-viewer-front/
├── public/                 # Assets estáticos
├── src/
│   ├── assets/            # CSS y assets
│   ├── components/        # Componentes Vue
│   │   ├── common/        # Componentes reutilizables
│   │   ├── layout/        # Layout components
│   │   ├── recommendations/
│   │   └── stocks/
│   ├── config/            # Configuración
│   ├── router/            # Vue Router
│   ├── services/          # API services
│   ├── stores/            # Pinia stores
│   ├── types/             # TypeScript types
│   ├── views/             # Páginas
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## Características

### Dashboard
- Vista general con métricas clave
- Top 3 recomendaciones destacadas
- Stocks recientes
- Indicador de estado en tiempo real

### Lista de Stocks
- Vista en tabla o cards
- Filtros avanzados (ticker, empresa, brokerage, rating, acción)
- Ordenamiento configurable
- Paginación

### Recomendaciones
- Algoritmo de scoring explicado
- Top pick destacado
- Razones de recomendación

### Panel de Admin
- Sincronización manual de datos
- Autenticación básica
- Visualización de configuración

## Configuración

La configuración de la aplicación está centralizada en `src/config/index.ts`:

```typescript
export const config: AppConfig = {
  apiBaseUrl: '/api/v1',      // URL base de la API
  pollingInterval: 10000,      // Intervalo de actualización (ms)
  defaultPageSize: 20          // Tamaño de página por defecto
}
```

Para modificar estos valores, edita directamente el archivo de configuración.

## Polling en Tiempo Real

La aplicación actualiza los datos automáticamente cada 10 segundos.
El polling se puede pausar/reanudar desde el header.

## Diseño

Inspirado en TradingView con:
- Tema oscuro profesional
- Colores semánticos (verde/rojo para up/down)
- Tipografía clara
- Animaciones sutiles
- Responsive design
