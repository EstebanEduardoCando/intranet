# 📋 Product Backlog - Sistema de Intranet

## 🌐 Información de Contexto Global

### **Stack Tecnológico**
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Material-UI (MUI) + Tailwind CSS
- **Estado**: Zustand con persistencia
- **Arquitectura**: Hexagonal (Puertos y Adaptadores)
- **Base de Datos**: Supabase (PostgreSQL + Auth)
- **Documentación**: Storybook + Docusaurus + TypeDoc

### **Estructura del Proyecto**
```
src/
├── domain/           # Entidades y puertos (núcleo del negocio)
├── application/      # Casos de uso (lógica de aplicación)
├── infrastructure/   # Adaptadores (Supabase, APIs externas)
└── ui/              # Interfaz de usuario (React components)
```

### **Configuración de Supabase**
- **Project ID**: Configurado en .env
- **URL**: Configurada en .env
- **Tabla**: `public.users` con RLS habilitado
- **Auth**: Email confirmations DESHABILITADO para desarrollo
- **Políticas**: Users pueden leer/escribir solo sus propios datos

### **Estado Actual de Autenticación**
- ✅ Login/Register implementado con arquitectura hexagonal
- ✅ Rutas protegidas funcionando
- ✅ Persistencia de sesión
- ✅ Manejo de errores tipado
- ✅ Integración completa con Supabase
- ❌ UI de logout faltante
- ❌ Información de usuario en header faltante

### **URLs del Proyecto**
- **App**: `http://localhost:8083/` (puerto puede variar)
- **Storybook**: `http://localhost:6006/`
- **Docs**: `http://localhost:3000/` (Docusaurus)

### **Comandos Importantes**
```bash
npm start              # Servidor de desarrollo
npm run build         # Build de producción
npm run storybook     # Documentación de componentes
npm run docs:dev      # Documentación del proyecto
```

---

## 🎯 Sprint Backlog

### **Sprint 1: UX Inmediata - Header y Dashboard Básico**
**Estado**: ✅ Completado  
**Estimación**: 45 minutos  
**Prioridad**: 🚨 Alta

**Objetivo**: Proporcionar una experiencia de usuario completa básica con información del usuario visible y capacidad de logout.

#### **Contexto del Sprint**
- El header actual (`src/ui/components/layout/Header.tsx`) solo tiene toggle de tema
- El dashboard (`src/ui/pages/Dashboard.tsx`) está vacío
- No existe manera de hacer logout desde la UI
- El store de auth (`src/ui/store/useAuth.ts`) ya tiene toda la lógica necesaria

#### **Tareas**
- [x] **Tarea 1.1**: Actualizar Header para mostrar información del usuario ✅
  - Agregar avatar/nombre del usuario ✅
  - Agregar dropdown menu con opciones ✅
  - Implementar botón de logout funcional ✅
  
- [x] **Tarea 1.2**: Mejorar Dashboard con datos del usuario ✅
  - Mostrar información de bienvenida personalizada ✅
  - Agregar cards con estadísticas básicas ✅
  - Mostrar fecha de último acceso ✅
  
- [x] **Tarea 1.3**: Añadir confirmación de logout ✅
  - Dialog de confirmación antes de cerrar sesión ✅
  - Mensaje de éxito post-logout ✅

#### **Criterios de Aceptación**
- [x] Usuario puede ver su nombre/email en el header ✅
- [x] Usuario puede hacer logout desde el header ✅
- [x] Dashboard muestra información personalizada del usuario ✅
- [x] Logout redirige correctamente al login ✅

**Fecha de Inicio**: 2025-08-15  
**Fecha de Finalización**: 2025-08-15

---

### **Sprint 2: Reset de Contraseña Completo**
**Estado**: ✅ Completado  
**Estimación**: 30 minutos  
**Prioridad**: 🔶 Media-Alta

**Objetivo**: Implementar el flujo completo de recuperación de contraseña.

#### **Contexto del Sprint**
- La lógica de reset ya existe en `SupabaseAuthService.resetPassword()`
- Necesita página UI dedicada para el flujo
- Supabase puede enviar emails de reset (configurado en proyecto)

#### **Tareas**
- [x] **Tarea 2.1**: Crear página de Reset Password ✅
  - Formulario para solicitar reset por email ✅
  - Validación de email ✅
  - Estados de loading y confirmación ✅
  
