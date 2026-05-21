You are helping me build a desktop POS (Point of Sale) demo application using Electron 
for a snack business inside a shopping mall. This is a CONCEPTUAL DEMO — there is no 
real database, no IPC, no backend. All data is hardcoded mock data in JavaScript.

## Tech Stack
- Electron (only used to open the BrowserWindow — no IPC whatsoever)
- Vanilla JS (ES modules via <script type="module">)
- Plain CSS with CSS variables (no Tailwind, no frameworks, no CDNs)
- Chart.js loaded from local node_modules (import via script tag or module)
- All data lives in src/renderer/mock/data.js as plain JS objects/arrays

## Design System
- Dark theme: background #0C0C0F, surface #16161A, border #2A2A35
- Accent color: #F5A623 (warm amber)
- Text: #FFFFFF primary, #8B8B9A secondary
- Font: 'DM Sans' via Google Fonts in index.html
- Frameless window (frame: false) with custom HTML titlebar
- Minimalist UI — large targets, clear hierarchy, no clutter

## File Structure
snackpos/
├── src/
│   ├── main/
│   │   └── main.js              ← Only opens BrowserWindow, no IPC
│   └── renderer/
│       ├── index.html           ← Shell: titlebar + sidebar + #page-container
│       ├── app.js               ← Router, mounts pages
│       ├── styles/
│       │   └── main.css         ← All global styles and design tokens
│       ├── mock/
│       │   └── data.js          ← All mock data exported as JS constants
│       └── pages/
│           ├── dashboard.js
│           ├── pos.js
│           ├── inventory.js
│           ├── customers.js
│           ├── reports.js
│           └── cash.js
└── package.json

## src/main/main.js
Minimal Electron entry point. Just creates a BrowserWindow and loads index.html.
No ipcMain, no preload, no contextBridge. webPreferences: { nodeIntegration: false }.

## src/renderer/mock/data.js
Export these mock datasets as named ES module exports:

export const PRODUCTS = [
  { id: 1, name: 'Papas Sabritas', category: 'Botanas', price: 20, stock: 48, minStock: 10 },
  { id: 2, name: 'Coca-Cola 600ml', category: 'Bebidas', price: 25, stock: 36, minStock: 12 },
  { id: 3, name: 'Gansito Marinela', category: 'Dulces', price: 18, stock: 5,  minStock: 8  },
  { id: 4, name: 'Takis Fuego',      category: 'Botanas', price: 22, stock: 30, minStock: 10 },
  { id: 5, name: 'Agua Ciel 500ml',  category: 'Bebidas', price: 15, stock: 60, minStock: 20 },
  { id: 6, name: 'Paleta Payaso',    category: 'Dulces',  price: 12, stock: 25, minStock: 15 },
  { id: 7, name: 'Doritos Nacho',    category: 'Botanas', price: 19, stock: 0,  minStock: 10 },
];

export const CUSTOMERS = [
  { id: 1, name: 'María García',  phone: '3312345678', points: 340, visits: 12 },
  { id: 2, name: 'Carlos López',  phone: '3398765432', points: 120, visits: 5  },
  { id: 3, name: 'Ana Martínez',  phone: '3387654321', points: 80,  visits: 3  },
];

export const SALES_LAST_7_DAYS = [
  { date: '2025-05-12', total: 1240, transactions: 18 },
  { date: '2025-05-13', total: 980,  transactions: 14 },
  { date: '2025-05-14', total: 1540, transactions: 22 },
  { date: '2025-05-15', total: 870,  transactions: 11 },
  { date: '2025-05-16', total: 1320, transactions: 19 },
  { date: '2025-05-17', total: 1750, transactions: 25 },
  { date: '2025-05-18', total: 640,  transactions: 9  },
];

export const TOP_PRODUCTS = [
  { name: 'Takis Fuego',      sold: 87, revenue: 1914 },
  { name: 'Coca-Cola 600ml',  sold: 74, revenue: 1850 },
  { name: 'Papas Sabritas',   sold: 65, revenue: 1300 },
  { name: 'Gansito Marinela', sold: 48, revenue: 864  },
  { name: 'Agua Ciel 500ml',  sold: 43, revenue: 645  },
];

export const CASH_CUTS = [
  { date: '2025-05-17', opened: '09:00', closed: '21:00', initial: 500, sales: 1750, total: 2250 },
  { date: '2025-05-16', opened: '09:05', closed: '20:55', initial: 500, sales: 1320, total: 1820 },
];

export const DASHBOARD_STATS = {
  totalToday: 640,
  txToday: 9,
  topProduct: 'Takis Fuego',
  lowStockCount: 2,  // products where stock <= minStock
};

