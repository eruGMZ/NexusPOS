import { SALES_LAST_7_DAYS, TOP_PRODUCTS } from '../mock/data.js';

export function init(container) {
  const totalRevenue = SALES_LAST_7_DAYS.reduce((s, d) => s + d.total, 0);
  const totalTx      = SALES_LAST_7_DAYS.reduce((s, d) => s + d.transactions, 0);
  const avgTicket    = (totalRevenue / totalTx).toFixed(2);
  const totalUnits   = TOP_PRODUCTS.reduce((s, p) => s + p.sold, 0);

  // Category breakdown from TOP_PRODUCTS + PRODUCTS category mapping
  const catData = { Botanas: 0, Bebidas: 0, Dulces: 0 };
  const catMap  = {
    'Takis Fuego': 'Botanas', 'Coca-Cola 600ml': 'Bebidas',
    'Papas Sabritas': 'Botanas', 'Gansito Marinela': 'Dulces', 'Agua Ciel 500ml': 'Bebidas',
  };
  TOP_PRODUCTS.forEach(p => {
    const cat = catMap[p.name] || 'Otros';
    if (catData[cat] !== undefined) catData[cat] += p.revenue;
  });

  container.innerHTML = `
    <div class="page-header">
      <h1>Reportes</h1>
      <p>Análisis del período</p>
    </div>

    <div style="display:flex;gap:12px;align-items:center;margin-bottom:24px">
      <div class="form-group" style="flex-direction:row;align-items:center;gap:8px">
        <label style="white-space:nowrap;color:var(--text-sec);font-size:13px">Desde</label>
        <input class="input" type="date" value="2025-05-12" />
      </div>
      <div class="form-group" style="flex-direction:row;align-items:center;gap:8px">
        <label style="white-space:nowrap;color:var(--text-sec);font-size:13px">Hasta</label>
        <input class="input" type="date" value="2025-05-18" />
      </div>
      <button class="btn btn--ghost btn--sm" style="margin-top:0">Aplicar filtro</button>
    </div>

    <div class="reports-grid">
      <div class="card">
        <div class="card__title">Ingresos totales</div>
        <div class="card__value card__value--amber">$${totalRevenue.toLocaleString()}</div>
        <div class="card__sub">Últimos 7 días</div>
      </div>
      <div class="card">
        <div class="card__title">Ticket promedio</div>
        <div class="card__value">$${avgTicket}</div>
        <div class="card__sub">${totalTx} transacciones</div>
      </div>
      <div class="card">
        <div class="card__title">Unidades vendidas</div>
        <div class="card__value">${totalUnits}</div>
        <div class="card__sub">Top 5 productos</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">
      <div class="chart-card" style="margin-bottom:0">
        <h2>Ventas por categoría</h2>
        <canvas id="catChart" height="200"></canvas>
      </div>
      <div class="chart-card" style="margin-bottom:0">
        <h2>Transacciones diarias</h2>
        <canvas id="txChart" height="200"></canvas>
      </div>
    </div>

    <div class="table-card">
      <div class="table-card__header">
        <h2>Historial de ventas</h2>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Fecha</th><th>Total</th><th>Transacciones</th><th>Ticket promedio</th>
          </tr>
        </thead>
        <tbody>
          ${[...SALES_LAST_7_DAYS].reverse().map(d => `
            <tr>
              <td>${d.date}</td>
              <td style="color:var(--accent);font-weight:700">$${d.total.toLocaleString()}</td>
              <td>${d.transactions}</td>
              <td>$${(d.total / d.transactions).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Category bar chart
  const ctxCat = container.querySelector('#catChart').getContext('2d');
  new window.Chart(ctxCat, {
    type: 'bar',
    data: {
      labels: Object.keys(catData),
      datasets: [{
        label: 'Ingreso ($)',
        data: Object.values(catData),
        backgroundColor: ['rgba(245,166,35,0.75)', 'rgba(46,204,113,0.75)', 'rgba(52,152,219,0.75)'],
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1E1E25',
          bodyColor: '#fff',
          borderColor: '#2A2A35',
          borderWidth: 1,
          callbacks: { label: ctx => ` $${ctx.parsed.y.toLocaleString()}` },
        },
      },
      scales: {
        x: { grid: { color: '#2A2A35' }, ticks: { color: '#8B8B9A' } },
        y: { grid: { color: '#2A2A35' }, ticks: { color: '#8B8B9A', callback: v => `$${v}` } },
      },
    },
  });

  // Transactions line chart
  const ctxTx = container.querySelector('#txChart').getContext('2d');
  new window.Chart(ctxTx, {
    type: 'bar',
    data: {
      labels: SALES_LAST_7_DAYS.map(d => {
        const [, , day] = d.date.split('-');
        return `May ${parseInt(day)}`;
      }),
      datasets: [{
        label: 'Transacciones',
        data: SALES_LAST_7_DAYS.map(d => d.transactions),
        backgroundColor: 'rgba(52,152,219,0.7)',
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1E1E25',
          bodyColor: '#fff',
          borderColor: '#2A2A35',
          borderWidth: 1,
        },
      },
      scales: {
        x: { grid: { color: '#2A2A35' }, ticks: { color: '#8B8B9A' } },
        y: { grid: { color: '#2A2A35' }, ticks: { color: '#8B8B9A', stepSize: 5 } },
      },
    },
  });
}
