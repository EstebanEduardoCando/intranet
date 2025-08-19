# 📁 Scripts de Referencia - Sistema de Intranet

## 🧪 Scripts de Testing y Validación

### **Scripts de Roles (PGRST204 Fix)**
- `testUserRolesError.js` - Detecta errores PGRST204 en gestión de roles
- `testCorrectedRoleManagement.js` - Valida gestión de roles corregida

### **Scripts de Base de Datos**
- `testDatabaseOperations.js` - Operaciones básicas de BD
- `testUserOperations.js` - Validación de operaciones de usuarios
- `testFinalValidation.js` - Validación completa del sistema

### **Scripts de Esquemas**
- `checkActualSchema.js` - Verifica estructura actual de BD
- `checkSchema.js` - Validación de esquemas
- `verifyDatabase.js` - Verificación completa de BD

### **Scripts de Módulos**
- `checkModules.js` - Validación de módulos del sistema
- `fixModuleStructure.js` - Corrección de estructura de módulos

## 📊 Documentación Principal

### **Archivos de Contexto**
- `CLAUDE.md` - Contexto principal del proyecto
- `BACKLOG.md` - TODOs y roadmap de sprints
- `ROLE_MANAGEMENT_SOLUTION.md` - Solución completa del error PGRST204

### **Archivos Eliminados** (Temporales)
- `FIX_USER_ROLES.md` - Fix aplicado exitosamente
- `fixUserRolesTable.js` - Script de fix aplicado
- `testFinalRoleManagement.js` - Test duplicado
- `testRoleRepositoryFix.js` - Test temporal

## 🎯 Uso Recomendado

### **Para Validar Sistema**
```bash
# Validar roles funcionan correctamente
node scripts/testCorrectedRoleManagement.js

# Verificar BD completa
node scripts/testFinalValidation.js

# Detectar problemas de roles
node scripts/testUserRolesError.js
```

### **Para Desarrollo**
```bash
# Linting y calidad
npm run lint
npm run typecheck

# Desarrollo
npm start
npm run build
```

---
*Actualizado: 2025-08-17 - Scripts organizados post-fix PGRST204*