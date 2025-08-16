# 📋 Product Backlog - Sistema de Intranet

## 🎯 Estado Actual (Agosto 2025)

### ✅ **Sprints Completados**
- **Sprint 1**: Header + Dashboard + Logout funcional ✅
- **Sprint 2**: Reset password + Página Mi Perfil completa ✅
- **Sprint 3**: Modelo de datos + Refactor arquitectural (95% completado) ✅

### 🔧 **Deuda Técnica Crítica**
**🔴 Impacta funcionalidad**:
1. ✅ **Casos de Uso Faltantes**: UpdateUserProfile ✅, ChangePassword (pendiente)
2. ✅ **Violación Arquitectura**: Profile.tsx refactorizado a arquitectura hexagonal ✅
3. ✅ **Funcionalidad Incompleta**: Profile implementado con guardado real ✅
4. **Herramientas**: Falta ESLint y typecheck
5. **TODOs Encontrados**:
   - TODO: Implementar ChangePassword use case - Profile.tsx:180 - Prioridad: Alta
   - TODO: Configurar lint y typecheck commands - package.json - Prioridad: Media
   - TODO: Optimizar bundle size - Vite config - Prioridad: Media

**🟡 Mejoras calidad**:
- Bundle 635kB (necesita code splitting)
- Error handling inconsistente
- Formulario registro necesita validación mejorada

## 🎯 Sprints Restructurados

### **Sprint 3: Deuda Técnica Crítica** 🚨 ✅
**Tiempo**: 90 min (extendido) | **Prioridad**: CRÍTICA | **Estado**: 95% Completado

**Tareas Completadas** ✅:
- [x] **3.1**: Crear casos de uso faltantes (30 min)
  - ✅ `UpdateUserProfile` en `application/user/` implementado
  - ✅ Schema BD completo con Person + UserProfile
  - ✅ Repositorios SupabasePersonRepository + SupabaseUserProfileRepository
  - [ ] `ChangePassword` pendiente (único faltante)
  
- [x] **3.2**: Refactorizar Profile.tsx (40 min)
  - ✅ Usar casos de uso vs service directo
  - ✅ Implementar guardado real con BD
  - ✅ Sincronización estado global tiempo real
  - ✅ Formulario completo con todos los campos del nuevo modelo
  
- [x] **3.3**: Refactor completo UI/UX (20 min)
  - ✅ Register.tsx → Formulario completo con CreateUserData
  - ✅ Header.tsx → Display actualizado con nuevo modelo
  - ✅ AuthStore → refreshUser() y setUser() para sincronización

**Pendiente**:
- [ ] **3.4**: Configurar herramientas (10 min)
  - ESLint config
  - TypeScript check
  - `ChangePassword` caso de uso

**Criterios Alcanzados**:
- [x] Profile funcional sin simulaciones ✅
- [x] Arquitectura hexagonal respetada ✅
- [x] Sincronización UI tiempo real ✅
- [ ] Comandos lint/typecheck disponibles (pendiente)

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
| 3 | 🟡 95% | 🚨 Crítica | 90 min | **Deuda Técnica** |
| 4 | ⏳ | 🔶 Media-Alta | 60 min | Calidad + UX |
| 5-7 | ⏳ | 🔸 Media-Baja | 215 min | Features + Testing |

**Total Pendiente**: 4h 45min (reducido por progreso Sprint 3)

## 🚨 Acción Inmediata
**FINALIZAR SPRINT 3** - Solo falta ChangePassword + herramientas, luego continuar con Sprint 4.

## 🎉 **Logros Destacados Sprint 3**
- ✅ **Arquitectura Hexagonal**: Completamente respetada y funcional
- ✅ **Modelo de Datos**: Schema robusto Person + UserProfile + auth.users
- ✅ **Sincronización Real-Time**: UI se actualiza automáticamente sin logout
- ✅ **Funcionalidad Completa**: Profile con guardado real, Register expandido
- ✅ **Calidad de Código**: TODOs documentados, estructura clara

---

*Actualizado: 2025-08-16 - Sprint 3 prácticamente completado*