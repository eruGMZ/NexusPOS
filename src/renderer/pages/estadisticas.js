import { SALES_LAST_7_DAYS, TOP_PRODUCTS, SHIFT_SALES } from '../mock/data.js';

export function init(container) {
  const totalRevenue = SALES_LAST_7_DAYS.reduce((acc, item) => acc + item.total, 0);
  const totalTx = SALES_LAST_7_DAYS.reduce((acc, item) => acc + item.transactions, 0);
  const avgTicket = (totalRevenue / totalTx).toFixed(2);
  const soldUnits = TOP_PRODUCTS.reduce((acc, item) => acc + item.sold, 0);

  const categoryRevenue = { Botanas: 0, Bebidas: 0, Dulces: 0 };
  TOP_PRODUCTS.forEach((item) => {
    if (item.name.includes('Takis') || item.name.includes('Papas')) categoryRevenue.Botanas += item.revenue;
    else if (item.name.includes('Coca') || item.name.includes('Agua')) categoryRevenue.Bebidas += item.revenue;
    else categoryRevenue.Dulces += item.revenue;
  });

  container.innerHTML = `
    <div class="page-header"><h1>Estadisticas</h1><p>Rendimiento comercial del kiosco</p></div>

    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="card"><div class="card__title">Producto mas vendido</div><div class="card__value" style="font-size:20px">Takis Fuego</div><div>87 unidades</div></div>
      <div class="card"><div class="card__title">Producto mas pedido</div><div class="card__value" style="font-size:20px">Coca-Cola 600ml</div><div>61 ordenes</div></div>
      <div class="card"><div class="card__title">Turno mas rentable</div><div class="card__value" style="font-size:20px">Turno 2</div><div>$3,930</div></div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="card"><div class="card__title">Ingresos totales</div><div class="card__value card__value--amber">$${totalRevenue}</div></div>
      <div class="card"><div class="card__title">Ticket promedio</div><div class="card__value">$${avgTicket}</div></div>
      <div class="card"><div class="card__title">Unidades vendidas</div><div class="card__value">${soldUnits}</div></div>
    </div>

    <div class="toolbar">
      <input class="input" type="date" value="2025-05-12" />
      <input class="input" type="date" value="2025-05-18" />
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
      <div class="card"><canvas id="cat-chart" height="160"></canvas></div>
      <div class="card"><canvas id="shift-chart" height="160"></canvas></div>
    </div>

    <div class="table-card">
      <div class="table-card__header"><h2>Historial</h2></div>
      <table class="data-table">
        <thead><tr><th>Fecha</th><th>Total</th><th>Transacciones</th></tr></thead>
        <tbody>
          ${SALES_LAST_7_DAYS.map((row) => `<tr><td>${row.date}</td><td>$${row.total}</td><td>${row.transactions}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;

  new window.Chart(container.querySelector('#cat-chart'), {
    type: 'bar',
    data: {
      labels: Object.keys(categoryRevenue),
      datasets: [{
        data: Object.values(categoryRevenue),
        backgroundColor: ['#f5a623', '#2ecc71', '#3498db'],
      }],
    },
    options: { plugins: { legend: { display: false } } },
  });

  new window.Chart(container.querySelector('#shift-chart'), {
    type: 'bar',
    data: {
      labels: SHIFT_SALES.map((item) => item.shift),
      datasets: [{ data: SHIFT_SALES.map((item) => item.total), backgroundColor: '#f5a623' }],
    },
    options: { plugins: { legend: { display: false } } },
  });
}