## src/renderer/index.html
Single-page shell with:
- Custom frameless titlebar (app name left, window controls right — 
  buttons call window.close() / window.minimize() natively or are purely visual in demo)
- Left sidebar: vertical nav with icon + label for each page
  (Dashboard, Punto de Venta, Inventario, Clientes, Reportes, Caja)
- Main area: <div id="page-container"> where pages are injected
- Loads Chart.js from node_modules via a relative path script tag
- Loads app.js as type="module"

## src/renderer/app.js
Simple hash-based or click-based router. On nav click:
1. Dynamically import the page module
2. Clear #page-container
3. Call page.init(container)
4. Update active nav item style
Default page on load: dashboard

## Pages — each exports { init(container) }
All pages use mock data directly imported from '../mock/data.js'.
UI interactions (add to cart, edit stock, etc.) mutate local JS variables only — 
no persistence, resets on page reload. That's fine for a demo.

### pages/dashboard.js
- 4 KPI cards: Venta del día ($640), Transacciones (9), Producto top (Takis Fuego), 
  Alertas de stock (2)
- Line chart (Chart.js): ventas últimos 7 días using SALES_LAST_7_DAYS
- Top 5 productos table using TOP_PRODUCTS

### pages/pos.js
- Left panel: grid of product cards (from PRODUCTS) — name, price, big "+" button
- Right panel: cart list — each item shows name, qty (−/+), subtotal, remove
- Bottom: customer dropdown (from CUSTOMERS, optional), 
  payment toggle (Efectivo / Tarjeta), discount % input, total, COBRAR button
- On COBRAR: show a success toast "¡Venta registrada!" and clear the cart
- Stock is NOT actually decremented (demo only)

### pages/inventory.js
- Search input filters the product table in real time
- Table columns: Producto, Categoría, Precio, Stock, Stock Mín, Estado, Acciones
- Estado badge: verde="OK", ámbar="Bajo", rojo="Agotado"
- Acciones: edit icon opens a modal pre-filled with product data (changes are local only),
  +/- buttons adjust stock in the local array only
- "Agregar producto" button opens empty modal

### pages/customers.js
- Customer table: Nombre, Teléfono, Puntos, Visitas, Acciones
- Points tier badge: <100 = Básico, 100-299 = Plata, 300+ = Oro
- "Ver detalle" opens a side panel showing: full info, points bar toward next reward,
  reward tiers (100pts=snack gratis, 300pts=10% descuento)
- "Agregar cliente" button opens modal (saves to local array only)

### pages/reports.js
- Date range inputs (visual only, filter not functional in demo)
- Summary cards: Ingresos totales, Ticket promedio, Unidades vendidas
- Bar chart (Chart.js): ventas por categoría (Botanas / Bebidas / Dulces)
- Sales history table using SALES_LAST_7_DAYS

### pages/cash.js
- Register status card: open/closed toggle (local state only)
- "Abrir caja" form: initial cash amount input
- When open: shows initial amount, simulated sales total, expected total
- "Cerrar caja" button: shows a cut summary modal, adds entry to local CASH_CUTS array
- Cash cuts history table using CASH_CUTS mock data

## CSS Rules (main.css)
- Define all tokens as :root CSS variables
- Layout: sidebar fixed left (220px), content fills remaining width
- Cards: background var(--surface), border-radius 12px, subtle border
- Buttons: primary = amber fill, secondary = ghost with amber border
- Tables: alternating row bg, sticky header
- Modals: centered overlay with backdrop blur
- Toast: fixed bottom-right, slides in/out with CSS animation
- No media queries needed (desktop only, min 1200px)

## Code Style
- Each page is a self-contained ES module: export function init(container) { ... }
- No global variables — all state is local to the module function scope
- Use innerHTML for rendering (fine for a demo), addEventListener for interactions
- Chart.js accessed as window.Chart (loaded via script tag before modules)
- BEM-lite class naming: .card, .card__title, .card--amber
- Shared UI helpers (toast, modal) defined in app.js and passed or re-implemented 
  per page (keep it simple)

## What to build
Generate each file completely, with no placeholders or TODOs.
Start in this order:
1. package.json
2. src/main/main.js
3. src/renderer/mock/data.js
4. src/renderer/styles/main.css
5. src/renderer/index.html
6. src/renderer/app.js
7. src/renderer/pages/dashboard.js
8. src/renderer/pages/pos.js
9. src/renderer/pages/inventory.js
10. src/renderer/pages/customers.js
11. src/renderer/pages/reports.js
12. src/renderer/pages/cash.js

Write one file at a time and wait for me to confirm before continuing.
