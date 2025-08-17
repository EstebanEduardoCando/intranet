# 🗄️ Database Setup - User Management

## ⚠️ Estado Actual

El código de **UserManagement** está completamente implementado con arquitectura hexagonal y casos de uso reales, PERO las tablas de base de datos **NO existen aún en Supabase**.

## 🚀 Pasos para Activar User Management

### 1. Ejecutar Migración SQL

1. Ve a tu **Panel de Supabase** → **SQL Editor**
2. Copia todo el contenido del archivo:
   ```
   src/infrastructure/supabase/migrations/002_create_complete_schema.sql
   ```
3. Pégalo en el SQL Editor y ejecuta
4. Verifica que se crearon las tablas sin errores

### 2. Verificar Configuración

```bash
# Opcional: Ejecutar script de verificación
npm run ts-node scripts/setupDatabase.ts
```

### 3. Probar User Management

1. Inicia la aplicación: `npm start`
2. Ve a **Gestión de Empleados** en el sidebar
3. Deberías ver datos reales (inicialmente vacío)
4. Las funciones de búsqueda, paginación y eliminación funcionarán

## 📊 Tablas Creadas

El script de migración crea:

- ✅ **persons** - Información personal básica
- ✅ **companies** - Empresas/organizaciones
- ✅ **positions** - Cargos/posiciones laborales
- ✅ **roles** - Roles de usuario y permisos
- ✅ **user_profiles** - Perfiles de usuario (conecta auth.users)
- ✅ **user_roles** - Relación many-to-many usuarios-roles

## 🎯 Funcionalidades Listas

Una vez ejecutada la migración:

- ✅ **Listado de usuarios** con datos reales
- ✅ **Búsqueda** por nombre, email, documento
- ✅ **Paginación** eficiente desde BD
- ✅ **Eliminación** con soft delete
- ✅ **Dropdowns** para empresas, cargos, roles
- 🔄 **Asignación empresa/cargo** (UI preparada)
- 🔄 **Gestión de roles** (UI preparada)

## 🔧 Datos de Prueba

El script incluye datos semilla:

- **Empresas**: Matriz, Sucursal Norte, Sucursal Sur
- **Cargos**: Desarrollador Senior/Junior, Analista, etc.
- **Roles**: Administrador, Usuario, Supervisor, Invitado

## ❓ Troubleshooting

**Problema**: "relation does not exist"
**Solución**: Ejecutar migración SQL en panel Supabase

**Problema**: "permission denied"
**Solución**: Verificar que RLS policies están correctas

**Problema**: "No users found"
**Solución**: Registrar usuarios nuevos o crear perfiles manualmente