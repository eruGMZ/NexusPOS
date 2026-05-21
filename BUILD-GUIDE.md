# Guía de compilación y empaquetado — Electron Forge

Este documento describe cómo funciona el motor de compilación y empaquetado de este proyecto
(app de escritorio con **Electron + Electron Forge**) y cómo replicarlo en un proyecto nuevo.

---

## Tecnologías involucradas

| Componente | Rol |
|---|---|
| [Electron](https://www.electronjs.org/) | Motor de la app de escritorio (Chromium + Node.js) |
| [Electron Forge](https://www.electronforge.io/) | Herramienta de build, packaging y distribución |
| [Maker Squirrel](https://www.electronforge.io/config/makers/squirrel.windows) | Genera instalador `.exe` para Windows (con desinstalador automático) |
| [electron-squirrel-startup](https://github.com/mongodb-js/electron-squirrel-startup) | Maneja los eventos de instalación/desinstalación de Squirrel en `main.js` |
| [ASAR](https://www.electronjs.org/docs/latest/tutorial/asar-archives) | Empaqueta el código fuente en un archivo comprimido/seguro dentro del instalador |
| [Fuses Plugin](https://www.electronforge.io/config/plugins/fuses) | Bloquea flags de seguridad de Electron en tiempo de empaquetado |

---

## Estructura mínima de archivos

```
mi-proyecto/
├── main.js          ← Proceso principal de Electron (entry point)
├── index.html       ← UI de la aplicación
├── styles.css       ← Estilos
├── app.js           ← Lógica de la UI (renderer)
├── package.json     ← Configuración del proyecto y scripts
└── forge.config.js  ← Configuración de Electron Forge (makers, plugins)
```

---

## Replicar el proyecto desde cero

### 1. Inicializar el proyecto

```bash
npm init -y
```

### 2. Instalar Electron Forge y dependencias

```bash
npm install --save-dev @electron-forge/cli
npx electron-forge import
```

> `electron-forge import` detecta el proyecto existente y agrega los makers y scripts necesarios en `package.json`.

O bien, instalar todo manualmente:

```bash
npm install --save-dev @electron-forge/cli @electron-forge/maker-squirrel @electron-forge/maker-zip @electron-forge/maker-deb @electron-forge/maker-rpm @electron-forge/plugin-auto-unpack-natives @electron-forge/plugin-fuses @electron/fuses electron
npm install --save electron-squirrel-startup
```

### 3. Scripts en `package.json`

```json
"scripts": {
  "start":   "electron . --disable-gpu --no-sandbox",
  "package": "electron-forge package",
  "make":    "electron-forge make"
}
```

| Script | Qué hace |
|---|---|
| `npm start` | Lanza la app en modo desarrollo (sin compilar) |
| `npm run package` | Empaqueta la app en una carpeta `out/` (sin generar instalador) |
| `npm run make` | Genera el instalador distribuible en `out/make/` |

### 4. Archivo `forge.config.js`

Copiar y adaptar:

```js
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,              // Empaqueta el código en un archivo .asar (recomendado)
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'Tu Nombre o Empresa',
        description: 'Descripción de tu app',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],   // ZIP para macOS
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},              // .deb para Linux Debian/Ubuntu
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},              // .rpm para Linux Fedora/RedHat
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
```

### 5. Manejo de instalación/desinstalación en `main.js`

Al inicio del proceso principal **deben** manejarse los eventos de Squirrel, condicionando por plataforma para evitar errores en Linux/macOS o entornos donde el paquete no esté disponible:

```js
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Maneja eventos de instalacion/desinstalacion de Squirrel en Windows
if (process.platform === 'win32') {
  try {
    if (require('electron-squirrel-startup')) app.quit();
  } catch {
    // En Linux/macOS o entornos sin el paquete, se ignora.
  }
}
```

> **¿Por qué el bloque condicional?**
> Llamar a `require('electron-squirrel-startup')` directamente (sin guard de plataforma) lanza un error si el paquete no está instalado o si la app se ejecuta en Linux/macOS. El `try/catch` hace el código **seguro para desarrollo multiplataforma** sin cambiar el comportamiento en Windows.

Sin este bloque, el instalador de Windows generado por Squirrel no terminará correctamente.

---

## Flujo de empaquetado (Windows)

```
npm run make
        │
        ▼
electron-forge make
        │
        ├─► Empaqueta fuentes en .asar
        ├─► Aplica Fuses (bloquea flags de seguridad)
        ├─► Invoca Maker Squirrel
        │
        ▼
out/make/squirrel.windows/x64/
    ├── MiAppSetup.exe        ← Instalador para el usuario final
    └── MiApp-X.X.X-full.nupkg
```

El instalador `.exe` incluye:
- Instalación silenciosa en `%LOCALAPPDATA%`
- Acceso directo en el escritorio y en el menú inicio
- Desinstalador accesible desde "Agregar o quitar programas"

---

## Requisitos previos del sistema

- **Node.js** >= 18 (recomendado LTS)
- **npm** >= 9
- En Windows: puede requerir [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) para módulos nativos

---

## Notas importantes

- La carpeta `out/` es generada automáticamente y **no debe incluirse en git** (agregar al `.gitignore`).
- `asar: true` protege el código fuente dentro del instalador, pero no lo cifra.
- Los Fuses se aplican **una sola vez al empaquetar**; no se pueden cambiar sin reempaquetar.
- Para agregar un ícono personalizado, añadir `icon` en `packagerConfig`:
  ```js
  packagerConfig: {
    asar: true,
    icon: './assets/icon', // sin extensión; Forge elige .ico/.icns/.png según plataforma
  }
  ```
