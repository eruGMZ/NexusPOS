import { CASH_CUTS } from '../mock/data.js';
import { showToast } from '../app.js';

export function init(container) {
  const cuts = CASH_CUTS.map(c => ({ ...c }));
  let isOpen = false;
  let openTime = null;
  let initialCash = 0;
  const MOCK_SALES = 640; // simulated sales total while open

  function pad(n) { return String(n).padStart(2, '0'); }
  function nowTime() {
    const d = new Date();
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  function todayDate() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  }

  function openCutModal() {
    const total = initialCash + MOCK_SALES;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal__header">
          <h3>Resumen de cierre</h3>
          <button class="modal__close" id="modal-close">✕</button>
        </div>
        <div class="modal__body">
          <div style="display:flex;flex-direction:column;gap:10px">
            <div class="cash-stat-row" style="padding-bottom:10px;border-bottom:1px solid var(--border)">
              <span class="cash-stat-label">Apertura</span>
              <span class="cash-stat-value">${openTime}</span>
            </div>
            <div class="cash-stat-row" style="padding-bottom:10px;border-bottom:1px solid var(--border)">
              <span class="cash-stat-label">Cierre</span>
              <span class="cash-stat-value">${nowTime()}</span>
            </div>
            <div class="cash-stat-row" style="padding-bottom:10px;border-bottom:1px solid var(--border)">
              <span class="cash-stat-label">Fondo inicial</span>
              <span class="cash-stat-value">$${initialCash}</span>
            </div>
            <div class="cash-stat-row" style="padding-bottom:10px;border-bottom:1px solid var(--border)">
              <span class="cash-stat-label">Ventas del día</span>
              <span class="cash-stat-value" style="color:var(--green)">$${MOCK_SALES}</span>
            </div>
            <div class="cash-stat-row" style="padding-bottom:0;border-bottom:none">
              <span class="cash-stat-label" style="font-weight:700;color:var(--text)">Total esperado</span>
              <span class="cash-stat-value" style="font-size:20px;color:var(--accent)">$${total}</span>
            </div>
          </div>
        </div>
        <div class="modal__footer">
          <button class="btn btn--ghost" id="modal-cancel">Cancelar</button>
          <button class="btn btn--primary" id="modal-confirm">Confirmar cierre</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('#modal-close').addEventListener('click', close);
    overlay.querySelector('#modal-cancel').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    overlay.querySelector('#modal-confirm').addEventListener('click', () => {
      cuts.unshift({
        date: todayDate(),
        opened: openTime,
        closed: nowTime(),
        initial: initialCash,
        sales: MOCK_SALES,
        total,
      });
      isOpen = false;
      openTime = null;
      initialCash = 0;
      close();
      render();
      showToast('Caja cerrada correctamente');
    });
  }

  function render() {
    container.innerHTML = `
      <div class="page-header">
        <h1>Caja</h1>
        <p>Control de apertura y cierre de caja</p>
      </div>
      <div class="cash-layout">
        <!-- Status card -->
        <div class="cash-status-card">
          <div style="display:flex;align-items:center;justify-content:space-between">
            <span style="font-size:15px;font-weight:700">Estado de caja</span>
            <span class="badge ${isOpen ? 'badge--green' : 'badge--red'}">${isOpen ? 'Abierta' : 'Cerrada'}</span>
          </div>

          ${isOpen ? `
            <div>
              <div class="cash-stat-row">
                <span class="cash-stat-label">Apertura</span>
                <span class="cash-stat-value">${openTime}</span>
              </div>
              <div class="cash-stat-row">
                <span class="cash-stat-label">Fondo inicial</span>
                <span class="cash-stat-value">$${initialCash}</span>
              </div>
              <div class="cash-stat-row">
                <span class="cash-stat-label">Ventas (simulado)</span>
                <span class="cash-stat-value" style="color:var(--green)">$${MOCK_SALES}</span>
              </div>
              <div class="cash-stat-row" style="border-bottom:none">
                <span class="cash-stat-label"><strong>Total esperado</strong></span>
                <span class="cash-stat-value" style="color:var(--accent);font-size:18px">$${initialCash + MOCK_SALES}</span>
              </div>
            </div>
            <button class="btn btn--danger btn--full" id="close-cash-btn">Cerrar caja</button>
          ` : `
            <div class="form-group">
              <label>Fondo inicial ($)</label>
              <input class="input" id="initial-cash-input" type="number" min="0" placeholder="500" value="500" />
            </div>
            <button class="btn btn--primary btn--full" id="open-cash-btn">Abrir caja</button>
          `}
        </div>

        <!-- History -->
        <div>
          <div class="table-card">
            <div class="table-card__header">
              <h2>Historial de cortes</h2>
            </div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fecha</th><th>Apertura</th><th>Cierre</th>
                  <th>Fondo inicial</th><th>Ventas</th><th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${cuts.map(c => `
                  <tr>
                    <td>${c.date}</td>
                    <td>${c.opened}</td>
                    <td>${c.closed}</td>
                    <td>$${c.initial}</td>
                    <td style="color:var(--green);font-weight:600">$${c.sales}</td>
                    <td style="color:var(--accent);font-weight:700">$${c.total}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    if (isOpen) {
      container.querySelector('#close-cash-btn').addEventListener('click', openCutModal);
    } else {
      container.querySelector('#open-cash-btn').addEventListener('click', () => {
        const val = Number(container.querySelector('#initial-cash-input').value) || 0;
        initialCash = val;
        openTime = nowTime();
        isOpen = true;
        render();
        showToast('Caja abierta');
      });
    }
  }

  render();
}
