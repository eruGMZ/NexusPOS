import { EMPLOYEES, AppRole } from '../mock/data.js';

export function init(container, options) {
  const employees = EMPLOYEES.map((item) => ({ ...item }));

  function openForm(employee) {
    const editing = Boolean(employee);
    const row = employee || { id: Date.now(), name: '', role: AppRole.Vendedor, status: 'Activo', lastLogin: '-' };

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal__header"><h3>${editing ? 'Editar' : 'Agregar'} empleado</h3><button class="modal__close" id="emp-close">x</button></div>
        <div class="form-group"><label>Nombre</label><input class="input" id="emp-name" value="${row.name}" /></div>
        <div class="form-group"><label>Rol</label><select class="input" id="emp-role"><option ${row.role === AppRole.Admin ? 'selected' : ''}>Admin</option><option ${row.role === AppRole.Vendedor ? 'selected' : ''}>Vendedor</option></select></div>
        <div class="form-group"><label>Estado</label><select class="input" id="emp-status"><option ${row.status === 'Activo' ? 'selected' : ''}>Activo</option><option ${row.status === 'Inactivo' ? 'selected' : ''}>Inactivo</option></select></div>
        <div class="modal__footer"><button class="btn btn--ghost" id="emp-cancel">Cancelar</button><button class="btn btn--primary" id="emp-save">Guardar</button></div>
      </div>
    `;

    document.body.appendChild(modal);
    const close = () => modal.remove();

    modal.querySelector('#emp-close').addEventListener('click', close);
    modal.querySelector('#emp-cancel').addEventListener('click', close);
    modal.querySelector('#emp-save').addEventListener('click', () => {
      row.name = modal.querySelector('#emp-name').value.trim();
      row.role = modal.querySelector('#emp-role').value;
      row.status = modal.querySelector('#emp-status').value;
      if (!row.name) {
        options.toast('Nombre requerido');
        return;
      }
      if (!editing) employees.push(row);
      options.toast(editing ? 'Empleado actualizado' : 'Empleado agregado');
      close();
      render();
    });
  }

  function render() {
    container.innerHTML = `
      <div class="page-header"><h1>Empleados</h1><p>Control de accesos y estado</p></div>
      <div class="table-card">
        <div class="table-card__header"><h2>Equipo</h2><button class="btn btn--primary" id="add-emp">Agregar empleado</button></div>
        <table class="data-table">
          <thead><tr><th>Nombre</th><th>Rol</th><th>Estado</th><th>Ultimo acceso</th><th>Acciones</th></tr></thead>
          <tbody>
            ${employees.map((row) => `<tr><td>${row.name}</td><td>${row.role}</td><td><span class="badge ${row.status === 'Activo' ? 'badge--green' : 'badge--gray'}">${row.status}</span></td><td>${row.lastLogin}</td><td><button class="btn btn--ghost btn--sm" data-id="${row.id}">Editar</button></td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    `;

    container.querySelector('#add-emp').addEventListener('click', () => openForm(null));
    container.querySelectorAll('[data-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = employees.find((item) => item.id === Number(btn.dataset.id));
        if (row) openForm(row);
      });
    });
  }

  render();
}
