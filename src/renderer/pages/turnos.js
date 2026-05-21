import { SHIFTS, ShiftStatus } from '../mock/data.js';

function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function init(container, options) {
  const rows = SHIFTS.map((s) => ({ ...s }));
  let activeShift = options.getActiveShift();

  function render() {
    container.innerHTML = `
      <div class="page-header"><h1>Turnos</h1><p>Gestion de apertura y cierre</p></div>
      <div class="kpi-grid" style="grid-template-columns:380px 1fr">
        <div class="card">
          <div class="card__title">Turno activo</div>
          ${activeShift
            ? `<div class="card__value" style="font-size:20px">Turno ${activeShift.shiftNumber}</div>
               <div>Abierto por ${activeShift.openedBy}</div>
               <div>Apertura ${activeShift.openTime}</div>
               <div>Total en curso $640</div>
               <button class="btn btn--danger btn--full" id="close-shift">Cerrar Turno</button>`
            : `<div style="margin:10px 0">No hay turno activo</div>
               <div class="form-group"><label>Fondo inicial</label><input class="input" id="shift-float" type="number" value="500" /></div>
               <button class="btn btn--primary btn--full" id="open-shift">Iniciar Turno</button>`}
        </div>
        <div class="table-card">
          <div class="table-card__header"><h2>Historial de turnos</h2></div>
          <table class="data-table">
            <thead><tr><th>Fecha</th><th>Turno</th><th>Abierto por</th><th>Apertura</th><th>Cierre</th><th>Total</th></tr></thead>
            <tbody>
              ${rows.map((row) => `<tr><td>${row.date}</td><td>${row.shiftNumber}</td><td>${row.openedBy}</td><td>${row.openTime}</td><td>${row.closeTime || '-'}</td><td>$${row.totalSales}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    if (!activeShift) {
      container.querySelector('#open-shift').addEventListener('click', () => {
        const initialFloat = Number(container.querySelector('#shift-float').value || 0);
        const nextShiftNumber = rows.length > 0 ? ((rows[rows.length - 1].shiftNumber % 2) + 1) : 1;
        activeShift = {
          id: Date.now(),
          date: today(),
          shiftNumber: nextShiftNumber,
          openedBy: options.currentUser.displayName,
          openTime: nowHHMM(),
          closeTime: '',
          initialFloat,
          totalSales: 640,
          status: ShiftStatus.Open,
        };
        options.setActiveShift(activeShift);
        options.toast('Turno iniciado');
        render();
      });
      return;
    }

    container.querySelector('#close-shift').addEventListener('click', () => {
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal">
          <div class="modal__header"><h3>Cerrar turno</h3><button class="modal__close" id="close-modal">x</button></div>
          <div>Total ventas: $${activeShift.totalSales}</div>
          <div>Fondo inicial: $${activeShift.initialFloat}</div>
          <div>Esperado: $${activeShift.initialFloat + activeShift.totalSales}</div>
          <div class="modal__footer">
            <button class="btn btn--ghost" id="cancel-modal">Cancelar</button>
            <button class="btn btn--primary" id="confirm-close">Confirmar</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeModal = () => modal.remove();
      modal.querySelector('#close-modal').addEventListener('click', closeModal);
      modal.querySelector('#cancel-modal').addEventListener('click', closeModal);
      modal.querySelector('#confirm-close').addEventListener('click', () => {
        rows.unshift({
          ...activeShift,
          closeTime: nowHHMM(),
          status: ShiftStatus.Closed,
        });
        activeShift = null;
        options.setActiveShift(null);
        options.toast('Turno cerrado');
        closeModal();
        render();
      });
    });
  }

  render();
}
