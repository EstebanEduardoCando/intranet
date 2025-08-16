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
- **Base de Datos**: `public.users` con RLS habilitado
- **Auth**: Email confirmations DESHABILITADO (desarrollo)
- **Políticas**: Users acceden solo a sus datos

## 🎯 Estado Actual

### ✅ **Completado**
- **Autenticación**: Login/Register/Logout/Rutas protegidas/Reset password
- **UI/UX**: Header con usuario, sidebar, tema claro/oscuro
- **Perfil**: Página completa con edición y cambio de contraseña
- **Arquitectura**: Implementación hexagonal completa
- **Documentación**: Storybook + Docusaurus configurados

### 🔧 **Deuda Técnica Crítica**
- **Casos de Uso Faltantes**: UpdateUserProfile, ChangePassword
- **Violación Arquitectural**: Profile.tsx usa directamente SupabaseAuthService  
- **Funcionalidad Incompleta**: Profile solo simula guardado, updatePassword no implementado
- **Herramientas**: Falta configuración de lint y typecheck

### ⏳ **Próximos Sprints**
1. **Sprint 3 (CRÍTICO)**: Resolver deuda técnica y completar funcionalidades básicas
2. **Sprint 4**: Optimización bundle y mejoras UX
3. **Sprint 5**: Upload avatar, OAuth, notificaciones

Ver `BACKLOG.md` para roadmap detallado.

## 🔧 Comandos de Desarrollo
```bash
npm start              # Servidor desarrollo
npm run build          # Build producción
npm run storybook      # Documentación componentes
npm run docs:dev       # Documentación proyecto
npm run lint          # ⚠️ Por configurar (Sprint 3)
npm run typecheck     # ⚠️ Por configurar (Sprint 3)
```

## 🏗️ Estructura del Proyecto
```
src/domain/user/User.ts                    # Entidad Usuario
src/application/auth/                      # Casos de uso auth
src/infrastructure/supabase/               # Adaptadores Supabase
src/ui/pages/Profile.tsx                   # Página perfil usuario
src/ui/components/layout/Header.tsx        # Header con usuario
```

## 🚀 Flujos Implementados
- **Login**: Validación → Supabase Auth → Session store → Dashboard
- **Register**: Validación → Supabase Auth → Auto-login → Dashboard  
- **Rutas Protegidas**: PrivateRoute verifica auth → Loading → Redirect si necesario

## 🔒 Seguridad
- Passwords hasheados por Supabase, JWT tokens, RLS políticas
- Validación UI y lógica, manejo seguro tokens, rutas protegidas

## 📊 Métricas
- **Performance**: Build 41s, Bundle 635kB (necesita optimización)
- **Calidad**: TypeScript strict, arquitectura hexagonal, error handling

---

*Actualizado: 2025-08-16 - Análisis deuda técnica completado*