# 🤖 CLAUDE.md - Contexto del Proyecto Intranet

## 📋 Información General del Proyecto

### **Nombre del Proyecto**
Sistema de Intranet con Arquitectura Hexagonal

### **Descripción**
Aplicación React con TypeScript implementando arquitectura hexagonal (puertos y adaptadores). Sistema de intranet empresarial con autenticación completa, navegación protegida, tema claro/oscuro y documentación integrada.

### **Objetivo Principal**
Crear una plataforma de intranet robusta y escalable que sirva como base para aplicaciones empresariales, siguiendo principios de arquitectura limpia y buenas prácticas de desarrollo.

---

## 🏗️ Arquitectura y Stack Tecnológico

### **Frontend**
- **React 18.2.0** - Biblioteca UI con hooks y StrictMode
- **TypeScript 5.3.3** - Tipado estático y desarrollo robusto
- **Vite 5.0.0** - Bundler rápido y servidor de desarrollo
- **Material-UI (MUI) 5.15.20** - Sistema de componentes con theming
- **Tailwind CSS 3.4.1** - Utilidades CSS para styling rápido
- **React Router DOM 6.23.1** - Enrutamiento SPA con rutas protegidas
- **Zustand 4.5.7** - Gestión de estado global con persistencia

### **Backend/Base de Datos**
- **Supabase** - BaaS (Backend as a Service)
  - PostgreSQL como base de datos
  - Authentication integrado
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage para archivos

### **Documentación**
- **Storybook 9.1.2** - Desarrollo y documentación de componentes UI
- **Docusaurus 3.x** - Sitio web de documentación del proyecto
- **TypeDoc** - Documentación automática de código TypeScript
- **OpenAPI 3.0.3** - Especificación de API REST

### **Herramientas de Desarrollo**
- **ESLint** - Linting de código
- **PostCSS + Autoprefixer** - Procesamiento CSS
- **Vitest** - Framework de testing
- **Playwright** - Testing end-to-end

---

## 🏛️ Arquitectura Hexagonal

### **Estructura de Capas**
```
src/
├── domain/           # 🎯 NÚCLEO - Lógica de negocio pura
│   ├── user/         # Entidades y value objects de usuario
│   └── auth/         # Servicios y errores de autenticación
├── application/      # 📋 CASOS DE USO - Orquestación de la lógica
│   └── auth/         # Login, Register, Logout, GetCurrentUser
├── infrastructure/   # 🔌 ADAPTADORES - Implementaciones concretas
│   └── supabase/     # Adaptadores para Supabase (Auth + DB)
└── ui/              # 🎨 INTERFAZ - Componentes React
    ├── components/   # Componentes reutilizables
    ├── pages/        # Páginas de la aplicación
    ├── routes/       # Configuración de rutas
    └── store/        # Stores de Zustand
```

### **Principios Implementados**
- **Inversión de Dependencias**: El dominio no depende de infraestructura
- **Puertos y Adaptadores**: Interfaces claras entre capas
- **Separación de Responsabilidades**: Cada capa tiene un propósito específico
- **Testabilidad**: Lógica de negocio independiente de frameworks

---

## 🗄️ Configuración de Supabase

### **Credenciales del Proyecto**
- **Project ID**: Configurado en variables de entorno
- **URL**: Configurada en variables de entorno  
- **Anon Key**: Configurado en variables de entorno

### **Base de Datos**
- **Tabla Principal**: `public.users`
- **RLS**: Habilitado con políticas de seguridad
- **Triggers**: Automáticos para creación de perfiles
- **Functions**: Custom para manejo de usuarios

### **Configuración de Autenticación**
- **Email Confirmations**: DESHABILITADO (desarrollo)
- **Providers**: Email/Password (OAuth pendiente)
- **Session Management**: Automático con Supabase
- **Password Policy**: Mínimo 8 caracteres

---

## 🎯 Estado Actual del Desarrollo

### **✅ Funcionalidades Completadas**

#### **Autenticación**
- Login con email/password ✅
- Registro de usuarios ✅
- Logout (lógica backend) ✅
- Rutas protegidas ✅
- Persistencia de sesión ✅
- Manejo de errores tipado ✅

#### **UI/UX**
- Layout responsivo con sidebar ✅
- Tema claro/oscuro ✅
- Navegación entre Login/Register ✅
- Loading states ✅
- Validación de formularios ✅

#### **Arquitectura**
- Casos de uso implementados ✅
- Adaptadores de Supabase ✅
- Entidades del dominio ✅
- Dependency injection ✅

#### **Documentación**
- Storybook configurado ✅
- Stories para componentes Layout ✅
- Documentación de arquitectura ✅
- OpenAPI spec creada ✅

### **❌ Funcionalidades Pendientes**
Ver archivo `BACKLOG.md` para el roadmap completo.

---

## 🔧 Comandos de Desarrollo

### **Desarrollo Principal**
```bash
npm start              # Servidor de desarrollo (puerto automático)
npm run build         # Build de producción
npm test              # Ejecutar pruebas
```

### **Documentación**
```bash
npm run storybook     # Componentes UI (puerto 6006)
npm run docs:dev      # Docusaurus (puerto 3000)
npm run docs:api      # Generar TypeDoc
npm run docs:openapi  # Servir OpenAPI (puerto 8082)
```

### **Calidad de Código**
```bash
npm run lint          # Linting (por configurar)
npm run typecheck     # Verificación de tipos (por configurar)
```

---

## 📁 Estructura Detallada del Proyecto

### **Archivos de Configuración**
- `.env` - Variables de entorno (Supabase credentials)
- `vite.config.ts` - Configuración de Vite
- `tailwind.config.js` - Configuración de Tailwind
- `tsconfig.json` - Configuración de TypeScript
- `package.json` - Dependencias y scripts

