# 🤖 CLAUDE.md - Contexto del Proyecto Intranet

## 📋 Información General
**Sistema de Intranet con Arquitectura Hexagonal** - React + TypeScript + Supabase

**Objetivo**: Plataforma de intranet empresarial robusta y escalable siguiendo principios de arquitectura limpia.

## 🏗️ Stack Tecnológico
- **Frontend**: React 18 + TypeScript + Vite + MUI + Tailwind + Zustand
- **Backend**: Supabase (PostgreSQL + Auth + RLS + Storage)
- **Docs**: Storybook + Docusaurus + TypeDoc
- **Testing**: Vitest + Playwright

## 🏛️ Arquitectura Hexagonal
```
src/
├── domain/           # 🎯 Lógica de negocio pura
├── application/      # 📋 Casos de uso
├── infrastructure/   # 🔌 Adaptadores (Supabase)
└── ui/              # 🎨 Componentes React
```

**Principios**: Inversión de dependencias, puertos y adaptadores, separación de responsabilidades.

## 🗄️ Configuración de Supabase
- **Credenciales**: En variables de entorno (.env)
- **Base de Datos**: Schema actualizado con `persons`, `user_profiles`, integración con `auth.users`
- **Auth**: Email confirmations DESHABILITADO (desarrollo)
- **Políticas**: RLS habilitado, users acceden solo a sus datos

## 🎯 Estado Actual

### ✅ **Sprint 3 - COMPLETADO**
- **Autenticación**: Login/Register/Logout/Rutas protegidas/Reset password/ChangePassword
- **UI/UX**: Header con usuario, sidebar dinámico, breadcrumbs, toggle sidebar
- **Perfil**: Página completa con edición, guardado real y cambio de contraseña
- **Arquitectura**: Implementación hexagonal completa y respetada
- **Documentación**: Storybook + Docusaurus configurados
- **Modelo de Datos**: Schema completo con Person + UserProfile + auth.users
- **Sistema de Módulos**: Sidebar dinámico desde BD, jerarquías, rutas automáticas
- **User Management**: Página completa con tabla, filtros, acciones CRUD
- **Herramientas**: lint y typecheck configurados
- **Navegación**: Breadcrumbs funcionales, sidebar collapsible

### 🔄 **Funcionalidades Implementadas**
- **ChangePassword**: Validaciones, UI completa, integración real
- **GetModules**: Caso de uso para módulos desde BD 
- **Breadcrumbs**: Sistema de migas de pan contextual
- **Toggle Sidebar**: Botón hamburguesa, espaciado dinámico
- **Páginas Placeholder**: Para módulos en desarrollo
- **Rutas Dinámicas**: Solo submódulos navegables

### ⏳ **Próximos Sprints**
1. **Sprint 4**: Implementar funcionalidades reales en User Management
2. **Sprint 5**: Optimización bundle y code splitting
3. **Sprint 6**: Upload avatar, OAuth, notificaciones

Ver `BACKLOG.md` para roadmap detallado.

## 📝 **Reglas de Desarrollo**

### **⚠️ REGLA CRÍTICA: Gestión de TODOs**
**TODOS los comentarios TODO encontrados en el código DEBEN ser registrados en `BACKLOG.md` inmediatamente.**

- ❌ **NO dejar TODOs huérfanos** en el código sin registro
- ✅ **SIEMPRE documentar** en BACKLOG con contexto y prioridad
- 🔄 **Revisar TODOs** al inicio de cada sprint
- 📋 **Formato**: `TODO: [Descripción] - Archivo:línea - Prioridad: [Alta/Media/Baja]`

### **Ejemplo:**
```typescript
// ❌ MAL - TODO sin contexto
// TODO: arreglar esto

// ✅ BIEN - TODO documentado
// TODO: Implementar UpdateUserProfile - Profile.tsx:119 - Prioridad: Alta
// Registrado en BACKLOG.md Sprint 3
```

## 🔧 Comandos de Desarrollo
```bash
npm start              # Servidor desarrollo
npm run build          # Build producción
npm run storybook      # Documentación componentes
npm run docs:dev       # Documentación proyecto
npm run lint           # ✅ ESLint configurado
npm run typecheck      # ✅ TypeScript checker
```

## 🏗️ Estructura del Proyecto
```
src/domain/
├── user/
│   ├── User.ts                          # Entidades User, UserProfile, CreateUserData
│   └── Person.ts                        # Entidad Person + helpers
└── modules/
    └── Module.ts                        # Entidad Module + jerarquías

src/application/
├── auth/                                # Casos de uso autenticación
├── user/
│   ├── UpdateUserProfile.ts            # Caso de uso actualización perfil
│   └── ChangePassword.ts               # Caso de uso cambio contraseña
└── modules/
    └── GetModules.ts                    # Caso de uso obtener módulos

src/infrastructure/supabase/
├── SupabaseAuthService.ts               # Servicio auth integrado
├── SupabasePersonRepository.ts         # Repositorio personas
├── SupabaseUserProfileRepository.ts    # Repositorio perfiles
└── SupabaseModuleRepository.ts         # Repositorio módulos

src/ui/
├── pages/
│   ├── Register.tsx                     # Formulario registro completo
│   ├── Profile.tsx                      # Página perfil con cambio contraseña
│   ├── PlaceholderPage.tsx             # Páginas en desarrollo
│   └── management/
│       └── UserManagement.tsx          # Gestión completa de usuarios
├── components/
│   ├── layout/
│   │   ├── Header.tsx                   # Header con toggle sidebar
│   │   ├── Sidebar.tsx                  # Sidebar dinámico desde BD
│   │   └── Layout.tsx                   # Layout con breadcrumbs
│   └── common/
│       └── Breadcrumbs.tsx             # Sistema de migas de pan
└── store/useAuth.ts                     # Store con sincronización
```

## 🚀 Flujos Implementados
- **Login**: Validación → Supabase Auth → Session store → Dashboard
- **Register**: Validación completa → Crear Person + UserProfile + Auth → Dashboard  
- **Update Profile**: Validación → UpdateUserProfile → refreshUser → Sync UI
- **Change Password**: Validación → ChangePassword → Confirmación éxito
- **Navegación**: Sidebar dinámico → Breadcrumbs → Rutas específicas
- **Rutas Protegidas**: PrivateRoute verifica auth → Loading → Redirect si necesario
- **Sincronización**: Cambios BD → Estado global → UI tiempo real

## 🔒 Seguridad
- Passwords hasheados por Supabase, JWT tokens, RLS políticas
- Validación UI y lógica, manejo seguro tokens, rutas protegidas

## 📊 Métricas
- **Performance**: Build 41s, Bundle 635kB (necesita optimización)
- **Calidad**: TypeScript strict, arquitectura hexagonal, error handling

---

*Actualizado: 2025-08-16 - Sprint 3 COMPLETADO - Sistema de módulos, navegación y UX mejorados*