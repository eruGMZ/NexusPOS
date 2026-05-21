import { DASHBOARD_STATS, SALES_LAST_7_DAYS, TOP_PRODUCTS } from '../mock/data.js';

export function init(container) {
  container.innerHTML = `
    <div class="page-header"><h1>Dashboard</h1><p>Resumen del negocio</p></div>
    <div class="kpi-grid">
      <div class="card"><div class="card__title">Venta del dia</div><div class="card__value card__value--amber">$${DASHBOARD_STATS.totalToday}</div></div>
      <div class="card"><div class="card__title">Transacciones</div><div class="card__value">${DASHBOARD_STATS.txToday}</div></div>
      <div class="card"><div class="card__title">Producto top</div><div class="card__value" style="font-size:20px">${DASHBOARD_STATS.topProduct}</div></div>
      <div class="card"><div class="card__title">Alertas stock</div><div class="card__value">${DASHBOARD_STATS.lowStockCount}</div></div>
    </div>
    <div class="card" style="margin-bottom:12px"><canvas id="dashboard-chart" height="90"></canvas></div>
    <div class="table-card">
      <div class="table-card__header"><h2>Top 5 productos</h2></div>
      <table class="data-table"><thead><tr><th>Producto</th><th>Unidades</th><th>Ordenes</th><th>Ingreso</th></tr></thead><tbody>
      ${TOP_PRODUCTS.map((item) => `<tr><td>${item.name}</td><td>${item.sold}</td><td>${item.orders}</td><td>$${item.revenue}</td></tr>`).join('')}
      </tbody></table>
    </div>
  `;

  new window.Chart(container.querySelector('#dashboard-chart'), {
    type: 'line',
    data: {
      labels: SALES_LAST_7_DAYS.map((item) => item.date),
      datasets: [{ data: SALES_LAST_7_DAYS.map((item) => item.total), borderColor: '#f5a623', tension: 0.35 }],
    },
    options: { plugins: { legend: { display: false } } },
  });
}
