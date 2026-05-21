You are helping me build a desktop POS (Point of Sale) demo application using 
Electron on Node.js. This is a CONCEPTUAL DEMO — no real database, no API, 
no backend, no printer driver. All data is hardcoded mock data in JavaScript.
The goal is to showcase the full UX/UI and feature scope for a real snack 
business POS — visually complete but not functionally wired.

## Business Context
Client: Axel — snack kiosk inside a shopping mall.
Real needs: fast sales, shift management (2 shifts/day), role-based access, 
ticket printing, sales statistics.

OUT OF SCOPE — do not build, do not mention:
- Mobile ordering app
- Delivery or pickup flow (no Rappi/Uber Eats equivalent)
- Multi-platform support

## Tech Stack
- Electron (only used to open the BrowserWindow — no IPC whatsoever)
- Vanilla JS (ES modules via <script type="module">)
- Plain CSS with CSS variables (no Tailwind, no frameworks, no CDNs)
- Chart.js loaded from node_modules via relative script tag
- All data lives in src/renderer/mock/data.js as plain JS objects/arrays

## Design System
- Dark theme: background #0C0C0F, surface #16161A, border #2A2A35
- Accent color: #F5A623 (warm amber)
- Text: #FFFFFF primary, #8B8B9A secondary
- Font: 'DM Sans' via Google Fonts in index.html
- Frameless window (frame: false) with custom HTML titlebar
- Minimalist UI — large targets, clear hierarchy, no clutter

## Answered Design Decisions
1. Logout returns to LoginView without closing the app window.
   The Electron window stays open; only the UI resets to login screen.
2. VentasView is completely new and separate from EstadísticasView.
   VentasView = today's sales only (simple table).
   EstadísticasView = full stats, charts, top products, shift comparison.
   Two separate modules, two separate nav items.
3. Ticket number resets every time the app starts. Always begins at #00124.
   No persistence needed — this is a demo.

## File Structure
snackpos/
├── src/
│   ├── main/
│   │   └── main.js                   ← Opens BrowserWindow only, no IPC
│   └── renderer/
│       ├── index.html                ← Shell: login screen OR app shell
│       ├── app.js                    ← Router + session state + nav filter
│       ├── styles/
│       │   └── main.css              ← All global styles and design tokens
│       ├── mock/
│       │   └── data.js               ← All mock data as ES module exports
│       └── pages/
│           ├── login.js
│           ├── dashboard.js
│           ├── pos.js
│           ├── ticket.js             ← Modal receipt, called from pos.js
│           ├── ventas.js
│           ├── inventory.js
│           ├── customers.js
│           ├── estadisticas.js
│           ├── turnos.js
│           └── empleados.js
└── package.json

