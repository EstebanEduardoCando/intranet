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

### ✅ **Sprint 7 - COMPLETADO (ESTABLE)**
- **Sistema de Auditoría Completo**: Triggers automáticos, tablas audit_logs, user_notifications, system_configurations
- **Notificaciones Persistentes**: Base de datos, casos de uso, persistencia across login/logout
- **Administración de Catálogos**: 4 páginas completas (Empresas, Cargos, Roles, Módulos)
- **Historial de Auditoría**: Pantalla con filtros avanzados, estadísticas, JSON diff viewer
- **Personalización de Iconos**: 19 iconos disponibles para módulos con preview visual
- **Gestión de Permisos**: 18 permisos granulares categorizados por área
- **Arquitectura de BD Expandida**: Schema completo con auditoría y configuraciones
- **Rol Dinámico**: Header corregido para mostrar rol real del usuario
- **Documentación Completa**: Guías de pruebas, resúmenes de implementación
- **Vista Jerárquica**: Módulos con estructura padre-hijo, vista tabla/árbol

### ✅ **Sprint 6 - COMPLETADO (ESTABLE)**
- **Gestión de Empresa y Cargo**: Modal combinado para asignar empresa + cargo simultáneamente
- **Arquitectura BD Corregida**: Implementación usando `position_assignments` correctamente
- **Casos de Uso Unificados**: `AssignUserCompanyAndPosition` reemplaza asignaciones separadas
- **UX Mejorada**: Un solo diálogo intuitivo en lugar de dos modales separados
- **Validación Robusta**: Ambos campos empresa y cargo son requeridos
- **Persistencia Real**: Los datos se guardan correctamente en la estructura de BD
- **Eliminación de Dependencias Circulares**: Sin errores de "assign company first" o "assign position first"

### ✅ **Sprint 5 - COMPLETADO (ESTABLE)**
- **User Management Completo**: CRUD total funcional, búsqueda optimizada, filtros avanzados
- **Sistema de Notificaciones**: Contexto completo, header integrado, auto-close 3s para todos
- **Modal de Edición**: Formulario completo para actualizar usuarios (sin errores)
- **Gestión de Roles**: Asignación/remoción de roles funcional sin errores PGRST204
- **Arquitectura de BD**: Código adaptado a estructura real de Supabase
- **Testing**: Scripts de validación para operaciones críticas
- **Error Handling**: Manejo robusto de errores con logging
- **Navegación**: Breadcrumbs corregidos para todas las rutas
- **Fix PGRST204**: Error de roles completamente resuelto con SQL y código corregido
- **Lint y TypeCheck**: Código limpiado, console.logs eliminados, tipos mejorados

### ✅ **Sprint 4 - COMPLETADO**
- **User Management Base**: Página completa con tabla, filtros, acciones básicas
- **Navegación**: Breadcrumbs funcionales, rutas dinámicas

### ✅ **Sprint 3 - COMPLETADO**  
- **Autenticación**: Login/Register/Logout/Rutas protegidas/Reset password/ChangePassword
- **UI/UX**: Header con usuario, sidebar dinámico, breadcrumbs, toggle sidebar
- **Perfil**: Página completa con edición, guardado real y cambio de contraseña
- **Arquitectura**: Implementación hexagonal completa y respetada
- **Documentación**: Storybook + Docusaurus configurados
- **Modelo de Datos**: Schema completo con Person + UserProfile + auth.users
- **Sistema de Módulos**: Sidebar dinámico desde BD, jerarquías, rutas automáticas

### 🔄 **Funcionalidades Operativas (100% ESTABLES)**
- **UserManagement**: ✅ CRUD completo, búsqueda, filtros, gestión de roles, asignación empresa+cargo
- **Administración de Catálogos**: ✅ 4 páginas completas con CRUD real, filtros, auditoría automática
- **Sistema de Auditoría**: ✅ Triggers automáticos, historial completo, filtros avanzados
- **Notificaciones Persistentes**: ✅ Base de datos, persistencia, sincronización cross-session
- **Asignación Empresa-Cargo**: ✅ Modal unificado, persistencia real, validación robusta
- **Notificaciones**: ✅ Sistema completo con auto-close 3s para todos los tipos  
- **Autenticación**: ✅ Sistema completo con cambio de contraseña
- **Navegación**: ✅ Breadcrumbs corregidos, sidebar dinámico, rutas protegidas
- **Profile**: ✅ Edición completa de perfil personal
- **Arquitectura**: ✅ Repositorios e inyección de dependencias correctos

### ✅ **Issues Sprint 7 - RESUELTAS**
- ✅ **Module Management**: Form/BD alignment y CRUD persistence completamente funcional
- ✅ **Audit Triggers**: Error modules "company_id" resuelto con triggers v2
- ✅ **Sidebar Navigation**: Usa campo route dinámico de BD + iconos configurables
- ✅ **Module Schema**: Campos faltantes agregados (route, is_visible, required_role)

### ⚠️ **Issues Pendientes Sprint 7**
- **RLS Policy**: user_notifications tabla requiere ajuste de políticas de seguridad  
- **TypeScript**: Algunos tipos necesitan refinamiento en repositorios
- **Position Management**: Error de undefined en carga inicial

### ⏳ **Próximos Sprints**
1. **Sprint 8**: Fixes Sprint 7 + Optimización bundle y code splitting
2. **Sprint 9**: Upload avatar, OAuth, notificaciones push
3. **Sprint 10**: Funcionalidades adicionales empresa/cargo (reportes, dashboard)

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
├── company/
│   └── Company.ts                       # Entidad Company + tipos
├── position/
│   └── Position.ts                      # Entidad Position + tipos
├── audit/
│   ├── AuditLog.ts                      # Entidad AuditLog + tipos
│   └── AuditRepository.ts               # Puerto auditoría
├── notification/
│   ├── UserNotification.ts              # Entidad UserNotification
│   └── UserNotificationRepository.ts   # Puerto notificaciones
└── modules/
    └── Module.ts                        # Entidad Module + jerarquías

