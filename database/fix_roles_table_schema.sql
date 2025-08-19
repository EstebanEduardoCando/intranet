-- ============================
-- FIX: Alinear tabla roles con entidad Role
-- Agregar campos de auditoría faltantes
-- ============================

-- PASO 1: Verificar estructura actual de la tabla roles
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'roles'
ORDER BY ordinal_position;

-- PASO 2: Agregar campos de auditoría (Sprint 7+)
ALTER TABLE roles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE roles ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE roles ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- PASO 3: Crear índices para los nuevos campos
CREATE INDEX IF NOT EXISTS idx_roles_created_by ON roles(created_by);
CREATE INDEX IF NOT EXISTS idx_roles_updated_by ON roles(updated_by);
CREATE INDEX IF NOT EXISTS idx_roles_deleted ON roles(is_deleted);
CREATE INDEX IF NOT EXISTS idx_roles_active_deleted ON roles(is_active, is_deleted);

-- PASO 4: Actualizar datos existentes con valores por defecto
UPDATE roles 
SET version = 1 
WHERE version IS NULL;

UPDATE roles 
SET is_deleted = false 
WHERE is_deleted IS NULL;

-- PASO 5: Agregar comentarios para documentación
COMMENT ON COLUMN roles.created_by IS 'User who created the role';
COMMENT ON COLUMN roles.updated_by IS 'User who last updated the role';
COMMENT ON COLUMN roles.version IS 'Version for optimistic locking';
COMMENT ON COLUMN roles.is_deleted IS 'Soft delete flag';

-- PASO 6: Verificar estructura final
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'roles'
ORDER BY ordinal_position;

-- PASO 7: Verificar datos de ejemplo
SELECT 
    role_id,
    name,
    description,
    is_active,
    is_deleted,
    version,
    created_by,
    updated_by
FROM roles 
WHERE is_active = true 
ORDER BY name
LIMIT 5;