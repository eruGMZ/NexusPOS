import { CUSTOMERS } from '../mock/data.js';

export function init(container, options) {
  const customers = CUSTOMERS.map((c) => ({ ...c }));
  let selected = null;

  function level(points) {
    if (points >= 300) return '<span class="badge badge--gold">Oro</span>';
    if (points >= 100) return '<span class="badge badge--silver">Plata</span>';
    return '<span class="badge badge--gray">Basico</span>';
  }

  function openAdd() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal__header"><h3>Agregar cliente</h3><button class="modal__close" id="close-modal">x</button></div>
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
    if (!selected) {
      return '<div class="side-panel">Selecciona un cliente para ver detalle</div>';
    }
    const pct = Math.min(100, Math.round((selected.points / 300) * 100));
    return `
      <div class="side-panel">
        <h3 style="margin-top:0">${selected.name}</h3>
        <div>${selected.phone}</div>
        <div style="margin:10px 0">${level(selected.points)}</div>
        <div style="margin-bottom:6px">Puntos: ${selected.points}</div>
        <div class="progress"><div class="progress__fill" style="width:${pct}%"></div></div>
        <div style="margin-top:12px">100 pts = snack gratis</div>
        <div>300 pts = 10% descuento</div>
      </div>
    `;
  }

  function render() {
    container.innerHTML = `
      <div class="page-header"><h1>Clientes</h1><p>Fidelizacion</p></div>
      <div class="customer-layout">
        <div>
          <div class="table-card">
            <div class="table-card__header"><h2>Lista</h2><button class="btn btn--primary" id="add-customer">Agregar cliente</button></div>
            <table class="data-table">
              <thead><tr><th>Nombre</th><th>Telefono</th><th>Puntos</th><th>Visitas</th><th>Nivel</th><th>Acciones</th></tr></thead>
              <tbody>
                ${customers.map((c) => `<tr><td>${c.name}</td><td>${c.phone}</td><td>${c.points}</td><td>${c.visits}</td><td>${level(c.points)}</td><td><button class="btn btn--ghost btn--sm" data-view="${c.id}">Ver detalle</button></td></tr>`).join('')}
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
        selected = customers.find((c) => c.id === Number(btn.dataset.view)) || null;
        render();
      });
    });
  }

  render();
}
