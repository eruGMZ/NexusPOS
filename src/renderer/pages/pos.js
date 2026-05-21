import { PRODUCTS, CUSTOMERS } from '../mock/data.js';
import { show } from './ticket.js';

function money(v) {
  return `$${v.toFixed(2)}`;
}

export function init(container, options) {
  const cart = [];
  let paymentMethod = 'Efectivo';
  let selectedCustomerId = '';
  let discount = 0;
  let cashGiven = 0;

  function getTotal() {
    const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
    return subtotal - subtotal * (discount / 100);
  }

  function render() {
    container.innerHTML = `
      <div class="page-header"><h1>Punto de Venta</h1><p>Cobro rapido</p></div>
      <div class="pos-layout">
        <div>
          <div class="products-grid">
            ${PRODUCTS.map((p) => `<div class="product-card"><div>${p.category}</div><div style="font-weight:700">${p.name}</div><div style="margin:6px 0">$${p.price}</div><button class="product-card__add" data-add="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>+</button></div>`).join('')}
          </div>
        </div>

        <div class="pos-cart">
          <div class="table-card__header"><h2>Carrito</h2></div>
          <div class="pos-cart__items">
            ${cart.length === 0 ? '<div style="padding:14px;color:var(--text-muted)">Sin productos</div>' : cart.map((item) => `<div class="cart-item"><div>${item.name}</div><div><button class="btn btn--icon btn--sm" data-dec="${item.id}">-</button> ${item.qty} <button class="btn btn--icon btn--sm" data-inc="${item.id}">+</button></div><div>${money(item.qty * item.price)}</div><button class="btn btn--icon btn--sm" data-rm="${item.id}">x</button></div>`).join('')}
          </div>
          <div style="padding:12px;border-top:1px solid var(--border)">
            <div class="form-group"><label>Cliente</label><select class="input" id="customer-select"><option value="">Sin cliente</option>${CUSTOMERS.map((c) => `<option value="${c.id}" ${String(c.id) === selectedCustomerId ? 'selected' : ''}>${c.name}</option>`).join('')}</select></div>
            <div class="form-group"><label>Pago</label><select class="input" id="pay-select"><option ${paymentMethod === 'Efectivo' ? 'selected' : ''}>Efectivo</option><option ${paymentMethod === 'Tarjeta' ? 'selected' : ''}>Tarjeta</option></select></div>
            <div class="form-group"><label>Descuento %</label><input class="input" id="discount-input" type="number" min="0" max="100" value="${discount}" /></div>
            ${paymentMethod === 'Efectivo' ? '<div class="form-group"><label>Efectivo entregado</label><input class="input" id="cash-given" type="number" min="0" value="' + cashGiven + '" /></div>' : ''}
            <div style="display:flex;justify-content:space-between;margin:10px 0"><strong>Total</strong><strong>${money(getTotal())}</strong></div>
            <button class="btn btn--primary btn--full" id="charge-btn">COBRAR</button>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-add]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const product = PRODUCTS.find((item) => item.id === Number(btn.dataset.add));
        const found = cart.find((item) => item.id === product.id);
        if (found) found.qty += 1;
        else cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
        render();
      });
    });

    container.querySelectorAll('[data-inc]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = cart.find((item) => item.id === Number(btn.dataset.inc));
        if (row) row.qty += 1;
        render();
      });
    });

    container.querySelectorAll('[data-dec]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = cart.find((item) => item.id === Number(btn.dataset.dec));
        if (row) row.qty -= 1;
        if (row && row.qty <= 0) cart.splice(cart.indexOf(row), 1);
        render();
      });
    });

    container.querySelectorAll('[data-rm]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const row = cart.find((item) => item.id === Number(btn.dataset.rm));
        if (row) cart.splice(cart.indexOf(row), 1);
        render();
      });
    });

    container.querySelector('#customer-select').addEventListener('change', (event) => {
      selectedCustomerId = event.target.value;
    });

    container.querySelector('#pay-select').addEventListener('change', (event) => {
      paymentMethod = event.target.value;
      render();
    });

    container.querySelector('#discount-input').addEventListener('input', (event) => {
      discount = Math.max(0, Math.min(100, Number(event.target.value || 0)));
      render();
    });

    const cashInput = container.querySelector('#cash-given');
    if (cashInput) {
      cashInput.addEventListener('input', (event) => {
        cashGiven = Number(event.target.value || 0);
      });
    }

    container.querySelector('#charge-btn').addEventListener('click', () => {
      if (cart.length === 0) {
        options.toast('Agrega productos al carrito');
        return;
      }

      const customer = CUSTOMERS.find((item) => String(item.id) === selectedCustomerId) || null;
      const saleData = {
        items: cart.map((item) => ({ ...item })),
        paymentMethod,
        discount,
        cashGiven,
        customer,
        pointsEarned: customer ? Math.floor(getTotal() / 10) : 0,
      };

      show(saleData, options.currentUser, {
        getNextTicketNumber: options.getNextTicketNumber,
        getActiveShift: options.getActiveShift,
      });

      cart.splice(0, cart.length);
      discount = 0;
      selectedCustomerId = '';
      cashGiven = 0;
      options.toast('Venta registrada');
      render();
    });
  }

  render();
}