src/application/
├── auth/                                # Casos de uso autenticación
├── user/
│   ├── UpdateUserProfile.ts            # Caso de uso actualización perfil
│   ├── ChangePassword.ts               # Caso de uso cambio contraseña
│   └── AssignUserCompanyAndPosition.ts # Caso de uso asignación empresa+cargo
├── audit/
│   ├── GetAuditHistory.ts              # Caso de uso historial auditoría
│   ├── GetAuditStats.ts                # Caso de uso estadísticas auditoría
│   └── GetRecordHistory.ts             # Caso de uso historial registro
├── notification/
│   ├── CreateUserNotification.ts       # Caso de uso crear notificación
│   ├── GetUserNotifications.ts         # Caso de uso obtener notificaciones
│   └── MarkNotificationAsRead.ts       # Caso de uso marcar como leída
└── modules/
    └── GetModules.ts                    # Caso de uso obtener módulos

src/infrastructure/supabase/
├── SupabaseAuthService.ts               # Servicio auth integrado
├── SupabasePersonRepository.ts         # Repositorio personas
├── SupabaseUserProfileRepository.ts    # Repositorio perfiles
├── SupabaseUserRepository.ts           # Repositorio usuarios con empresa+cargo
├── SupabaseCompanyRepository.ts        # Repositorio empresas
├── SupabasePositionRepository.ts       # Repositorio cargos
├── SupabaseAuditRepository.ts          # Repositorio auditoría
├── SupabaseUserNotificationRepository.ts # Repositorio notificaciones
└── SupabaseModuleRepository.ts         # Repositorio módulos

src/ui/
├── pages/
│   ├── Register.tsx                     # Formulario registro completo
│   ├── Profile.tsx                      # Página perfil con cambio contraseña
│   ├── PlaceholderPage.tsx             # Páginas en desarrollo
│   ├── TestNotifications.tsx           # Página prueba notificaciones
│   └── management/
│       ├── UserManagement.tsx          # Gestión completa de usuarios
│       ├── CompanyManagement.tsx       # Gestión empresas con auditoría
│       ├── PositionManagement.tsx      # Gestión cargos con auditoría
│       ├── RoleManagement.tsx          # Gestión roles con 18 permisos
│       ├── ModuleManagement.tsx        # Gestión módulos con 19 iconos
│       └── AuditHistory.tsx            # Historial de auditoría
├── components/
│   ├── layout/
│   │   ├── Header.tsx                   # Header con rol dinámico
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
- **Performance**: Build 41s, Bundle 635kB (necesita optimización Sprint 8)
- **Calidad**: TypeScript strict, arquitectura hexagonal, error handling robusto
- **Lint**: ESLint configurado, 100+ warnings corregidas, console.logs eliminados
- **TODOs**: 2 documentados en BACKLOG.md (filtrado módulos, verificación contraseña)
- **Tests**: Scripts completos para validación de roles y detección de errores
- **Auditoría**: Sistema completo con triggers automáticos y 4 tablas de seguimiento
- **Administración**: 4 páginas completas con CRUD, filtros y validación

## 🔐 Configuración y Seguridad
- **Variables de entorno**: Configuradas en .env (Supabase credenciales)
- **RLS**: Row Level Security habilitado en Supabase
- **Autenticación**: Email confirmations DESHABILITADO (desarrollo)
- **Base de datos**: Schema completo con persons, user_profiles, companies, roles

## 🧹 Limpieza de Archivos (Sprint 5+)
**Archivos eliminados** (temporales/redundantes):
- README.md → Info consolidada en CLAUDE.md
- SECURITY.md → Info integrada en documentación
- SPRINT4_COMPLETE.md → Sprint completado
- SPRINT_5_SUMMARY.md → Sprint completado  
- DATABASE_SETUP.md → Info consolidada en CLAUDE.md
- SUPABASE_CONFIG.md → Setup temporal completado
- SUPABASE_SETUP.md → Setup temporal completado
- *.fixed.ts / *.original.ts → Archivos de trabajo temporal

**Archivos de contexto únicos**:
- CLAUDE.md → Contexto principal del proyecto
- BACKLOG.md → TODOs documentados y próximos sprints

---

## 🔧 **Fix PGRST204 - Gestión de Roles** (Sprint 5+)
**Problema**: Error `PGRST204 - Could not find the 'assigned_at' column of 'user_roles'`

**Solución Implementada**:
- ✅ **SQL Fix**: Agregadas columnas `assigned_at` y `assigned_by` a `user_roles`
- ✅ **Código Actualizado**: `SupabaseRoleRepository` adaptado a estructura real de BD
- ✅ **Validación UUID**: Manejo correcto de `assigned_by` como UUID
- ✅ **Tests Completos**: Scripts de detección, corrección y validación
- ✅ **Documentación**: `ROLE_MANAGEMENT_SOLUTION.md` con proceso completo

**Estado**: ✅ **RESUELTO** - Gestión de roles 100% funcional sin errores

---

*Actualizado: 2025-08-19 - Sprint 7+ COMPLETADO - Sistema completo administración catálogos con CRUD real funcional, auditoría automática, sidebar dinámico con rutas BD, 4 páginas gestión, 19 iconos configurables, form/BD alineados*