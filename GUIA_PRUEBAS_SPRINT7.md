# 🧪 Guía Completa de Pruebas - Sprint 7

## 📋 Índice
1. [Notificaciones Persistentes](#1-notificaciones-persistentes)
2. [Páginas de Administración de Catálogos](#2-páginas-de-administración-de-catálogos)
3. [Pantalla de Historial de Auditoría](#3-pantalla-de-historial-de-auditoría)
4. [Sistema de Auditoría](#4-sistema-de-auditoría)

---

## 1. 🔔 Notificaciones Persistentes

### Rutas de Prueba
- **Página de pruebas**: `/test/notifications`
- **Header**: Icono de campana en cualquier página autenticada

### Flujo de Prueba Paso a Paso

#### 🔸 **Paso 1: Acceder a la página de pruebas**
```
1. Hacer login en el sistema
2. Navegar a: http://localhost:5173/test/notifications
3. Verificar que la página carga correctamente
```

Observaciones: Todo Correcto, Sin novedad

#### 🔸 **Paso 2: Probar notificaciones temporales**
```
1. Hacer clic en "Probar Notificaciones Temporales"
2. ✅ VERIFICAR: Aparecen 4 notificaciones en la esquina superior derecha
3. ✅ VERIFICAR: Se auto-eliminan después de 3 segundos
4. ✅ VERIFICAR: Aparecen en el historial del header (campana)
```
Observaciones: Todo Correcto, Sin novedad

#### 🔸 **Paso 3: Probar notificaciones persistentes**
```
1. Hacer clic en "Probar Notificaciones Persistentes"
2. ✅ VERIFICAR: Aparecen 4 notificaciones en pantalla
3. ✅ VERIFICAR: Se incrementa el contador de no leídas en el header
4. ✅ VERIFICAR: En consola aparece: "Persistent notification created with ID: X"
```
observaciones:
encontrado error al realizar  las pruebas de notificaciones persistentes.:
{
    "code": "42501",
    "details": null,
    "hint": null,
    "message": "new row violates row-level security policy for table \"user_notifications\""
}


#### 🔸 **Paso 4: Verificar persistencia**
```
1. Hacer clic en el avatar del usuario (esquina superior derecha)
2. Seleccionar "Cerrar Sesión"
3. Hacer login nuevamente con las mismas credenciales
4. ✅ VERIFICAR: Las notificaciones persistentes siguen en el header
5. ✅ VERIFICAR: El contador de no leídas se mantiene
```
observaciones:
No se realiza la persistencia en BBDD.


#### 🔸 **Paso 5: Verificar base de datos**
```
1. Abrir consola del navegador (F12)
2. Hacer clic en "Probar Notificaciones Persistentes"
3. ✅ VERIFICAR: Logs de creación en consola
4. ✅ VERIFICAR: No hay errores de BD
```
observaciones:
No se realiza la persistencia en BBDD.

### Casos de Error a Verificar
- [ ] Sin usuario autenticado (no debe crear persistentes)
- [ ] Error de BD (debe mostrar en consola)
- [ ] Recarga de página (temporales desaparecen, persistentes permanecen)

---

## 2. 🏢 Páginas de Administración de Catálogos

### Rutas Principales
- **Empresas**: `/administration/companies`
- **Cargos**: `/administration/positions`
- **Roles**: `/administration/roles`
- **Módulos**: `/administration/modules`


### Rutas Alternativas (Legacy)
- **Empresas**: `/admin/companies`
- **Cargos**: `/hr/positions`
- **Roles**: `/admin/roles`

---

### 🏢 **Administración de Empresas**

#### Ruta: `/administration/companies`

#### Flujo de Prueba
```
1. Navegar a la URL
2. ✅ VERIFICAR: Página carga con título "Administración de Empresas"
3. ✅ VERIFICAR: Tabla muestra empresas existentes
4. ✅ VERIFICAR: Controles de filtrado funcionan
```
observaciones:
Pagina correcta.


#### 🔸 **Crear Nueva Empresa**
```
1. Clic en "Nueva Empresa"
2. Llenar formulario:
   - Nombre: "Empresa Test"
   - Descripción: "Empresa de prueba"
   - Email: "test@empresa.com"
   - Teléfono: "+1234567890"
3. Clic en "Crear Empresa"
4. ✅ VERIFICAR: Notificación de éxito
5. ✅ VERIFICAR: Empresa aparece en tabla
```

observaciones:
No se ha realizado la creacion de la empresa


#### 🔸 **Editar Empresa**
```
1. Clic en menú (⋮) de una empresa
2. Seleccionar "Editar"
3. Modificar datos
4. Clic en "Guardar Cambios"
5. ✅ VERIFICAR: Notificación de éxito
6. ✅ VERIFICAR: Cambios reflejados en tabla
```
observaciones:
No se ha guardado las modificaciones de la empresa


#### 🔸 **Filtros y Búsqueda**
```
1. Usar campo de búsqueda
2. ✅ VERIFICAR: Filtrado en tiempo real
3. Cambiar filtro de estado
4. ✅ VERIFICAR: Resultados actualizados
5. Cambiar ordenamiento
6. ✅ VERIFICAR: Tabla se reordena
```

observaciones:
Filtros funcionando correctamente

---

### 💼 **Administración de Cargos**

#### Ruta: `/administration/positions`

#### Flujo de Prueba
```
1. Navegar a la URL
2. ✅ VERIFICAR: Página carga con título "Administración de Cargos"
3. ✅ VERIFICAR: Filtro por empresa funciona
```

observacion: 
* Mensaje de error al ingresar: Cannot read properties of undefined (reading 'toLowerCase')
* No carga ningun cargo en la tabla


#### 🔸 **Crear Nuevo Cargo**
```
1. Clic en "Nuevo Cargo"
2. Llenar formulario:
   - Título: "Desarrollador Senior"
   - Empresa: Seleccionar una existente
   - Departamento: "IT"
   - Nivel: "Senior"
   - Descripción: "Desarrollo de software"
3. Clic en "Crear Cargo"
4. ✅ VERIFICAR: Cargo creado exitosamente
```

observaciones:
No funciona la creacion


#### 🔸 **Validaciones**
```
1. Intentar crear cargo sin empresa
2. ✅ VERIFICAR: Botón deshabilitado
3. Intentar crear cargo sin título
4. ✅ VERIFICAR: Validación de campo requerido
```

observaciones:
VAlidacion correcta. boton inhabilitado hasta seleccionar la empresa.
---

### 🔐 **Administración de Roles**

#### Ruta: `/administration/roles`

#### Flujo de Prueba
```
1. Navegar a la URL
2. ✅ VERIFICAR: Tabla muestra roles existentes
3. ✅ VERIFICAR: Columna de permisos muestra conteo

observaciones:
Validacion correcta. la informacion se presenta correctamente.
```

#### 🔸 **Crear Nuevo Rol**
```
1. Clic en "Nuevo Rol"
2. Llenar:
   - Nombre: "Editor"
   - Descripción: "Rol de editor de contenido"
3. Clic en "Crear Rol"
4. ✅ VERIFICAR: Rol creado
```

observaciones:
No se guarda la informacion

#### 🔸 **Gestionar Permisos**
```
1. Clic en menú (⋮) de un rol
2. Seleccionar "Gestionar permisos"
3. ✅ VERIFICAR: Aparecen 18 permisos categorizados
4. ✅ VERIFICAR: Switches funcionan correctamente
5. Activar algunos permisos
6. Clic en "Guardar Permisos"
7. ✅ VERIFICAR: Cambios guardados
```

observaciones:
No se guarda la informacion

#### 🔸 **Categorías de Permisos Disponibles**
```
- Usuarios: read, write, delete
- Empresas: read, write, delete
- Cargos: read, write, delete
- Roles: read, write, delete
- Módulos: read, write, delete
- Auditoría: read
- Sistema: read, write
```

---

### 🧩 **Administración de Módulos**

#### Ruta: `/administration/modules`

#### Flujo de Prueba
```
1. Navegar a la URL
2. ✅ VERIFICAR: Vista tabla/árbol disponible
3. ✅ VERIFICAR: Iconos se muestran correctamente
```

observaciones:
Se observa la pantalla.

#### 🔸 **Crear Nuevo Módulo**
```
1. Clic en "Nuevo Módulo"
2. Llenar formulario:
   - Nombre: "Reportes"
   - Descripción: "Módulo de reportes"
   - Ruta: "/reports"
   - Icono: Seleccionar de lista (19 disponibles)
   - Orden: 10
   - Módulo padre: Opcional
   - Módulo visible: ✓
3. Clic en "Crear Módulo"
4. ✅ VERIFICAR: Módulo creado
```

#### 🔸 **Gestión de Iconos**
```
1. En formulario, clic en campo "Icono"
2. ✅ VERIFICAR: Lista desplegable con 19 iconos
3. ✅ VERIFICAR: Preview visual de cada icono
4. Seleccionar icono diferente
5. ✅ VERIFICAR: Icono cambia en preview
```

#### 🔸 **Vista de Árbol**
```
1. Cambiar vista a "Árbol"
2. ✅ VERIFICAR: Jerarquía padre-hijo visible
3. ✅ VERIFICAR: Expansión/colapso funciona
4. ✅ VERIFICAR: Acciones disponibles en cada nodo
```

#### 🔸 **Iconos Disponibles**
```
Dashboard, Personas, Empresas, Trabajo, Seguridad, 
Configuración, Reportes, Tareas, Tienda, Finanzas, 
Inventario, Envíos, Analíticas, Soporte, Email, 
Eventos, Archivos, Módulo, Carpeta
```

---

## 3. 📊 Pantalla de Historial de Auditoría

### Ruta: `/administration/audit`

#### Flujo de Prueba Inicial
```
1. Navegar a la URL
2. ✅ VERIFICAR: Página carga con título "Historial de Auditoría"
3. ✅ VERIFICAR: Estadísticas rápidas mostradas
4. ✅ VERIFICAR: Filtros de fecha, tabla y operación
```

#### 🔸 **Verificar Estadísticas**
```
1. ✅ VERIFICAR: Total de cambios muestra número
2. ✅ VERIFICAR: Tablas afectadas cuenta
3. ✅ VERIFICAR: Usuarios activos listados
4. Clic en "Ver estadísticas"
5. ✅ VERIFICAR: Modal con detalles se abre
```

#### 🔸 **Probar Filtros**
```
1. Cambiar filtro de tabla a "Empresas"
2. ✅ VERIFICAR: Solo registros de empresas
3. Cambiar operación a "CREATE"
4. ✅ VERIFICAR: Solo operaciones de creación
5. Modificar rango de fechas
6. ✅ VERIFICAR: Filtrado por fecha funciona
```

#### 🔸 **Ver Detalles de Cambio**
```
1. Clic en icono 👁️ de un registro
2. ✅ VERIFICAR: Modal de detalles se abre
3. ✅ VERIFICAR: Información de usuario visible
4. ✅ VERIFICAR: Campos modificados listados
5. ✅ VERIFICAR: JSON antes/después expandible
```

#### 🔸 **Paginación**
```
1. ✅ VERIFICAR: Botones Anterior/Siguiente funcionan
2. ✅ VERIFICAR: Cambio de filas por página
3. ✅ VERIFICAR: Navegación entre páginas
```

---

## 4. 🔍 Sistema de Auditoría

### Cómo Generar Datos de Auditoría

#### 🔸 **Generar Registros de Empresas**
```
1. Ir a /administration/companies
2. Crear una empresa nueva
3. Editar la empresa creada
4. Ir a /administration/audit
5. ✅ VERIFICAR: Aparecen registros CREATE y UPDATE para "companies"
```

#### 🔸 **Generar Registros de Cargos**
```
1. Ir a /administration/positions
2. Crear un cargo nuevo
3. Editar el cargo
4. Verificar en auditoría
5. ✅ VERIFICAR: Registros para tabla "positions"
```

#### 🔸 **Generar Registros de Roles**
```
1. Ir a /administration/roles
2. Crear rol, gestionar permisos
3. Verificar en auditoría
4. ✅ VERIFICAR: Registros de cambios de permisos
```

---

## 🐛 Casos de Error Comunes

### 1. **Error de Base de Datos**
```
Síntoma: "Error loading audit history"
Solución: Verificar que las migraciones SQL se ejecutaron correctamente
```

### 2. **Notificaciones no se guardan**
```
Síntoma: No aparece "Persistent notification created with ID"
Solución: 
1. Verificar conexión a Supabase
2. Verificar tabla user_notifications existe
3. Verificar función create_user_notification existe
```

### 3. **Páginas en blanco**
```
Síntoma: Componentes no cargan
Solución: Verificar imports en App.tsx
```

### 4. **Error 404 en rutas**
```
Síntoma: "Cannot GET /administration/companies"
Solución: Verificar que el servidor dev está corriendo
```

---

## ✅ Checklist de Verificación Completa

### Notificaciones Persistentes
- [ ] Notificaciones temporales funcionan
- [ ] Notificaciones persistentes se guardan en BD
- [ ] Persistencia sobrevive logout/login
- [ ] Contador en header se actualiza
- [ ] Historial se mantiene

### Administración de Empresas
- [ ] CRUD completo funciona
- [ ] Filtros y búsqueda operativos
- [ ] Validaciones de formulario
- [ ] Notificaciones de éxito/error
- [ ] Paginación funcional

### Administración de Cargos
- [ ] Vinculación con empresas
- [ ] CRUD completo
- [ ] Filtros por empresa
- [ ] Validaciones

### Administración de Roles
- [ ] Sistema de permisos (18 permisos)
- [ ] Categorización correcta
- [ ] Switches funcionan
- [ ] Guardado de permisos

### Administración de Módulos
- [ ] Vista tabla y árbol
- [ ] 19 iconos disponibles
- [ ] Jerarquía padre-hijo
- [ ] Ordenamiento y visibilidad

### Historial de Auditoría
- [ ] Carga de datos históricos
- [ ] Filtros avanzados
- [ ] Estadísticas correctas
- [ ] Detalles de cambios
- [ ] Paginación infinita

### Sistema de Auditoría
- [ ] Triggers automáticos funcionan
- [ ] Registros se crean en BD
- [ ] Información de usuario correcta
- [ ] JSON diff funcional

---

## 📞 Problemas y Soluciones

Si encuentras algún problema durante las pruebas:

1. **Verificar consola del navegador** para errores JavaScript
2. **Verificar Network tab** para errores de API
3. **Verificar que Supabase esté conectado** y las tablas existan
4. **Revisar logs del servidor** si hay errores de BD
5. **Confirmar que el usuario tiene permisos** para acceder a las funciones

---

*Guía actualizada para Sprint 7 - Sistema completo de administración de catálogos y auditoría*