## src/main/main.js
Minimal Electron entry. Creates BrowserWindow (1440x900, frameless, 
background #0C0C0F). No ipcMain, no preload. 
webPreferences: { nodeIntegration: false, contextIsolation: true }

## src/renderer/mock/data.js
Export all mock data as named ES module exports:

// Enums (as frozen objects)
export const AppRole = Object.freeze({ Admin: 'Admin', Vendedor: 'Vendedor' });
export const ShiftStatus = Object.freeze({ Open: 'Open', Closed: 'Closed' });

export const USERS = [
  { id: 1, username: 'admin',    password: 'admin123', role: AppRole.Admin,    displayName: 'Axel Ramírez' },
  { id: 2, username: 'vendedor', password: 'vend123',  role: AppRole.Vendedor, displayName: 'Laura Méndez' },
];

export const PRODUCTS = [
  { id: 1, name: 'Papas Sabritas',  category: 'Botanas', price: 20, stock: 48, minStock: 10 },
  { id: 2, name: 'Coca-Cola 600ml', category: 'Bebidas', price: 25, stock: 36, minStock: 12 },
  { id: 3, name: 'Gansito Marinela',category: 'Dulces',  price: 18, stock: 5,  minStock: 8  },
  { id: 4, name: 'Takis Fuego',     category: 'Botanas', price: 22, stock: 30, minStock: 10 },
  { id: 5, name: 'Agua Ciel 500ml', category: 'Bebidas', price: 15, stock: 60, minStock: 20 },
  { id: 6, name: 'Paleta Payaso',   category: 'Dulces',  price: 12, stock: 25, minStock: 15 },
  { id: 7, name: 'Doritos Nacho',   category: 'Botanas', price: 19, stock: 0,  minStock: 10 },
];

export const CUSTOMERS = [
  { id: 1, name: 'María García', phone: '3312345678', points: 340, visits: 12 },
  { id: 2, name: 'Carlos López', phone: '3398765432', points: 120, visits: 5  },
  { id: 3, name: 'Ana Martínez', phone: '3387654321', points: 80,  visits: 3  },
];

export const EMPLOYEES = [
  { id: 1, name: 'Axel Ramírez',  role: AppRole.Admin,    status: 'Activo',   lastLogin: '2025-05-18 09:01' },
  { id: 2, name: 'Laura Méndez',  role: AppRole.Vendedor, status: 'Activo',   lastLogin: '2025-05-18 09:05' },
  { id: 3, name: 'Jorge Salinas', role: AppRole.Vendedor, status: 'Inactivo', lastLogin: '2025-05-10 08:50' },
];

export const SHIFTS = [
  { id: 1, date: '2025-05-16', shiftNumber: 1, openedBy: 'Laura Méndez',
    openTime: '09:00', closeTime: '14:00', initialFloat: 500, totalSales: 820, status: ShiftStatus.Closed },
  { id: 2, date: '2025-05-16', shiftNumber: 2, openedBy: 'Axel Ramírez',
    openTime: '14:00', closeTime: '21:00', initialFloat: 500, totalSales: 930, status: ShiftStatus.Closed },
  { id: 3, date: '2025-05-17', shiftNumber: 1, openedBy: 'Laura Méndez',
    openTime: '09:00', closeTime: '14:00', initialFloat: 500, totalSales: 750, status: ShiftStatus.Closed },
];

export const SALES_LAST_7_DAYS = [
  { date: '2025-05-12', total: 1240, transactions: 18 },
  { date: '2025-05-13', total: 980,  transactions: 14 },
  { date: '2025-05-14', total: 1540, transactions: 22 },
  { date: '2025-05-15', total: 870,  transactions: 11 },
  { date: '2025-05-16', total: 1750, transactions: 25 },
  { date: '2025-05-17', total: 1320, transactions: 19 },
  { date: '2025-05-18', total: 640,  transactions: 9  },
];

export const TOP_PRODUCTS = [
  { name: 'Takis Fuego',      sold: 87, orders: 54, revenue: 1914 },
  { name: 'Coca-Cola 600ml',  sold: 74, orders: 61, revenue: 1850 },
  { name: 'Papas Sabritas',   sold: 65, orders: 48, revenue: 1300 },
  { name: 'Gansito Marinela', sold: 48, orders: 31, revenue: 864  },
  { name: 'Agua Ciel 500ml',  sold: 43, orders: 40, revenue: 645  },
];

export const SHIFT_SALES = [
  { shift: 'Turno 1 (Mañana)',  total: 2570 },
  { shift: 'Turno 2 (Tarde)',   total: 3930 },
];

export const DASHBOARD_STATS = {
  totalToday: 640, txToday: 9,
  topProduct: 'Takis Fuego', lowStockCount: 2,
};

## src/renderer/index.html
Single HTML file. On load shows LoginView inside #app-root.
After login, replaces #app-root content with the full app shell:
  - Custom frameless titlebar (app name + window controls)
  - Left sidebar (220px): nav items filtered by role + bottom user info + logout
  - Main area: <div id="page-container"> where pages are injected

Loads Chart.js from node_modules, then app.js as type="module".

## src/renderer/app.js
Manages:
- Session state: currentUser (null until login)
- Login flow: renders login.js, on success stores currentUser and renders shell
- Logout: clears currentUser, re-renders login screen (window stays open)
- Router: maps nav clicks to dynamic page imports, calls page.init(container)
- Nav filter: builds sidebar items based on currentUser.role

Sidebar nav — Vendedor sees:
  Punto de Venta | Ventas | Turnos

Sidebar nav — Admin sees:
  Dashboard | Punto de Venta | Ventas | Inventario | Clientes | Estadísticas | Turnos | Empleados

Bottom of sidebar: avatar circle with initials, displayName, role badge,
"Cerrar sesión" button that triggers logout flow.

## pages/login.js
Exports { init(container) }
Renders a centered login card:
  - App logo / name "SnackPOS"
  - Username input, Password input
  - "Iniciar sesión" button
  - On submit: checks against USERS mock array
  - On success: calls app's onLogin(user) callback
  - On fail: shows inline error "Usuario o contraseña incorrectos"
  - Subtle amber accent on focus states

## pages/dashboard.js  [Admin only]
- 4 KPI cards: Venta del día, Transacciones, Producto top, Alertas stock
- Chart.js line chart: ventas últimos 7 días (SALES_LAST_7_DAYS)
- Top 5 productos table: name, sold units, orders, revenue

## pages/pos.js
- Left: product grid cards — name, price, category badge, "+" button
- Right: cart — item list with qty controls (−/+), subtotal, remove
- Bottom bar: customer selector (optional), payment toggle Efectivo/Tarjeta,
  discount % input, running total, "COBRAR" button
- On COBRAR: validate cart not empty, then call ticket.show(saleData, currentUser)
- Stock NOT decremented (demo only)
- Cart clears after ticket is closed

## pages/ticket.js
Exports { show(saleData, currentUser) }
Opens as an overlay modal (not a new window — inject into DOM as overlay):

Receipt layout:
  Header: "SnackPOS" | date + time | Ticket #00124 (auto-increments per session)
  Cashier: currentUser.displayName | Shift: Turno X (from active shift or "Sin turno")
  ─────────────────────────────────────────────
  Line items: product name · qty · unit price · subtotal
  ─────────────────────────────────────────────
  Subtotal | Descuento (if any) | TOTAL
  Método de pago: Efectivo / Tarjeta
  If Efectivo: Entregado: $X | Cambio: $X
  ─────────────────────────────────────────────
  If customer selected: Puntos ganados: +XX pts | Saldo: XXX pts
  Footer: "¡Gracias por tu compra!"
  ─────────────────────────────────────────────
  Buttons: [Imprimir] [Cerrar]
  "Imprimir" shows a tooltip: "Impresora no configurada en modo demo"

Ticket counter starts at 124 on app load, increments each sale.

## pages/ventas.js  [Both roles]
Today's sales — simple focused view:
- Header: today's date, total revenue card, transaction count card
- Table: # | time | items summary | total | payment method | customer (if any)
- Uses SALES_LAST_7_DAYS last entry as today's mock data, 
  plus 3–4 hardcoded individual sale rows for visual richness
- No date filtering needed

## pages/inventory.js  [Admin only]
- Search input filters product list in real time
- Table: Producto | Categoría | Precio | Stock | Stock Mín | Estado | Acciones
- Estado badge: OK (green) | Bajo (amber) | Agotado (red)
- Acciones: edit icon → modal, +/- stock buttons (local array only)
- "Agregar producto" button → empty modal

## pages/customers.js  [Admin only]
- Table: Nombre | Teléfono | Puntos | Visitas | Nivel | Acciones
- Nivel badge: Básico <100 | Plata 100–299 | Oro 300+
- "Ver detalle" → slide-in side panel: points progress bar, reward tiers
  (100 pts = snack gratis | 300 pts = 10% descuento)
- "Agregar cliente" → modal (local list only)

## pages/estadisticas.js  [Admin only]
- Date range inputs (visual only, no real filtering)
- Highlight cards:
    Producto más vendido (by units): Takis Fuego — 87 unidades
    Producto más pedido (by orders): Coca-Cola 600ml — 61 órdenes
    Turno más rentable: Turno 2 — $3,930
- Summary cards: ingresos totales, ticket promedio, unidades vendidas
- Chart.js bar chart: revenue by category (Botanas / Bebidas / Dulces)
- Chart.js bar chart: ventas por turno (Turno 1 vs Turno 2) — SHIFT_SALES
- Sales history table

## pages/turnos.js  [Both roles]
Two shifts per day: Turno 1 (morning) / Turno 2 (afternoon).
Local state: activeShift (null or shift object).

UI:
- Active shift card (if open): shift #, opened by, open time, running total ($640)
- "Iniciar Turno" button (if no active shift):
    → prompt for initial cash float (input field + confirm)
    → sets activeShift using currentUser.displayName
- "Cerrar Turno" button (if shift open):
    → shows summary overlay: initial float, total sales, expected cash
    → confirm closes shift, adds to local history table
- Only one shift open at a time
- Shift history table: date | turno # | abierto por | hora apertura | hora cierre | total

## pages/empleados.js  [Admin only]
- Table: Nombre | Rol | Estado | Último acceso | Acciones
- Status badge: Activo (green) | Inactivo (gray)
- "Agregar empleado" → modal (local list only)
- "Editar" → modal pre-filled (local only)
- Uses EMPLOYEES mock data

## main.css
All design tokens as :root CSS variables.
Key layout: sidebar fixed 220px left, content fills rest.
Components to style: cards, badges, buttons (primary amber / ghost),
tables (sticky header, alternating rows), modals (backdrop blur overlay),
sidebar nav items (active state amber left border + amber text),
toast notifications (bottom-right, slide-in CSS animation),
login card (centered, subtle border glow on focus),
ticket overlay (white-on-dark receipt aesthetic, monospace font for amounts).

## Code Style
- Each page: ES module exporting { init(container) } — except ticket.js: { show() }
- All state local to module function scope — no globals
- innerHTML for rendering, addEventListener for interactions
- Chart.js as window.Chart (script tag before modules)
- BEM-lite classes: .card, .card__title, .card--amber
- Shared toast helper defined in app.js, passed to pages via options object
  example: page.init(container, { toast, currentUser, onLogout })

## Build Order
Generate one file at a time, wait for confirmation before next:

1.  package.json
2.  src/main/main.js
3.  src/renderer/mock/data.js
4.  src/renderer/styles/main.css
5.  src/renderer/index.html
6.  src/renderer/app.js
7.  src/renderer/pages/login.js
8.  src/renderer/pages/dashboard.js
9.  src/renderer/pages/pos.js
10. src/renderer/pages/ticket.js
11. src/renderer/pages/ventas.js
12. src/renderer/pages/inventory.js
13. src/renderer/pages/customers.js
14. src/renderer/pages/estadisticas.js
15. src/renderer/pages/turnos.js
16. src/renderer/pages/empleados.js

Write each file completely — no placeholders, no TODOs.
Start with file 1 and wait for my confirmation before continuing.