import { SALES_LAST_7_DAYS } from '../mock/data.js';

export function init(container) {
  const today = SALES_LAST_7_DAYS[SALES_LAST_7_DAYS.length - 1];
  const salesRows = [
    { id: '#00124', time: '09:14', items: '2x Coca-Cola, 1x Takis', total: 72, payment: 'Efectivo', customer: 'Maria Garcia' },
    { id: '#00125', time: '10:03', items: '1x Papas Sabritas', total: 20, payment: 'Tarjeta', customer: '-' },
    { id: '#00126', time: '11:22', items: '3x Agua Ciel', total: 45, payment: 'Efectivo', customer: 'Carlos Lopez' },
    { id: '#00127', time: '12:47', items: '1x Gansito, 1x Doritos', total: 37, payment: 'Tarjeta', customer: '-' },
  ];

  container.innerHTML = `
    <div class="page-header">
      <h1>Ventas de hoy</h1>
      <p>${new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(2,1fr)">
      <div class="card"><div class="card__title">Ingreso de hoy</div><div class="card__value card__value--amber">$${today.total}</div></div>
      <div class="card"><div class="card__title">Transacciones</div><div class="card__value">${today.transactions}</div></div>
    </div>

    <div class="table-card">
      <div class="table-card__header"><h2>Detalle de tickets</h2></div>
      <table class="data-table">
        <thead><tr><th>#</th><th>Hora</th><th>Productos</th><th>Total</th><th>Pago</th><th>Cliente</th></tr></thead>
        <tbody>
          ${salesRows.map((row) => `<tr><td>${row.id}</td><td>${row.time}</td><td>${row.items}</td><td>$${row.total}</td><td>${row.payment}</td><td>${row.customer}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
}
