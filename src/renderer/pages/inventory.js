import { PRODUCTS } from '../mock/data.js';

export function init(container, options) {
  const products = PRODUCTS.map((p) => ({ ...p }));
  let q = '';

  function badge(p) {
    if (p.stock === 0) return '<span class="badge badge--red">Agotado</span>';
    if (p.stock <= p.minStock) return '<span class="badge badge--amber">Bajo</span>';
    return '<span class="badge badge--green">OK</span>';
  }

  function openForm(target) {
    const row = target || { id: Date.now(), name: '', category: 'Botanas', price: 0, stock: 0, minStock: 0 };
    const isNew = !target;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal__header"><h3>${isNew ? 'Agregar' : 'Editar'} producto</h3><button class="modal__close" id="close-modal">x</button></div>
        <div class="form-group"><label>Nombre</label><input class="input" id="f-name" value="${row.name}" /></div>
        <div class="form-group"><label>Categoria</label><input class="input" id="f-cat" value="${row.category}" /></div>
        <div class="form-group"><label>Precio</label><input class="input" id="f-price" type="number" value="${row.price}" /></div>
        <div class="form-group"><label>Stock</label><input class="input" id="f-stock" type="number" value="${row.stock}" /></div>
        <div class="form-group"><label>Stock minimo</label><input class="input" id="f-min" type="number" value="${row.minStock}" /></div>
        <div class="modal__footer"><button class="btn btn--ghost" id="cancel-modal">Cancelar</button><button class="btn btn--primary" id="save-modal">Guardar</button></div>
      </div>
    `;
    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('#close-modal').addEventListener('click', close);
    modal.querySelector('#cancel-modal').addEventListener('click', close);
    modal.querySelector('#save-modal').addEventListener('click', () => {
      row.name = modal.querySelector('#f-name').value.trim();
      row.category = modal.querySelector('#f-cat').value.trim();
      row.price = Number(modal.querySelector('#f-price').value || 0);
      row.stock = Number(modal.querySelector('#f-stock').value || 0);
      row.minStock = Number(modal.querySelector('#f-min').value || 0);
      if (!row.name) {
        options.toast('Nombre requerido');
        return;
      }
      if (isNew) products.push(row);
      options.toast(isNew ? 'Producto agregado' : 'Producto actualizado');
      close();
      render();
    });
  }

  function render() {
    const rows = products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase()));
    container.innerHTML = `
      <div class="page-header"><h1>Inventario</h1><p>Control de stock</p></div>
      <div class="toolbar"><input class="input" id="search" placeholder="Buscar producto" value="${q}" /><button class="btn btn--primary" id="add-row">Agregar producto</button></div>
      <div class="table-card">
        <table class="data-table">
          <thead><tr><th>Producto</th><th>Categoria</th><th>Precio</th><th>Stock</th><th>Stock Min</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            ${rows.map((row) => `<tr><td>${row.name}</td><td>${row.category}</td><td>$${row.price}</td><td>${row.stock}</td><td>${row.minStock}</td><td>${badge(row)}</td><td><button class="btn btn--icon btn--sm" data-dec="${row.id}">-</button><button class="btn btn--icon btn--sm" data-inc="${row.id}">+</button><button class="btn btn--ghost btn--sm" data-edit="${row.id}">Editar</button></td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    `;

    container.querySelector('#search').addEventListener('input', (event) => {
      q = event.target.value;
      render();
    });

    container.querySelector('#add-row').addEventListener('click', () => openForm(null));
    container.querySelectorAll('[data-dec]').forEach((btn) => btn.addEventListener('click', () => {
      const row = products.find((p) => p.id === Number(btn.dataset.dec));
      if (row) row.stock = Math.max(0, row.stock - 1);
      render();
    }));
    container.querySelectorAll('[data-inc]').forEach((btn) => btn.addEventListener('click', () => {
      const row = products.find((p) => p.id === Number(btn.dataset.inc));
      if (row) row.stock += 1;
      render();
    }));
    container.querySelectorAll('[data-edit]').forEach((btn) => btn.addEventListener('click', () => {
      const row = products.find((p) => p.id === Number(btn.dataset.edit));
      if (row) openForm(row);
    }));
  }

  render();
}
