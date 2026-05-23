export const AppRole = Object.freeze({ Admin: 'Admin', Vendedor: 'Vendedor' });
export const ShiftStatus = Object.freeze({ Open: 'Open', Closed: 'Closed' });

export const USERS = [
  { id: 1, username: 'admin', password: 'admin123', role: AppRole.Admin, displayName: 'Admin' },
  { id: 2, username: 'vendedor', password: 'vend123', role: AppRole.Vendedor, displayName: 'Laura Mendez' },
];

export const PRODUCTS = [
  { id: 1, name: 'Papas Sabritas', category: 'Botanas', price: 20, stock: 48, minStock: 10 },
  { id: 2, name: 'Coca-Cola 600ml', category: 'Bebidas', price: 25, stock: 36, minStock: 12 },
  { id: 3, name: 'Gansito Marinela', category: 'Dulces', price: 18, stock: 5, minStock: 8 },
  { id: 4, name: 'Takis Fuego', category: 'Botanas', price: 22, stock: 30, minStock: 10 },
  { id: 5, name: 'Agua Ciel 500ml', category: 'Bebidas', price: 15, stock: 60, minStock: 20 },
  { id: 6, name: 'Paleta Payaso', category: 'Dulces', price: 12, stock: 25, minStock: 15 },
  { id: 7, name: 'Doritos Nacho', category: 'Botanas', price: 19, stock: 0, minStock: 10 },
];

export const CUSTOMERS = [
  { id: 1, name: 'Maria Garcia', phone: '3312345678', points: 340, visits: 12 },
  { id: 2, name: 'Carlos Lopez', phone: '3398765432', points: 120, visits: 5 },
  { id: 3, name: 'Ana Martinez', phone: '3387654321', points: 80, visits: 3 },
];

export const EMPLOYEES = [
  { id: 1, name: 'Admin', role: AppRole.Admin, status: 'Activo', lastLogin: '2025-05-18 09:01' },
  { id: 2, name: 'Laura Mendez', role: AppRole.Vendedor, status: 'Activo', lastLogin: '2025-05-18 09:05' },
  { id: 3, name: 'Jorge Salinas', role: AppRole.Vendedor, status: 'Inactivo', lastLogin: '2025-05-10 08:50' },
];

export const SHIFTS = [
  {
    id: 1,
    date: '2025-05-16',
    shiftNumber: 1,
    openedBy: 'Laura Mendez',
    openTime: '09:00',
    closeTime: '14:00',
    initialFloat: 500,
    totalSales: 820,
    status: ShiftStatus.Closed,
  },
  {
    id: 2,
    date: '2025-05-16',
    shiftNumber: 2,
    openedBy: 'Admin',
    openTime: '14:00',
    closeTime: '21:00',
    initialFloat: 500,
    totalSales: 930,
    status: ShiftStatus.Closed,
  },
  {
    id: 3,
    date: '2025-05-17',
    shiftNumber: 1,
    openedBy: 'Laura Mendez',
    openTime: '09:00',
    closeTime: '14:00',
    initialFloat: 500,
    totalSales: 750,
    status: ShiftStatus.Closed,
  },
];

export const SALES_LAST_7_DAYS = [
  { date: '2025-05-12', total: 1240, transactions: 18 },
  { date: '2025-05-13', total: 980, transactions: 14 },
  { date: '2025-05-14', total: 1540, transactions: 22 },
  { date: '2025-05-15', total: 870, transactions: 11 },
  { date: '2025-05-16', total: 1750, transactions: 25 },
  { date: '2025-05-17', total: 1320, transactions: 19 },
  { date: '2025-05-18', total: 640, transactions: 9 },
];

export const TOP_PRODUCTS = [
  { name: 'Takis Fuego', sold: 87, orders: 54, revenue: 1914 },
  { name: 'Coca-Cola 600ml', sold: 74, orders: 61, revenue: 1850 },
  { name: 'Papas Sabritas', sold: 65, orders: 48, revenue: 1300 },
  { name: 'Gansito Marinela', sold: 48, orders: 31, revenue: 864 },
  { name: 'Agua Ciel 500ml', sold: 43, orders: 40, revenue: 645 },
];

export const SHIFT_SALES = [
  { shift: 'Turno 1 (Manana)', total: 2570 },
  { shift: 'Turno 2 (Tarde)', total: 3930 },
];

export const DASHBOARD_STATS = {
  totalToday: 640,
  txToday: 9,
  topProduct: 'Takis Fuego',
  lowStockCount: 2,
};
