# 📋 Planify - Frontend Application

![Angular](https://img.shields.io/badge/Angular-20.3-red?logo=angular)
![PrimeNG](https://img.shields.io/badge/PrimeNG-Latest-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

Sistema de gestión de proyectos y tareas tipo Kanban con módulos de autenticación, boards, notas y administración. Diseñado con arquitectura Feature First, PrimeNG para UI profesional, dark mode y preparado para despliegue con SSR.

---

## 📚 Tabla de Contenidos

- [Características](#-características)
- [Cambios Recientes](#-cambios-recientes)
- [Arquitectura](#-arquitectura)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Flujo de Autenticación](#-flujo-de-autenticación)
- [Convenciones y Estándares](#-convenciones-y-estándares)
- [Accesibilidad](#-accesibilidad)
- [Tecnologías](#-tecnologías)

---

## ✨ Características

### Módulo de Autenticación
- ✅ Login y registro con validación completa
- ✅ Gestión de JWT tokens con refresh automático
- ✅ Popup proactivo de renovación de sesión (30 min timeout)
- ✅ Persistencia de sesión con hard refresh
- ✅ Guards para protección de rutas (authGuard, adminGuard, publicGuard)
- ✅ Interceptor HTTP con cola de peticiones durante refresh
- ✅ Validación con /auth/me en guards
- ✅ IDs QA para testing (txt-auth-*, btn-auth-*)

### Módulo de Boards
- ✅ Lista de tableros con CRUD completo
- ✅ Vista Kanban con columnas dinámicas
- ✅ Drag & Drop con Angular CDK
- ✅ Gestión de tareas con prioridades y estados
- ✅ Tags y fechas de vencimiento

### Módulo de Notas
- ✅ Lista de notas con DataView
- ✅ CRUD completo
- ✅ Soporte de Markdown

### Módulo de Administración
- ✅ Dashboard con estadísticas y gráficos (Chart.js)
- ✅ Gestión de usuarios con DataTable
- ✅ Asignación de roles (Admin, Manager, User, Guest)
- ✅ Protección con adminGuard

### Dark Mode
- ✅ ThemeService con Signals
- ✅ Toggle animado en header
- ✅ Persistencia en localStorage (SSR-safe)
- ✅ Detección de preferencia del sistema
- ✅ CSS variables para tema claro/oscuro

### Internacionalización
- ✅ Sistema completo ES/EN
- ✅ Toggle en header
- ✅ TranslationService con Signals

---

## 🔄 Cambios Recientes

### Sesión de Correcciones (Octubre 2025)

#### 1. **Proxy CORS Configurado** ✅
- `proxy.conf.json` apunta a `https://localhost:7025`
- Configurado en `angular.json` para `ng serve`
- No se requieren modificaciones en el backend

#### 2. **Persistencia de Sesión Mejorada** ✅
- **authGuard actualizado**: Valida sesión con `GET /api/v1/auth/me` antes de renderizar
- **Hard refresh funcional**: `/boards` mantiene sesión después de F5
- **Storage consistente**: Tokens en localStorage (SSR-safe)

#### 3. **Refresh Token Proactivo** ✅
- **SessionRefreshService creado**: Monitorea expiración cada 60 segundos
- **Modal de renovación**: Aparece 5 minutos antes de expirar
- **Timeout de 30 minutos**: Cierra sesión automáticamente si no responde
- **Dialog en app.html**: PrimeNG Dialog con botones "Continue Session" / "Log Out"

#### 4. **Interceptor Mejorado** ✅
- **Cola de peticiones**: BehaviorSubject maneja múltiples requests durante refresh
- **Manejo de 401**: Refresh automático sin perder request original
- **Sin duplicación**: Flag `isRefreshing` evita múltiples llamadas simultáneas

#### 5. **IDs QA y Accesibilidad** ✅
- **IDs QA agregados**:
  - `txt-auth-email`, `txt-auth-password` (Login)
  - `txt-auth-firstname`, `txt-auth-lastname`, `txt-auth-email`, `txt-auth-password` (Register)
  - `btn-auth-login`, `btn-auth-register`
- **ARIA labels**: `aria-label`, `aria-describedby` en todos los inputs
- **Focus visible**: Estilos de foco en todos los controles
- **Labels correctos**: Todos los `<label for="">` coinciden con IDs de inputs

#### 6. **Password Input Estandarizado** ✅
- **p-password de PrimeNG**: Toggle de visibilidad estándar
- **Posicionamiento correcto**: Ícono de ojo alineado a la derecha
- **Accesibilidad**: `ariaLabel` y `ariaDescribedBy` configurados
- **Consistente**: Mismo componente en Login, Register y Profile

#### 7. **CSP Compliance** ✅
- **Sin eval**: No hay uso de `eval()`, `new Function()`, `setTimeout('string')`
- **Computed signals**: `connectedDropLists` en board-detail usa computed en lugar de .map() en template
- **Chart.js instalado**: Dependencia agregada para PrimeNG Chart

#### 8. **Menú de Perfil con PrimeNG** ✅
- **p-menu**: Reemplazó menú ad-hoc
- **MenuItem[]**: Mi Perfil, Configuración, Cerrar Sesión
- **Accesibilidad**: `aria-label`, `aria-haspopup`, `aria-expanded`
- **Click fuera cierra**: `appendTo="body"` y `autoZIndex`
- **Navegación por teclado**: Funcional por defecto con PrimeNG

#### 9. **Compilación Exitosa** ✅
- **ng build**: Sin errores
- **Warnings**: Solo budgets de CSS excedidos (no críticos)
- **SSR**: RenderMode.Server configurado para rutas dinámicas

---

## 🏗️ Arquitectura

### Feature First

```
src/app/
├── features/              # Módulos funcionales
│   ├── auth/             # Login, Register
│   ├── boards/           # Board List, Board Detail (Kanban)
│   ├── notes/            # Note List
│   └── admin/            # Dashboard, User Management
│
├── shared/               # Código compartido
│   ├── guards/           # authGuard, adminGuard, publicGuard
│   ├── interceptors/     # authInterceptor
│   ├── models/           # Interfaces TypeScript
│   ├── services/         # Auth, Token, SessionRefresh, Board, Task, Note, Admin, Theme, i18n
│   └── layout/           # MainLayout con Header, Sidebar, Footer
│
├── app.ts                # Root component con SessionRefresh dialog
├── app.routes.ts         # Rutas principales
└── app.routes.server.ts  # SSR configuration
```

---

## 🚀 Instalación y Ejecución

### Pre-requisitos

- **Node.js**: v18 o superior
- **npm**: v9 o superior
- **Angular CLI**: v20.3.6
- **Backend**: Debe estar corriendo en `https://localhost:7025`

### 1. Instalar dependencias

```bash
cd FrontPlanify/FrontPlanify
npm install
```

### 2. Iniciar la aplicación

```bash
npm start
```

La aplicación estará en `http://localhost:4200/`.

**Importante**: El proxy redirige `/api` a `https://localhost:7025`.

### 3. Build de producción

```bash
npm run build
```

Output en `dist/FrontPlanify/`.

---

## 🔐 Flujo de Autenticación

### 1. Login/Register
```
Usuario → AuthService.login() 
       → POST /api/v1/auth/login
       → Respuesta: { accessToken, refreshToken, expiresAt, user }
       → TokenService guarda en localStorage
       → Navega a /boards
```

### 2. Persistencia con Hard Refresh
```
Usuario en /boards → F5 (hard refresh)
                   ↓
authGuard se activa
                   ↓
Verifica TokenService.isTokenValid()
                   ↓
Llama AuthService.getCurrentUser()
                   ↓
GET /api/v1/auth/me
                   ↓
Si OK → Permite acceso
Si 401 → Redirige a /auth/login
```

### 3. Refresh Proactivo
```
SessionRefreshService.startMonitoring()
                   ↓
interval(60000) verifica TokenService.isTokenExpiringSoon()
                   ↓
Si expira en < 5 min → Muestra Dialog
                   ↓
Usuario click "Continue Session"
                   ↓
POST /api/v1/auth/refresh { refreshToken }
                   ↓
Actualiza tokens en localStorage
                   ↓
Si no responde en 30 min → Logout automático
```

### 4. Manejo de 401 en Interceptor
```
Request → authInterceptor agrega Bearer token
        ↓
Backend responde 401
        ↓
isRefreshing = true (evita múltiples refreshes)
        ↓
POST /api/v1/auth/refresh
        ↓
BehaviorSubject notifica nuevo token
        ↓
Queue de requests se reintenta con nuevo token
        ↓
Si refresh falla → Logout y redirige a login
```

---

## 📋 Convenciones y Estándares

### IDs QA para Testing

**Formato**: `{tipo}-{módulo}-{campo}`

Ejemplos:
- `txt-auth-email` - Input de email en auth
- `txt-auth-password` - Input de password en auth
- `btn-auth-login` - Botón de login
- `btn-auth-register` - Botón de registro
- `tbl-boards-list` - Tabla de boards (futuro)
- `dlg-create-board` - Dialog de crear board (futuro)

### Nomenclatura de Código

- **Componentes**: PascalCase (`Login`, `BoardList`)
- **Servicios**: camelCase (`authService`, `boardService`)
- **Signals**: camelCase (`currentUser`, `isLoading`)
- **Métodos**: camelCase (`loadBoards()`, `toggleTheme()`)

### Estructura de Componentes

**SIEMPRE separar**: `.ts`, `.html`, `.css`

```typescript
@Component({
  selector: 'app-my-component',
  imports: [...],
  templateUrl: './my-component.html',  // ✅ Separado
  styleUrl: './my-component.css'        // ✅ Separado
})
```

**❌ Prohibido**: Templates o estilos inline.

### Inyección de Dependencias

Usar `inject()` en lugar de constructor:

```typescript
export class MyComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  protected i18n = inject(TranslationService);
}
```

---

## ♿ Accesibilidad

### Labels y Formularios
- **Todos los inputs** tienen `<label for="">` con ID coincidente
- **aria-label**: En botones e inputs sin label visible
- **aria-describedby**: Enlaza mensajes de error/ayuda con inputs

### Navegación por Teclado
- **Tab order**: Respeta orden lógico del DOM
- **Focus visible**: Todos los controles tienen outline visible
- **Escape**: Cierra dialogs y menús
- **Enter/Space**: Activa botones y enlaces

### Contraste y Color
- **Ratio AA**: Mínimo 4.5:1 para texto
- **Texto en inputs**: Suficientemente visible al escribir
- **No solo color**: Iconos + texto para estados

### Componentes Accesibles
- **PrimeNG Menu**: ARIA roles automáticos
- **Dialogs**: Focus trap + ESC para cerrar
- **Passwords**: Toggle visible con aria-label

---

## 🛠️ Tecnologías

### Core
- **Angular**: 20.3.0 (Standalone components, SSR)
- **TypeScript**: 5.9
- **RxJS**: 7.8
- **Angular CDK**: 20.2.9 (Drag & Drop)

### UI
- **PrimeNG**: 20.2.0
- **PrimeIcons**: 7.0.0
- **Chart.js**: Latest (para gráficos admin)

### Autenticación
- **jwt-decode**: 4.0.0

### Build
- **esbuild**: Bundler ultra-rápido
- **Angular CLI**: 20.3.6

---

## 📊 Estado del Proyecto

### ✅ Completado (100%)
1. ✅ Layout Global con MainLayout
2. ✅ BoardService con CRUD completo
3. ✅ Board List con DataView
4. ✅ Board Detail con Kanban y Drag & Drop
5. ✅ TaskService y ColumnService
6. ✅ NoteService y Note List
7. ✅ AdminService con Dashboard y User Management
8. ✅ Dark Mode con ThemeService
9. ✅ Sistema de autenticación robusto
10. ✅ Persistencia de sesión con hard refresh
11. ✅ Refresh token proactivo con modal
12. ✅ Interceptor con cola de peticiones
13. ✅ IDs QA y accesibilidad completa
14. ✅ Menú de perfil con PrimeNG
15. ✅ Compilación sin errores

---

## 🐛 Troubleshooting

### Error: "Can't resolve '/api/v1/...'"
**Solución**: Asegúrate de que `proxy.conf.json` esté configurado y el backend esté corriendo en `https://localhost:7025`.

### Error: "Token expired"
**Solución**: El SessionRefreshService debería mostrar un dialog automáticamente. Si no, cierra sesión y vuelve a loguearte.

### Error: "label for sin id"
**Solución**: Ya corregido. Todos los labels tienen `for` que coincide con el `id` del input.

### Compilación lenta
**Solución**: Angular 20 usa esbuild que es muy rápido. Si es lento, limpia cache:
```bash
rm -rf .angular
npm run build
```

---

## 📞 Contacto

**Planify Team**
- Email: oscarmedina675@gmail.com

---

**Última actualización**: 19 de octubre de 2025  
**Versión**: 1.0.0

---

## 🎯 Criterios de Aceptación - ✅ TODOS CUMPLIDOS

### 1. Register con diseño profesional ✅
- Mismo nivel de diseño que Login (tarjeta central, jerarquía visual)
- Validaciones visibles y unificadas
- IDs QA: `txt-auth-*`, `btn-auth-register`

### 2. Password input correcto ✅
- p-password de PrimeNG con toggle funcionando
- Ícono de ojo correctamente posicionado (alineado a la derecha)
- Accesible (aria-label, focus visible)
- Aplicado en Login, Register y futuro Profile

### 3. Persistencia de sesión ✅
- Hard refresh en /boards mantiene la sesión
- authGuard valida con GET /api/v1/auth/me
- Popup de renovación aparece antes de expirar
- Refresh automático con POST /api/v1/auth/refresh
- Timeout de 30 minutos → logout automático

### 4. Boards renderiza correctamente ✅
- No hay errores de CSP (sin eval/new Function)
- Todos los labels tienen `for` con ID correcto
- Mapeo de respuesta backend validado
- TrackBy implementado en @for
- ng build sin errores

### 5. Diseño general alineado ✅
- Paddings/margins consistentes
- Contraste suficiente en inputs (texto visible)
- Botones uniformes (primario/secundario/ghost)
- Footer con versión siempre visible
- Header con logo, tabs, avatar y menús

### 6. Menú "Mi Perfil" con PrimeNG ✅
- Usa PrimeNG Menu
- Entradas: Mi Perfil, Configuración, Cerrar Sesión
- Cierra al hacer click fuera (appendTo="body")
- Navegación por teclado funcional
- Accesibilidad (aria-* attributes)

### 7. Compilación exitosa ✅
- `ng build` sin errores
- `npm start` funciona correctamente
- Warnings solo de budgets (no críticos)

---



---

## 📚 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Ejecución](#-ejecución)
- [Build y Deploy](#-build-y-deploy)
- [Endpoints API](#-endpoints-api)
- [Autenticación y Seguridad](#-autenticación-y-seguridad)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Convenciones de Código](#-convenciones-de-código)

---

## ✨ Características

### Módulo de Autenticación
- ✅ Login y registro de usuarios
- ✅ Gestión de JWT tokens con refresh automático
- ✅ Guards para protección de rutas
- ✅ Interceptor HTTP para agregar Bearer token
- ✅ Manejo de sesión con localStorage (SSR-safe)

### Módulo de Boards (En desarrollo)
- 📋 Lista de tableros personales
- 🎯 Vista Kanban con columnas personalizables
- 🏷️ Gestión de tareas con drag & drop
- 🔄 Reordenamiento de columnas y tareas
- 🎨 Prioridades y estados de tareas
- 🏷️ Etiquetas y filtros

### Módulo de Notas (Planificado)
- 📝 Editor de notas con Markdown
- 🔄 Conversión de notas a tareas
- 🔍 Búsqueda y filtrado
- 🏷️ Sistema de etiquetas

### Módulo de Administración (Planificado)
- 👥 Gestión de usuarios
- 🔐 Roles y permisos
- ⚙️ Configuración del sistema
- 📊 Auditoría de acciones

---

## 🏗️ Arquitectura

### Feature First Architecture

El proyecto utiliza **Feature First** para organizar el código por funcionalidades:

```
src/app/
├── features/              # Módulos funcionales
│   ├── auth/             # Autenticación (Login, Register)
│   ├── boards/           # Gestión de boards
│   ├── notes/            # Gestión de notas
│   └── admin/            # Administración
│
├── shared/               # Código compartido
│   ├── guards/           # Guards de rutas (authGuard, adminGuard)
│   ├── interceptors/     # Interceptors HTTP (auth, error)
│   ├── models/           # Interfaces y tipos TypeScript
│   ├── services/         # Servicios compartidos
│   └── layout/           # Layout global (header, footer)
│
├── app.config.ts         # Configuración de la aplicación
├── app.routes.ts         # Rutas principales
└── app.html              # Template principal
```

### Flujo de Autenticación

```
┌──────────────┐
│   Usuario    │
└──────┬───────┘
       │ Login/Register
       ▼
┌──────────────────┐
│  AuthService     │──────► localStorage (tokens)
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  AuthInterceptor │──────► Agrega Bearer Token
└──────┬───────────┘        Refresca token automático
       │
       ▼
┌──────────────────┐
│   Backend API    │
└──────────────────┘
```

---

## 📁 Estructura del Proyecto

```
FrontPlanify/
│
├── src/
│   ├── app/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.ts           # Componente de login
│   │   │   │   │   ├── login.html         # Template
│   │   │   │   │   └── login.css          # Estilos
│   │   │   │   └── register/
│   │   │   │       ├── register.ts        # Componente de registro
│   │   │   │       ├── register.html
│   │   │   │       └── register.css
│   │   │   │
│   │   │   ├── boards/
│   │   │   │   └── board-list/            # Lista de boards
│   │   │   │
│   │   │   ├── notes/                     # (Planificado)
│   │   │   └── admin/                     # (Planificado)
│   │   │
│   │   ├── shared/
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts          # Guards de autenticación
│   │   │   │
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts    # Interceptor de auth
│   │   │   │   └── error.interceptor.ts   # Interceptor de errores
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── auth.models.ts         # Modelos de autenticación
│   │   │   │   ├── board.models.ts        # Modelos de boards
│   │   │   │   ├── task.models.ts         # Modelos de tareas
│   │   │   │   ├── note.models.ts         # Modelos de notas
│   │   │   │   ├── common.models.ts       # Modelos comunes
│   │   │   │   └── index.ts               # Barrel export
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts        # Servicio de autenticación
│   │   │   │   └── token.service.ts       # Gestión de tokens JWT
│   │   │   │
│   │   │   └── layout/                    # (Planificado)
│   │   │
│   │   ├── app.config.ts                  # Configuración de providers
│   │   ├── app.routes.ts                  # Configuración de rutas
│   │   └── app.ts                         # Componente raíz
│   │
│   ├── styles.css                         # Estilos globales
│   ├── index.html                         # HTML principal
│   └── main.ts                            # Entry point
│
├── proxy.conf.json                        # Configuración del proxy
├── angular.json                           # Configuración de Angular
├── tsconfig.json                          # Configuración de TypeScript
├── package.json                           # Dependencias del proyecto
└── README.md                              # Este archivo
```

---

## 🚀 Instalación y Configuración

### Pre-requisitos

- **Node.js**: v18 o superior
- **npm**: v9 o superior
- **Angular CLI**: v20.3.6

```bash
npm install -g @angular/cli@20.3.6
```

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd FrontPlanify/FrontPlanify
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar el proxy

El archivo `proxy.conf.json` ya está configurado para redirigir las peticiones API al backend:

```json
{
  "/api": {
    "target": "https://localhost:7025",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

**⚠️ Importante**: Asegúrate de que el backend esté corriendo en `https://localhost:7025` antes de iniciar el frontend.

### 4. Variables de entorno (Opcional)

Si necesitas cambiar la URL del backend, modifica `proxy.conf.json`.

---

## ▶️ Ejecución

### Modo desarrollo

```bash
npm start
```

O directamente con Angular CLI:

```bash
ng serve --proxy-config proxy.conf.json
```

La aplicación estará disponible en `http://localhost:4200/`.

### Modo desarrollo con live reload

```bash
ng serve --open --proxy-config proxy.conf.json
```

---

## 🏗️ Build y Deploy

### Build de desarrollo

```bash
ng build --configuration=development
```

### Build de producción

```bash
ng build --configuration=production
```

Los archivos optimizados se generan en `dist/FrontPlanify/`.

### Deploy a Azure Web App

1. **Crear Azure Web App**:
   ```bash
   az webapp create --resource-group <resource-group> --plan <app-service-plan> --name <app-name> --runtime "NODE|18-lts"
   ```

2. **Configurar archivo `web.config`** en `dist/FrontPlanify/browser/`:

   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <configuration>
     <system.webServer>
       <rewrite>
         <rules>
           <rule name="Angular Routes" stopProcessing="true">
             <match url=".*" />
             <conditions logicalGrouping="MatchAll">
               <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
               <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
             </conditions>
             <action type="Rewrite" url="/" />
           </rule>
         </rules>
       </rewrite>
     </system.webServer>
   </configuration>
   ```

3. **Deploy con Azure CLI**:
   ```bash
   az webapp deploy --resource-group <resource-group> --name <app-name> --src-path dist/FrontPlanify/browser --type zip
   ```

4. **Configurar variables de entorno en Azure**:
   - `API_URL`: URL del backend (ejemplo: `https://api.planify.com`)

---

## 🌐 Endpoints API

La aplicación consume la API REST documentada en `src/Postman/Planify API - Complete Collection.postman_collection.json`.

### Base URL

```
http://localhost:4200/api/v1  (proxied to https://localhost:7025/api/v1)
```

### Endpoints Principales

#### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Registro de usuario |
| POST | `/api/v1/auth/login` | Login de usuario |
| POST | `/api/v1/auth/refresh` | Refresh del token |
| GET | `/api/v1/auth/me` | Obtener usuario actual |

#### Boards (Próximamente)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/boards` | Listar todos los boards |
| GET | `/api/v1/boards/:id` | Obtener board por ID |
| POST | `/api/v1/boards` | Crear nuevo board |
| PUT | `/api/v1/boards/:id` | Actualizar board |
| DELETE | `/api/v1/boards/:id` | Eliminar board |

#### Tasks (Próximamente)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/boards/:boardId/tasks` | Listar tareas |
| POST | `/api/v1/boards/:boardId/tasks` | Crear tarea |
| PUT | `/api/v1/boards/:boardId/tasks/:taskId` | Actualizar tarea |
| PATCH | `/api/v1/boards/:boardId/tasks/:taskId/move` | Mover tarea |
| DELETE | `/api/v1/boards/:boardId/tasks/:taskId` | Eliminar tarea |

---

## 🔐 Autenticación y Seguridad

### JWT Token Management

- **Access Token**: JWT con expiración de 7 días
- **Refresh Token**: Token para renovar el access token
- **Almacenamiento**: localStorage (con verificación SSR-safe)

### Guards

#### `authGuard`
Protege rutas que requieren autenticación:

```typescript
{
  path: 'boards',
  canActivate: [authGuard],
  loadComponent: () => import('./features/boards/board-list/board-list')
}
```

#### `adminGuard`
Protege rutas solo accesibles por administradores:

```typescript
{
  path: 'admin',
  canActivate: [authGuard, adminGuard],
  loadComponent: () => import('./features/admin/admin')
}
```

#### `publicGuard`
Redirige al dashboard si ya está autenticado:

```typescript
{
  path: 'auth/login',
  canActivate: [publicGuard],
  loadComponent: () => import('./features/auth/login/login')
}
```

### Interceptors

#### `authInterceptor`
- Agrega automáticamente el Bearer token a todas las peticiones
- Refresca el token automáticamente si está próximo a expirar
- Maneja errores 401 y realiza logout si es necesario

#### `errorInterceptor`
- Captura errores HTTP globalmente
- Maneja códigos de error (401, 403, 404, 500)
- Muestra mensajes de error al usuario

---

## 🛠️ Tecnologías Utilizadas

### Core
- **Angular**: v20.3 - Framework principal
- **TypeScript**: v5.9 - Lenguaje de programación
- **RxJS**: v7.8 - Programación reactiva

### UI Framework
- **PrimeNG**: Framework de componentes UI profesional
- **PrimeIcons**: Biblioteca de iconos

### Autenticación
- **jwt-decode**: Decodificación de tokens JWT

### Build & Development
- **Angular CLI**: v20.3.6
- **esbuild**: Bundler de alta velocidad
- **TypeScript**: Compilador

---

## 📝 Convenciones de Código

### Nomenclatura

- **Componentes**: PascalCase (`Login`, `BoardList`)
- **Servicios**: camelCase con sufijo `Service` (`authService`, `boardService`)
- **Interfaces**: PascalCase (`User`, `Board`, `Task`)
- **Variables**: camelCase (`userName`, `taskList`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`, `ACCESS_TOKEN_KEY`)

### Estructura de Componentes

Cada componente debe tener **tres archivos separados**:

```
component-name/
├── component-name.ts      # Lógica del componente
├── component-name.html    # Template
└── component-name.css     # Estilos
```

**❌ Prohibido**: Templates o estilos inline en el `.ts`

### Servicios

Los servicios deben usar `inject()` en lugar de constructor injection:

```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  private http = inject(HttpClient);
  private router = inject(Router);
}
```

---

## 📊 Estado del Proyecto

### ✅ Completado
- ✅ Configuración de proyecto Angular 20
- ✅ Instalación y configuración de PrimeNG
- ✅ Configuración de proxy para CORS
- ✅ Arquitectura Feature First
- ✅ Modelos TypeScript basados en Postman
- ✅ AuthService y TokenService
- ✅ Guards (authGuard, adminGuard, publicGuard)
- ✅ Interceptors (authInterceptor, errorInterceptor)
- ✅ Componentes de Login y Register
- ✅ Rutas principales configuradas
- ✅ Compilación exitosa sin errores

### 🚧 En Desarrollo
- 🚧 Layout global (Header, Footer)
- 🚧 Módulo de Boards
- 🚧 Módulo de Notas
- 🚧 Módulo de Administración
- 🚧 Dark Mode
- 🚧 Animaciones y transiciones

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es propiedad privada. Todos los derechos reservados.

---

## 📞 Contacto

**Planify Team**
- Email: support@planify.com
- Website: https://planify.com

---

## 🎯 Próximos Pasos

1. **Implementar BoardService** con todos los endpoints CRUD
2. **Crear componentes de Boards** (lista, detalle, Kanban)
3. **Implementar drag & drop** de tareas
4. **Crear Layout global** con Header y Footer
5. **Implementar módulo de Notas**
6. **Agregar dark mode**
7. **Crear módulo de Administración**
8. **Testing unitario y E2E**
9. **Optimización de performance**
10. **Deploy a Azure**

---

**Última actualización**: 19 de octubre de 2025  
**Versión**: 1.0.0-alpha
