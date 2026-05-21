let lastTooltipTimer = null;

function money(v) {
  return `$${Number(v).toFixed(2)}`;
}

export function show(saleData, currentUser, helpers) {
  const ticketNo = String(helpers.getNextTicketNumber()).padStart(5, '0');
  const now = new Date();
  const activeShift = helpers.getActiveShift();
  const shiftLabel = activeShift ? `Turno ${activeShift.shiftNumber}` : 'Sin turno';

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay ticket-overlay';

  const subtotal = saleData.items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const discountAmount = subtotal * (saleData.discount / 100);
  const total = subtotal - discountAmount;

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal__header"><h3>Ticket de venta</h3><button class="modal__close" id="ticket-close-x">x</button></div>
      <div class="ticket-paper">
        <div style="text-align:center;font-weight:700">SnackPOS</div>
        <div class="ticket-line"><span>${now.toLocaleDateString('es-MX')}</span><span>${now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</span></div>
        <div class="ticket-line"><span>Ticket #${ticketNo}</span><span>${shiftLabel}</span></div>
        <hr />
        <div>Cajero: ${currentUser.displayName}</div>
        <hr />
        ${saleData.items.map((item) => `<div class="ticket-line"><span>${item.name} x${item.qty}</span><span>${money(item.qty * item.price)}</span></div>`).join('')}
        <hr />
        <div class="ticket-line"><span>Subtotal</span><span>${money(subtotal)}</span></div>
        ${saleData.discount > 0 ? `<div class="ticket-line"><span>Descuento</span><span>-${money(discountAmount)}</span></div>` : ''}
        <div class="ticket-line"><strong>Total</strong><strong>${money(total)}</strong></div>
        <div class="ticket-line"><span>Metodo</span><span>${saleData.paymentMethod}</span></div>
        ${saleData.paymentMethod === 'Efectivo' ? `<div class="ticket-line"><span>Entregado</span><span>${money(saleData.cashGiven)}</span></div><div class="ticket-line"><span>Cambio</span><span>${money(Math.max(0, saleData.cashGiven - total))}</span></div>` : ''}
        ${saleData.customer ? `<hr /><div>Puntos ganados: +${saleData.pointsEarned} pts</div><div>Saldo: ${saleData.customer.points + saleData.pointsEarned} pts</div>` : ''}
        <hr />
        <div style="text-align:center">Gracias por tu compra</div>
      </div>
      <div class="modal__footer">
        <button class="btn btn--ghost" id="ticket-print">Imprimir</button>
        <button class="btn btn--primary" id="ticket-close">Cerrar</button>
      </div>
      <div id="ticket-tooltip" style="display:none;color:var(--text-muted);font-size:12px">Impresora no configurada en modo demo</div>
    </div>
  `;

  document.body.appendChild(overlay);
  const close = () => overlay.remove();

  overlay.querySelector('#ticket-close-x').addEventListener('click', close);
  overlay.querySelector('#ticket-close').addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });

  overlay.querySelector('#ticket-print').addEventListener('click', () => {
    const tip = overlay.querySelector('#ticket-tooltip');
    tip.style.display = 'block';
    if (lastTooltipTimer) clearTimeout(lastTooltipTimer);
    lastTooltipTimer = setTimeout(() => {
      if (tip) tip.style.display = 'none';
    }, 1700);
  });
}
