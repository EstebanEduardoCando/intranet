-- ============================
-- FIX: Alinear tabla modules con formulario y entidad
-- Agregar campos faltantes para completar funcionalidad
-- ============================

-- PASO 1: Agregar campos faltantes a la tabla modules
ALTER TABLE modules ADD COLUMN IF NOT EXISTS route VARCHAR(200);
ALTER TABLE modules ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS required_role VARCHAR(80);

-- PASO 2: Verificar que los campos de auditoría existan (deberían estar del Sprint 7)
ALTER TABLE modules ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE modules ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE modules ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- PASO 3: Crear índices para los nuevos campos
CREATE INDEX IF NOT EXISTS idx_modules_route ON modules(route);
CREATE INDEX IF NOT EXISTS idx_modules_visible ON modules(is_visible);
CREATE INDEX IF NOT EXISTS idx_modules_required_role ON modules(required_role);
CREATE INDEX IF NOT EXISTS idx_modules_deleted ON modules(is_deleted);

-- PASO 4: Actualizar datos existentes
-- Generar rutas automáticamente basadas en el código
UPDATE modules 
SET route = '/' || LOWER(REPLACE(code, '.', '/'))
WHERE route IS NULL OR route = '';

-- Establecer valores por defecto para módulos existentes
UPDATE modules 
SET is_visible = true 
WHERE is_visible IS NULL;

UPDATE modules 
SET version = 1 
WHERE version IS NULL;

UPDATE modules 
SET is_deleted = false 
WHERE is_deleted IS NULL;

-- PASO 5: Agregar comentarios para documentación
COMMENT ON COLUMN modules.route IS 'Route path for navigation (e.g., /admin/users)';
COMMENT ON COLUMN modules.is_visible IS 'Whether the module is visible in navigation';
COMMENT ON COLUMN modules.required_role IS 'Required role to access this module';

-- PASO 6: Verificar estructura final de la tabla
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'modules'
ORDER BY ordinal_position;

-- PASO 7: Verificar datos de ejemplo
SELECT 
    module_id,
    code,
    name,
    route,
    sort_order,
    is_visible,
    is_active,
    required_role
FROM modules 
WHERE is_active = true 
ORDER BY sort_order
LIMIT 5;