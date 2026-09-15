```
        ██████████████
      ██░░░░░░░░░░░░░░██
    ██░░░░░░██░░██░░░░░░██
    ██░░░░░░░░░░░░░░░░░░██        ┌──────────────────────────┐
    ██░░██░░░░░░░░░░██░░██        │  ♠  T C G   S T O R E  ♠ │
    ████░░░░▓▓▓▓▓▓░░░░████        │  ────────────────────── │
      ██░░░░▓▓▓▓▓▓░░░░██          │   ⚡ Pikachu            │
        ██░░░░░░░░░░██            │   Pokémon · Común       │
      ██░░██░░░░░░██░░██          │   PV 60      Rojo       │
      ██░░░░██████░░░░██          │  ────────────────────── │
        ██░░░░░░░░░░██            │   Panel de Inventario    │
          ██░░░░░░██              │   Frontend · React 19    │
            ██████                └──────────────────────────┘
```

# TCG Store — Frontend (Panel de Inventario)

Frontend en **React + TypeScript + Vite** para la plataforma **TCG Store**, la solución de gestión unificada para una red de tiendas de cartas coleccionables (TCG). Esta aplicación es el **panel de inventario**: permite iniciar sesión con AWS Cognito, listar cartas, buscarlas/filtrarlas por juego, y crear, editar o eliminar registros según el rol del usuario.

> Este repositorio es el cliente web. El backend (API REST) vive en un repositorio aparte — ver [`TCGstore` (backend)](#) — y ambos se comunican a través de AWS API Gateway.

---

## 🧩 Contexto del proyecto

TCG Store nace del caso de una red de 20 tiendas de cartas coleccionables que necesita unificar ventas, inventario, pedidos, notificaciones y reportes en una sola plataforma, con login corporativo, control de acceso por rol y trazabilidad de cada acción sobre el negocio.

Esta entrega corresponde al **módulo de inventario de cartas** de esa plataforma: la base sobre la que se construyen los siguientes módulos (ventas, pedidos, notificaciones, analítica). El resto de los sistemas descritos en el caso (mensajería con RabbitMQ, streaming con Kafka, microservicios adicionales) forman parte del roadmap del proyecto y no están incluidos en esta versión del frontend.

### Decisiones de implementación vs. el enunciado original

| Enunciado del caso | Implementado en este proyecto |
|---|---|
| Login corporativo con Azure AD (IDaaS) | **Amazon Cognito** (User Pool) como proveedor de identidad, vía `react-oidc-context` |
| Frontend Angular con MSAL | **React 19 + TypeScript + Vite**, con `oidc-client-ts` para el flujo OIDC |
| Backend detrás de AWS API Gateway | ✅ Se mantiene: todas las peticiones pasan por **API Gateway** antes de llegar al backend |
| Despliegue en AWS EC2 con Docker | ✅ Se mantiene para el backend (ver README del backend) |

---

## 🔐 Autenticación y roles

La app usa el flujo **Authorization Code (OIDC)** contra un **User Pool de Amazon Cognito**. Al iniciar sesión, el token entrega el claim `cognito:groups`, que la interfaz usa para determinar el rol del usuario y habilitar o esconder acciones:

| Rol (grupo de Cognito) | Puede ver | Puede crear/editar | Puede eliminar |
|---|:---:|:---:|:---:|
| **Cliente** | ✅ | ❌ | ❌ |
| **Colaborador** | ✅ | ✅ | ❌ |
| **Admin** | ✅ | ✅ | ✅ |

El `id_token` emitido por Cognito se envía en cada request al backend como `Authorization: Bearer <token>`, y el backend vuelve a validar el rol contra ese mismo token (la UI nunca es la única barrera de seguridad).

---

## 🛠️ Stack técnico

- **React 19** + **TypeScript**
- **Vite** (dev server / build)
- **react-oidc-context** + **oidc-client-ts** — integración OIDC con Cognito
- **oxlint** — linting
- Estilos con objetos `CSSProperties` inline (sin librería de UI externa), tema centralizado en `src/theme.ts`
- Consumo de API vía `fetch` nativo (`src/api/cardsApi.ts`)

---

## 📂 Estructura del proyecto

```
src/
├── api/
│   └── cardsApi.ts        # Cliente HTTP hacia el backend (fetch + Bearer token)
├── components/
│   ├── AuthShell.tsx      # Layout para pantallas de login/carga/error
│   ├── LoginPanel.tsx     # Login, estados de carga y error de Cognito
│   ├── TopBar.tsx         # Barra superior: usuario, roles, logout
│   ├── CardGrid.tsx       # Búsqueda, filtro por juego y grilla de cartas
│   ├── CardTile.tsx       # Tarjeta individual (vista + acciones)
│   └── CardFormPanel.tsx  # Formulario de creación/edición
├── config.ts               # URL base de la API (API Gateway)
├── theme.ts                 # Paleta de colores, tipografías, radios
├── types.ts                  # Tipos Card / CardInput + catálogos (juegos, rarezas, estados)
├── App.tsx                    # Orquestación: auth, estado del inventario, permisos
└── main.tsx                    # Bootstrap de React + configuración de Cognito (AuthProvider)
```

---

## 🚀 Puesta en marcha local

### Requisitos
- Node.js 18+
- Un User Pool de Cognito ya configurado (o las credenciales del ambiente compartido del equipo)

### Instalación

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Configuración

Actualmente la configuración vive directamente en el código (pensado para el ambiente de desarrollo/demo del equipo):

- **`src/config.ts`** → `API_BASE_URL`: endpoint de API Gateway que expone el backend.
- **`src/main.tsx`** → `cognitoAuthConfig`: `authority`, `client_id` y `redirect_uri` del User Pool de Cognito.

> 💡 Mejora sugerida para producción: mover estos valores a variables de entorno (`import.meta.env.VITE_*`) para no hardcodear IDs de Cognito ni URLs de API por ambiente.

### Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo (Vite + HMR) |
| `npm run build` | Compila TypeScript y genera el build de producción |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | Corre oxlint sobre el proyecto |

---

## 🔌 Endpoints consumidos

Todas las llamadas van contra `API_BASE_URL` (API Gateway) e incluyen el header `Authorization: Bearer <id_token>`.

| Acción | Método | Endpoint | Rol mínimo requerido |
|---|---|---|---|
| Listar cartas | `GET` | `/api/cards` | Cualquier usuario autenticado |
| Ver una carta | `GET` | `/api/cards/{id}` | Cualquier usuario autenticado |
| Crear carta | `POST` | `/api/cards` | Colaborador / Admin |
| Editar carta (reemplazo completo) | `PUT` | `/api/cards/{id}` | Colaborador / Admin |
| Eliminar carta | `DELETE` | `/api/cards/{id}` | Admin |

El detalle completo de contratos (DTOs), respuestas de error y variables de entorno del backend está en el README del repositorio backend.

---

## ✨ Funcionalidades actuales

- Login/logout contra Cognito con manejo de estados de carga y error.
- Listado de cartas con **búsqueda** por nombre/edición y **filtro** por juego (Pokémon, Magic, Yu-Gi-Oh!, etc.), calculados en el cliente.
- Alta, edición y baja de cartas mediante un panel lateral con validación básica de formulario.
- Actualización optimista al eliminar (se revierte si la API falla).
- UI adaptada por rol: los usuarios de solo lectura ven un aviso y no tienen acceso a los botones de edición/borrado.

