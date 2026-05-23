import { CUSTOMERS } from '../mock/data.js';

export function init(container, options) {
  const customers = CUSTOMERS.map((c) => ({ ...c }));
  let selected = null;

  function isMobilePortrait() {
    return window.matchMedia('(max-width: 640px)').matches;
  }

  function level(points) {
    if (points >= 300) return '<span class="badge badge--gold">Oro</span>';
    if (points >= 100) return '<span class="badge badge--silver">Plata</span>';
    return '<span class="badge badge--gray">Basico</span>';
  }

  function openDetailModal(customer) {
    const existing = document.querySelector('.customer-detail-modal');
    if (existing) existing.remove();
    const pct = Math.min(100, Math.round((customer.points / 300) * 100));
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay customer-detail-modal';
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal__header">
          <h3 style="margin:0">${customer.name}</h3>
          <button class="modal__close" id="close-detail">✕</button>
        </div>
        <div style="color:var(--text-muted);margin-bottom:12px">${customer.phone}</div>
        <div style="margin-bottom:10px">${level(customer.points)}</div>
        <div style="margin-bottom:6px">Puntos: <strong>${customer.points}</strong></div>
        <div class="progress" style="margin-bottom:12px">
          <div class="progress__fill" style="width:${pct}%"></div>
        </div>
        <div style="font-size:13px;color:var(--text-muted)">🍿 100 pts = snack gratis</div>
        <div style="font-size:13px;color:var(--text-muted)">💰 300 pts = 10% descuento</div>
        <div style="margin-top:16px">
          <div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Visitas</div>
          <div style="font-size:22px;font-weight:700">${customer.visits}</div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('#close-detail').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  }

  function openAdd() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal__header"><h3>Agregar cliente</h3><button class="modal__close" id="close-modal">✕</button></div>
        <div class="form-group"><label>Nombre</label><input class="input" id="f-name" /></div>
        <div class="form-group"><label>Telefono</label><input class="input" id="f-phone" /></div>
        <div class="modal__footer"><button class="btn btn--ghost" id="cancel-modal">Cancelar</button><button class="btn btn--primary" id="save-modal">Guardar</button></div>
      </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector('#close-modal').addEventListener('click', close);
    modal.querySelector('#cancel-modal').addEventListener('click', close);
    modal.querySelector('#save-modal').addEventListener('click', () => {
      const name = modal.querySelector('#f-name').value.trim();
      const phone = modal.querySelector('#f-phone').value.trim();
      if (!name || !phone) {
        options.toast('Datos incompletos');
        return;
      }
      customers.push({ id: Date.now(), name, phone, points: 0, visits: 0 });
      options.toast('Cliente agregado');
      close();
      render();
    });
  }

  function renderDetail() {
    if (isMobilePortrait()) return '';
    if (!selected) {
      return '<div class="side-panel" style="color:var(--text-muted);font-size:14px;display:flex;align-items:center;justify-content:center">👈 Selecciona un cliente</div>';
    }
    const pct = Math.min(100, Math.round((selected.points / 300) * 100));
    return `
      <div class="side-panel">
        <h3 style="margin-top:0">${selected.name}</h3>
        <div style="color:var(--text-muted);margin-bottom:12px">${selected.phone}</div>
        <div style="margin-bottom:10px">${level(selected.points)}</div>
        <div style="margin-bottom:6px">Puntos: <strong>${selected.points}</strong></div>
        <div class="progress" style="margin-bottom:12px">
          <div class="progress__fill" style="width:${pct}%"></div>
        </div>
        <div style="font-size:13px;color:var(--text-muted)">🍿 100 pts = snack gratis</div>
        <div style="font-size:13px;color:var(--text-muted)">💰 300 pts = 10% descuento</div>
        <div style="margin-top:16px">
          <div style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">Visitas</div>
          <div style="font-size:22px;font-weight:700">${selected.visits}</div>
        </div>
      </div>
    `;
  }

  function render() {
    container.innerHTML = `
      <div class="page-header"><h1>Clientes</h1><p>Fidelizacion</p></div>
      <div class="customer-layout">
        <div>
          <div class="table-card">
            <div class="table-card__header"><h2>Lista</h2><button class="btn btn--primary" id="add-customer">+ Agregar</button></div>
            <table class="data-table">
              <thead><tr><th>Nombre</th><th>Telefono</th><th>Puntos</th><th>Visitas</th><th>Nivel</th><th></th></tr></thead>
              <tbody>
                ${customers.map((c) => `<tr><td>${c.name}</td><td>${c.phone}</td><td>${c.points}</td><td>${c.visits}</td><td>${level(c.points)}</td><td><button class="btn btn--ghost btn--sm" data-view="${c.id}">Ver</button></td></tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>
        ${renderDetail()}
      </div>
    `;

    container.querySelector('#add-customer').addEventListener('click', openAdd);
    container.querySelectorAll('[data-view]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const customer = customers.find((c) => c.id === Number(btn.dataset.view)) || null;
        if (isMobilePortrait()) {
          if (customer) openDetailModal(customer);
        } else {
          selected = customer;
          render();
        }
      });
    });
  }

  render();
}
