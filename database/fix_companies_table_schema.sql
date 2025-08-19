-- ============================
-- FIX: Alinear tabla companies con repositorio
-- Verificar campos de auditoría del Sprint 7
-- ============================

-- PASO 1: Verificar estructura actual de la tabla companies
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'companies'
ORDER BY ordinal_position;

-- PASO 2: Agregar campos de auditoría si no existen (Sprint 7)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- PASO 3: Verificar que el campo website existe (debería estar en el schema original)
-- Si no existe, agregarlo
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'companies' AND column_name = 'website'
    ) THEN
        ALTER TABLE companies ADD COLUMN website VARCHAR(200);
    END IF;
END $$;

-- PASO 4: Crear índices para los nuevos campos
CREATE INDEX IF NOT EXISTS idx_companies_created_by ON companies(created_by);
CREATE INDEX IF NOT EXISTS idx_companies_updated_by ON companies(updated_by);
CREATE INDEX IF NOT EXISTS idx_companies_deleted ON companies(is_deleted);
CREATE INDEX IF NOT EXISTS idx_companies_active_deleted ON companies(is_active, is_deleted);

-- PASO 5: Actualizar datos existentes con valores por defecto
UPDATE companies 
SET version = 1 
WHERE version IS NULL;

UPDATE companies 
SET is_deleted = false 
WHERE is_deleted IS NULL;

-- PASO 6: Verificar estructura final
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'companies'
ORDER BY ordinal_position;

-- PASO 7: Verificar datos de ejemplo
SELECT 
    company_id,
    trade_name,
    legal_name,
    contact_email,
    website,
    is_active,
    is_deleted,
    version
FROM companies 
WHERE is_active = true 
ORDER BY trade_name
LIMIT 5;