### **Documentación**
- `README.md` - Documentación principal del proyecto
- `BACKLOG.md` - Product backlog con sprints planificados
- `SUPABASE_SETUP.md` - Guía de configuración de Supabase
- `SUPABASE_CONFIG.md` - Configuración para desarrollo
- `docs/` - Docusaurus site
- `.storybook/` - Configuración de Storybook

### **Código Fuente Principal**
```
src/
├── domain/
│   ├── user/
│   │   ├── User.ts                    # Entidad Usuario
│   │   └── UserRepository.ts          # Puerto del repositorio
│   └── auth/
│       ├── AuthService.ts             # Puerto del servicio de auth
│       └── AuthErrors.ts              # Errores del dominio
├── application/
│   └── auth/
│       ├── LoginUser.ts               # Caso de uso: Login
│       ├── RegisterUser.ts            # Caso de uso: Registro
│       ├── LogoutUser.ts              # Caso de uso: Logout
│       └── GetCurrentUser.ts          # Caso de uso: Usuario actual
├── infrastructure/
│   └── supabase/
│       ├── supabaseClient.ts          # Cliente configurado
│       ├── SupabaseAuthService.ts     # Adaptador de autenticación
│       ├── SupabaseUserRepository.ts  # Adaptador de usuarios
│       └── migrations/                # Scripts SQL
└── ui/
    ├── App.tsx                        # Componente raíz
    ├── components/
    │   └── layout/                    # Layout principal
    │       ├── Header.tsx             # Barra superior
    │       ├── Sidebar.tsx            # Menú lateral
    │       ├── Footer.tsx             # Pie de página
    │       ├── Body.tsx               # Contenido principal
    │       └── Layout.tsx             # Layout completo
    ├── pages/
    │   ├── Home.tsx                   # Página inicial
    │   ├── Login.tsx                  # Página de login
    │   ├── Register.tsx               # Página de registro
    │   ├── Dashboard.tsx              # Dashboard principal
    │   └── Configuracion.tsx          # Página de configuración
    ├── routes/
    │   └── PrivateRoute.tsx           # Guard para rutas protegidas
    └── store/
        ├── useAuth.ts                 # Store de autenticación
        └── useTheme.ts                # Store de tema
```

---

## 🚀 Flujos Implementados

### **Registro de Usuario**
1. Usuario completa formulario en `/register`
2. `RegisterUser` use case valida datos
3. `SupabaseAuthService` crea usuario en Supabase
4. Trigger de DB crea perfil en tabla `users`
5. Login automático y redirección a `/dashboard`

### **Login de Usuario**
1. Usuario completa formulario en `/login`
2. `LoginUser` use case valida credenciales
3. `SupabaseAuthService` autentica con Supabase
4. Session se guarda en store con persistencia
5. Redirección a `/dashboard`

### **Rutas Protegidas**
1. `PrivateRoute` verifica autenticación
2. Si no autenticado, llama `getCurrentUser`
3. Muestra loading durante verificación
4. Redirige a `/login` si no autenticado

---

## 🔒 Seguridad Implementada

### **Autenticación**
- Passwords hasheados por Supabase
- JWT tokens con expiración
- Session management automático
- Logout seguro que invalida tokens

### **Base de Datos**
- Row Level Security (RLS) habilitado
- Políticas: usuarios solo acceden a sus datos
- Triggers para integridad de datos
- Validación en casos de uso

### **Frontend**
- Validación de inputs en UI y lógica
- Manejo seguro de tokens
- No exposición de credenciales
- Rutas protegidas con guards

---

## 🐛 Debugging y Logs

### **Logs Implementados**
- Console logs en `SupabaseAuthService` para debugging
- Error tracking en casos de uso
- Estado de loading en componentes UI

### **Herramientas de Debug**
- React DevTools para componentes
- Zustand DevTools para estado
- Supabase Dashboard para DB
- Browser Network tab para requests

---

## 📊 Métricas y Monitoring

### **Performance**
- Build time: ~39 segundos
- Bundle size: 550.18 kB (167.04 kB gzipped)
- Hot reload: <200ms

### **Calidad de Código**
- TypeScript strict mode habilitado
- Arquitectura hexagonal implementada
- Separation of concerns respetada
- Error handling robusto

---

## 🔄 Próximos Pasos

### **Inmediatos (Sprint 1)**
- Header con información de usuario
- Botón de logout funcional
- Dashboard con datos personalizados

### **Mediano Plazo**
- Reset de contraseña
- Perfil de usuario editable
- OAuth providers (Google/GitHub)

### **Largo Plazo**
- Testing automatizado
- CI/CD pipeline
- Monitoreo de producción
- Escalabilidad horizontal

---

## 🆘 Troubleshooting Común

### **Error 400 en Registro**
- Verificar email confirmations deshabilitado en Supabase
- Revisar configuración de URL redirect

### **Usuario no se autentica**
- Verificar variables de entorno
- Comprobar migración SQL ejecutada
- Revisar políticas RLS en tabla users

### **Build failures**
- Verificar dependencias actualizadas
- Comprobar TypeScript errors
- Revisar imports y exports

---

## 📞 Información de Contacto del Proyecto

### **Repositorio**
- Ubicación: Local development
- Rama principal: `main`
- Rama de desarrollo: `develop`

### **Despliegue**
- Desarrollo: `http://localhost:8083/` (puerto variable)
- Producción: Por configurar

---

*Última actualización: 2025-08-14*  
*Generado por Claude Code para facilitar el desarrollo colaborativo*