- [x] **Tarea 2.2**: Crear página de New Password ✅
  - Formulario para establecer nueva contraseña ✅
  - Validación de tokens de reset ✅
  - Confirmación de contraseña ✅

- [x] **Tarea 2.3**: Agregar navegación entre páginas ✅
  - Link en Login hacia reset password ✅
  - Manejo de URLs con tokens ✅
  - Redirección post-reset ✅

- [x] **Tarea 2.4**: Crear página Mi Perfil ✅
  - Visualizar información del usuario ✅
  - Formulario editable para actualizar datos ✅
  - Panel lateral con avatar y datos básicos ✅

- [x] **Tarea 2.5**: Integrar cambio de contraseña en Mi Perfil ✅
  - Dialog modal para cambio de contraseña ✅
  - Validación de contraseñas ✅
  - Estados de loading y error ✅

- [x] **Tarea 2.6**: Agregar navegación desde Profile Menu ✅
  - "Mi Perfil" redirige a página de perfil ✅
  - Integración con Header existente ✅

#### **Criterios de Aceptación**
- [x] Usuario puede solicitar reset desde login ✅
- [x] Sistema envía email de reset ✅
- [x] Usuario puede establecer nueva contraseña ✅
- [x] Flujo completo funciona end-to-end ✅
- [x] Usuario puede acceder a su perfil desde Header ✅
- [x] Usuario puede editar información personal ✅
- [x] Usuario puede cambiar contraseña desde perfil ✅

**Fecha de Inicio**: 2025-08-15  
**Fecha de Finalización**: 2025-08-15

---

### **Sprint 3: Perfil de Usuario Completo**
**Estado**: ⏳ Pendiente  
**Estimación**: 60 minutos  
**Prioridad**: 🔶 Media

**Objetivo**: Permitir a los usuarios gestionar completamente su perfil e información personal.

#### **Contexto del Sprint**
- Requiere nuevos casos de uso en `application/user/`
- Extensión del `UserRepository` para updates
- Nueva página de perfil en `ui/pages/`
- Posible upload de avatar (integración con Supabase Storage)

#### **Tareas**
- [ ] **Tarea 3.1**: Implementar casos de uso de perfil
  - `UpdateUserProfile` use case
  - `ChangePassword` use case
  - `UploadAvatar` use case (opcional)
  
- [ ] **Tarea 3.2**: Crear página de perfil
  - Formulario de edición de datos personales
  - Sección de cambio de contraseña
  - Preview/upload de avatar
  
- [ ] **Tarea 3.3**: Agregar validaciones y seguridad
  - Validación de contraseña actual
  - Confirmación de cambios importantes
  - Manejo de errores específicos

#### **Criterios de Aceptación**
- [ ] Usuario puede editar nombre y email
- [ ] Usuario puede cambiar contraseña
- [ ] Cambios se reflejan inmediatamente en la UI
- [ ] Validaciones previenen datos inválidos

**Fecha de Inicio**: _Pendiente_  
**Fecha de Finalización**: _Pendiente_

---

### **Sprint 4: OAuth Providers (Google + GitHub)**
**Estado**: ⏳ Pendiente  
**Estimación**: 50 minutos  
**Prioridad**: 🔸 Media-Baja

**Objetivo**: Permitir login/registro mediante proveedores OAuth para mejorar UX.

#### **Contexto del Sprint**
- Requiere configuración en Supabase Dashboard
- Extensión del `AuthService` para OAuth
- Modificación de páginas Login/Register
- Manejo de conflictos de email existentes

#### **Tareas**
- [ ] **Tarea 4.1**: Configurar OAuth en Supabase
  - Habilitar Google OAuth en dashboard
  - Habilitar GitHub OAuth en dashboard
  - Configurar redirect URLs
  
- [ ] **Tarea 4.2**: Implementar OAuth en AuthService
  - Métodos para Google/GitHub login
  - Manejo de errores OAuth
  - Mapeo de datos de providers
  
- [ ] **Tarea 4.3**: Actualizar UI de Login/Register
  - Botones de OAuth
  - Estados de loading para OAuth
  - Manejo de errores de OAuth

#### **Criterios de Aceptación**
- [ ] Usuario puede registrarse con Google
- [ ] Usuario puede registrarse con GitHub
- [ ] OAuth funciona tanto en login como register
- [ ] Datos del provider se mapean correctamente

