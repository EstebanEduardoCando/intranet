-- ============================
-- FIX: Alinear tabla positions con entidad Position
-- Agregar campos faltantes y auditoría
-- ============================

-- PASO 1: Verificar estructura actual de la tabla positions
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'positions'
ORDER BY ordinal_position;

-- PASO 2: Agregar campos faltantes de la entidad Position
ALTER TABLE positions ADD COLUMN IF NOT EXISTS level VARCHAR(30);
ALTER TABLE positions ADD COLUMN IF NOT EXISTS requirements TEXT;

-- PASO 3: Agregar campos de auditoría (Sprint 7)
ALTER TABLE positions ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE positions ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE positions ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE positions ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- PASO 4: Crear índices para los nuevos campos
CREATE INDEX IF NOT EXISTS idx_positions_level ON positions(level);
CREATE INDEX IF NOT EXISTS idx_positions_created_by ON positions(created_by);
CREATE INDEX IF NOT EXISTS idx_positions_updated_by ON positions(updated_by);
CREATE INDEX IF NOT EXISTS idx_positions_deleted ON positions(is_deleted);
CREATE INDEX IF NOT EXISTS idx_positions_active_deleted ON positions(is_active, is_deleted);

-- PASO 5: Actualizar datos existentes con valores por defecto
UPDATE positions 
SET version = 1 
WHERE version IS NULL;

UPDATE positions 
SET is_deleted = false 
WHERE is_deleted IS NULL;

-- PASO 6: Agregar comentarios para documentación
COMMENT ON COLUMN positions.level IS 'Position level (Junior, Senior, Lead, Manager, etc.)';
COMMENT ON COLUMN positions.requirements IS 'Position requirements and qualifications';

-- PASO 7: Verificar estructura final
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'positions'
ORDER BY ordinal_position;

-- PASO 8: Verificar datos de ejemplo
SELECT 
    position_id,
    name,
    description,
    level,
    is_active,
    is_deleted,
    version
FROM positions 
WHERE is_active = true 
ORDER BY name
LIMIT 5;