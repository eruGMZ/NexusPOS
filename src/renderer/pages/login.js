import { USERS } from '../mock/data.js';

export function init(container, options) {
  container.innerHTML = `
    <div class="login-card">
      <h1>SnackPOS</h1>
      <p>Acceso al sistema</p>
      <div class="form-group">
        <label>Usuario</label>
        <input class="input" id="login-user" placeholder="admin o vendedor" />
      </div>
      <div class="form-group">
        <label>Contrasena</label>
        <input class="input" id="login-pass" type="password" placeholder="********" />
      </div>
      <div class="error-inline" id="login-error" style="display:none"></div>
      <button class="btn btn--primary btn--full" id="login-btn">Iniciar sesion</button>
    </div>
  `;

  const userInput = container.querySelector('#login-user');
  const passInput = container.querySelector('#login-pass');
  const errorEl = container.querySelector('#login-error');

  function submit() {
    const username = userInput.value.trim();
    const password = passInput.value.trim();
    const user = USERS.find((u) => u.username === username && u.password === password);
    if (!user) {
      errorEl.textContent = 'Usuario o contrasena incorrectos';
      errorEl.style.display = 'block';
      return;
    }
    errorEl.style.display = 'none';
    options.onLogin(user);
  }

  container.querySelector('#login-btn').addEventListener('click', submit);
  passInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') submit();
  });
}