**Fecha de Inicio**: _Pendiente_  
**Fecha de Finalización**: _Pendiente_

---

### **Sprint 5: Gestión Avanzada de Sesión**
**Estado**: ⏳ Pendiente  
**Estimación**: 40 minutos  
**Prioridad**: 🔸 Baja

**Objetivo**: Implementar gestión robusta de sesiones con auto-refresh y detección de expiración.

#### **Contexto del Sprint**
- Supabase maneja tokens JWT con expiración
- Requiere interceptors para auto-refresh
- Mejoras en el store de auth
- Notificaciones de sesión expirada

#### **Tareas**
- [ ] **Tarea 5.1**: Implementar auto-refresh de tokens
  - Interceptor para requests automáticos
  - Refresh silencioso de tokens
  - Manejo de refresh fallido
  
- [ ] **Tarea 5.2**: Detección de sesión expirada
  - Monitoring de estado de sesión
  - Notificaciones al usuario
  - Logout automático cuando sea necesario
  
- [ ] **Tarea 5.3**: Mejoras de UX para sesiones
  - Indicadores de estado de conexión
  - Warnings antes de expiración
  - Opciones de "mantener sesión"

#### **Criterios de Aceptación**
- [ ] Tokens se refrescan automáticamente
- [ ] Usuario es notificado de problemas de sesión
- [ ] No hay interrupciones inesperadas de sesión
- [ ] Logout automático funciona correctamente

**Fecha de Inicio**: _Pendiente_  
**Fecha de Finalización**: _Pendiente_

---

### **Sprint 6: Verificación de Email y Administración de Cuenta**
**Estado**: ⏳ Pendiente  
**Estimación**: 45 minutos  
**Prioridad**: 🔸 Baja

**Objetivo**: Completar funcionalidades de administración de cuenta incluyendo verificación de email y eliminación de cuenta.

#### **Contexto del Sprint**
- Requiere reactivar email confirmations en Supabase
- Nuevos casos de uso para gestión de cuenta
- Páginas adicionales para flows de verificación
- Consideraciones de seguridad para eliminación

#### **Tareas**
- [ ] **Tarea 6.1**: Implementar verificación de email
  - Flow de envío de email de verificación
  - Página de confirmación de email
  - Estados de cuenta no verificada
  
- [ ] **Tarea 6.2**: Funcionalidad de eliminación de cuenta
  - Caso de uso para eliminación
  - Confirmación múltiple para seguridad
  - Cleanup de datos relacionados
  
- [ ] **Tarea 6.3**: Mejoras de seguridad
  - Confirmación de contraseña para acciones críticas
  - Logs de actividad de cuenta
  - Notificaciones de cambios importantes

#### **Criterios de Aceptación**
- [ ] Usuario puede verificar su email
- [ ] Funciones están limitadas si email no verificado
- [ ] Usuario puede eliminar su cuenta de forma segura
- [ ] Acciones críticas requieren confirmación adicional

**Fecha de Inicio**: _Pendiente_  
**Fecha de Finalización**: _Pendiente_

---

## 📊 Resumen del Backlog

| Sprint | Prioridad | Estimación | Estado | Inicio | Fin |
|--------|-----------|------------|--------|--------|-----|
| Sprint 1: UX Inmediata | 🚨 Alta | 45 min | ✅ Completado | 2025-08-15 | 2025-08-15 |
| Sprint 2: Reset Password | 🔶 Media-Alta | 30 min | ✅ Completado | 2025-08-15 | 2025-08-15 |
| Sprint 3: Perfil Usuario | 🔶 Media | 60 min | ⏳ Pendiente | - | - |
| Sprint 4: OAuth Providers | 🔸 Media-Baja | 50 min | ⏳ Pendiente | - | - |
| Sprint 5: Gestión Sesión | 🔸 Baja | 40 min | ⏳ Pendiente | - | - |
| Sprint 6: Verificación Email | 🔸 Baja | 45 min | ⏳ Pendiente | - | - |

**Total Estimado**: 4 horas 30 minutos

---

## 🔄 Estados Posibles
- ⏳ **Pendiente**: No iniciado
- 🚧 **En Progreso**: Desarrollo activo
- ✅ **Completado**: Finalizado y testeado
- ❌ **Bloqueado**: Requiere resolución de dependencias
- 🔄 **En Revisión**: Esperando feedback o testing

---

*Última actualización: 2025-08-14*