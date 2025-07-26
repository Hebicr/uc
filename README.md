# UC - Sistema de Call Center

Este es un sistema desarrollado con **Vue 3 + Vite** en el frontend, y **Node.js + Express + Knex** en el backend y gestión automática de base de datos.

---

## 🧹 Tecnologías principales

- **Frontend**: Vue 3 + Vite + Vuetify
- **Backend**: Node.js + Express
- **Base de datos**: MySQL (con Knex.js)
- **Internacionalización**: i18next
- **Autenticación**: JWT
- **Sockets**: socket.io

---

## 🚀 Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/Hebicr/uc.git
cd uc
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Configura los entornos

Crea los archivos `.env` según el entorno:

#### `.env.development`

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=uc
PORT=3000
JWT_SECRET=unaClaveSecreta
```

#### `.env.production`

```env
DB_HOST=127.0.0.1
DB_USER=usuario_prod
DB_PASSWORD=clave_prod
DB_NAME=uc_prod
PORT=80
JWT_SECRET=claveSuperSegura
```

---

## 📆 Scripts disponibles

### Desarrollo

```bash
npm run dev
```

- Levanta el frontend (Vite) y backend (Express) en paralelo.
- Usa `.env.development`.

### Producción

```bash
npm run prod
```

- Compila el frontend (`vite build`)
- Crea la base de datos (si no existe), aplica migraciones y seeds
- Levanta el backend con `.env.production`

---

## ⚙️ Scripts útiles
## Scripts npm

### Desarrollo

| Comando             | Descripción                                             |
|---------------------|---------------------------------------------------------|
| `npm run dev`       | Levanta frontend y backend en modo desarrollo.          |
| `npm run start:dev` | Solo backend en desarrollo.                             |
| `npm run init-db`   | Crea base de datos, aplica migraciones y seeds (dev).   |
| `npm run dev:init`  | Inicializa DB y levanta frontend + backend.             |
| `npm run reset-db`  | Resetea base de datos (rollback, migrate, seed) en dev. |

### Producción

| Comando                 | Descripción                                      |
|-------------------------|------------------------------------------------  |
| `npm run build`         | Compila frontend para producción.                |
| `npm run start:prod`    | Solo backend en producción.                      |
| `npm run init-db:prod`  | Crea base de datos, migraciones y seeds (prod).  |
| `npm run reset-db:prod` | Resetea base de datos en producción.             |
| `npm run prod:init`     | Inicializa DB y arranca backend (producción).    |
| `npm run prod`          | Compila frontend y arranca backend (producción). |

---

### Uso recomendado

- Desarrollo completo:

  ```bash
  npm run dev:init



---

## 📄 Licencia

Este proyecto está bajo licencia **MIT**.

---

## ✨ Autor

Desarrollado por [Steven JR] (https://github.com/Hebicr) con ❤️ y dedicación.

