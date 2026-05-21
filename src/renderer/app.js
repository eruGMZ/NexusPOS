import { AppRole } from './mock/data.js';

const appRoot = document.getElementById('app-root');

const PAGES = {
  dashboard: () => import('./pages/dashboard.js'),
  pos: () => import('./pages/pos.js'),
  ventas: () => import('./pages/ventas.js'),
  inventory: () => import('./pages/inventory.js'),
  customers: () => import('./pages/customers.js'),
  estadisticas: () => import('./pages/estadisticas.js'),
  turnos: () => import('./pages/turnos.js'),
  empleados: () => import('./pages/empleados.js'),
};

const NAV_BY_ROLE = {
  [AppRole.Vendedor]: [
    { key: 'pos', label: 'Punto de Venta', icon: '🛒' },
    { key: 'ventas', label: 'Ventas', icon: '📋' },
    { key: 'turnos', label: 'Turnos', icon: '🕓' },
  ],
  [AppRole.Admin]: [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'pos', label: 'Punto de Venta', icon: '🛒' },
    { key: 'ventas', label: 'Ventas', icon: '📋' },
    { key: 'inventory', label: 'Inventario', icon: '📦' },
    { key: 'customers', label: 'Clientes', icon: '👥' },
    { key: 'estadisticas', label: 'Estadisticas', icon: '📈' },
    { key: 'turnos', label: 'Turnos', icon: '🕓' },
    { key: 'empleados', label: 'Empleados', icon: '🧑‍💼' },
  ],
};

const session = {
  currentUser: null,
  currentPage: null,
  ticketCounter: 124,
  activeShift: null,
};

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function toast(message) {
  const previous = document.querySelector('.toast');
  if (previous) previous.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

function sharedOptions() {
  return {
    toast,
    currentUser: session.currentUser,
    getNextTicketNumber: () => {
      const value = session.ticketCounter;
      session.ticketCounter += 1;
      return value;
    },
    getActiveShift: () => session.activeShift,
    setActiveShift: (shift) => {
      session.activeShift = shift;
    },
  };
}

async function navigate(pageKey) {
  if (!session.currentUser || !PAGES[pageKey]) return;

  const navButtons = appRoot.querySelectorAll('.nav-item[data-page]');
  navButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.page === pageKey);
  });

  const pageContainer = appRoot.querySelector('#page-container');
  if (!pageContainer) return;
  pageContainer.innerHTML = '';

  if (window.matchMedia('(max-width: 1400px)').matches) {
    appRoot.classList.remove('sidebar-open');
  }

  session.currentPage = pageKey;
  const page = await PAGES[pageKey]();
  page.init(pageContainer, sharedOptions());
}

function renderShell() {
  const items = NAV_BY_ROLE[session.currentUser.role] || [];

  appRoot.innerHTML = `
    <div class="app-shell">
      <div class="app-overlay" id="app-overlay"></div>
      <aside class="sidebar">
        <div class="sidebar__logo">
          <span class="sidebar__logo-icon">🍿</span>
          <span class="sidebar__logo-text">SnackPOS</span>
        </div>

        <nav class="sidebar__nav">
          ${items
            .map(
              (item) => `
            <button class="nav-item" data-page="${item.key}">
              <span class="nav-item__icon">${item.icon}</span>
              <span>${item.label}</span>
            </button>
          `
            )
            .join('')}
        </nav>

        <div class="sidebar__user">
          <div class="user-chip">
            <div class="user-chip__avatar">${initials(session.currentUser.displayName)}</div>
            <div>
              <div class="user-chip__name">${session.currentUser.displayName}</div>
              <span class="badge badge--amber">${session.currentUser.role}</span>
            </div>
          </div>
          <button class="btn btn--ghost btn--full" id="logout-btn">Cerrar sesion</button>
        </div>
      </aside>

      <div class="main-area">
        <header class="topbar">
          <button class="menu-toggle" id="menu-toggle" aria-label="Abrir menu">
            <span class="menu-toggle__bar"></span>
            <span class="menu-toggle__bar"></span>
            <span class="menu-toggle__bar"></span>
          </button>
          <span class="topbar__brand">🍿 <strong>SnackPOS</strong></span>
          <div class="topbar__user-avatar">${initials(session.currentUser.displayName)}</div>
        </header>
        <main class="page-content" id="page-container"></main>
      </div>
    </div>
  `;

  appRoot.querySelectorAll('.nav-item[data-page]').forEach((btn) => {
    btn.addEventListener('click', () => navigate(btn.dataset.page));
  });

  appRoot.querySelector('#logout-btn').addEventListener('click', () => {
    session.currentUser = null;
    session.currentPage = null;
    session.activeShift = null;
    appRoot.classList.remove('sidebar-open');
    renderLogin();
  });

  const menuToggle = appRoot.querySelector('#menu-toggle');
  const overlay = appRoot.querySelector('#app-overlay');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      appRoot.classList.toggle('sidebar-open');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      appRoot.classList.remove('sidebar-open');
    });
  }

  if (items.length > 0) {
    navigate(items[0].key);
  }
}

async function renderLogin() {
  appRoot.innerHTML = '<div class="login-screen" id="login-screen"></div>';
  const login = await import('./pages/login.js');
  login.init(document.getElementById('login-screen'), {
    onLogin: (user) => {
      session.currentUser = user;
      renderShell();
      toast(`Bienvenido, ${user.displayName}`);
    },
  });
}

renderLogin();
