# 📋 Product Backlog - Sistema de Intranet

## 🎯 Estado Actual (Agosto 2025)

### ✅ **Sprints Completados**
- **Sprint 1**: Header + Dashboard + Logout funcional ✅
- **Sprint 2**: Reset password + Página Mi Perfil completa ✅

### 🔧 **Deuda Técnica Crítica**
**🔴 Impacta funcionalidad**:
1. **Casos de Uso Faltantes**: UpdateUserProfile, ChangePassword
2. **Violación Arquitectura**: Profile.tsx usa directamente SupabaseAuthService
3. **Funcionalidad Incompleta**: Profile simula guardado, updatePassword no implementado
4. **Herramientas**: Falta ESLint y typecheck

**🟡 Mejoras calidad**:
- Bundle 635kB (necesita code splitting)
- Datos mock en Profile
- Error handling inconsistente

## 🎯 Sprints Restructurados

### **Sprint 3: Deuda Técnica Crítica** 🚨
**Tiempo**: 45 min | **Prioridad**: CRÍTICA

**Tareas**:
- [ ] **3.1**: Crear casos de uso faltantes (15 min)
  - `UpdateUserProfile` en `application/user/`
  - `ChangePassword` en `application/user/`
  - Implementar `updatePassword` en `SupabaseAuthService`
  
- [ ] **3.2**: Refactorizar Profile.tsx (20 min)
  - Usar casos de uso vs service directo
  - Implementar guardado real
  - Validación contraseña actual
  
- [ ] **3.3**: Configurar herramientas (10 min)
  - ESLint config
  - TypeScript check
  - Fix postcss warning

**Criterios**:
- [ ] Profile funcional sin simulaciones
- [ ] Arquitectura hexagonal respetada
- [ ] Comandos lint/typecheck disponibles

---

### **Sprint 4: Calidad y UX** 🔶
**Tiempo**: 60 min | **Prioridad**: Media-Alta

**Tareas**:
- [ ] **4.1**: Bundle optimization (20 min) - Code splitting, lazy loading
- [ ] **4.2**: Datos reales (25 min) - Extender User model, persistencia
- [ ] **4.3**: Loading/Error states (15 min) - Error boundary, retry

**Criterios**: Bundle <400kB, datos persisten, UX fluida

---

### **Sprint 5: Funcionalidades** 🔸  
**Tiempo**: 75 min | **Prioridad**: Media

**Tareas**:
- [ ] **5.1**: Upload Avatar (30 min) - Supabase Storage integration
- [ ] **5.2**: OAuth Google (25 min) - Config + UI
- [ ] **5.3**: Notificaciones (20 min) - Sistema básico

---

### **Sprint 6: Testing** 🔸
**Tiempo**: 50 min | **Prioridad**: Media-Baja

**Tareas**:
- [ ] **6.1**: Tests automatizados (30 min) - Unit + E2E
- [ ] **6.2**: Documentación (20 min) - README + TypeDoc

---

### **Sprint 7: Empresarial** 🔹
**Tiempo**: 90 min | **Prioridad**: Baja

**Tareas**:
- [ ] **7.1**: Roles y permisos (40 min)
- [ ] **7.2**: Verificación email (25 min)  
- [ ] **7.3**: Gestión sesión avanzada (25 min)

## 📊 Resumen

| Sprint | Estado | Prioridad | Tiempo | Enfoque |
|--------|--------|-----------|--------|---------|
| 1-2 | ✅ | - | 75 min | Completados |
| 3 | ⏳ | 🚨 Crítica | 45 min | **Deuda Técnica** |
| 4 | ⏳ | 🔶 Media-Alta | 60 min | Calidad + UX |
| 5-7 | ⏳ | 🔸 Media-Baja | 215 min | Features + Testing |

**Total Pendiente**: 5h 20min

## 🚨 Acción Inmediata
**EJECUTAR SPRINT 3 YA** - Resolver deuda técnica crítica antes de continuar con nuevas funcionalidades.

---

*Actualizado: 2025-08-16*