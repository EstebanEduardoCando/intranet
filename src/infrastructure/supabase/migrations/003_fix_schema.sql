-- =================================================================
-- FIX SCHEMA - Completar migración que falló parcialmente
-- =================================================================

-- 1. Agregar columna description a companies si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'companies' AND column_name = 'description'
    ) THEN
        ALTER TABLE public.companies ADD COLUMN description TEXT;
    END IF;
END $$;

-- 2. Agregar columnas a user_profiles si no existen
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'company_id'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN company_id INTEGER REFERENCES public.companies(company_id) ON DELETE SET NULL;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'position_id'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN position_id INTEGER REFERENCES public.positions(position_id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Corregir datos de empresas
UPDATE public.companies SET 
    name = 'Matriz',
    description = 'Oficina principal de la empresa'
WHERE company_id = 1;

UPDATE public.companies SET 
    name = 'Sucursal Norte', 
    description = 'Sucursal ubicada en el norte'
WHERE company_id = 2;

UPDATE public.companies SET 
    name = 'Sucursal Sur',
    description = 'Sucursal ubicada en el sur' 
WHERE company_id = 3;

-- 4. Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON public.user_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_position ON public.user_profiles(position_id);

-- 5. Verificación final
SELECT 'Companies fixed:' as status, count(*) as count FROM public.companies WHERE name != 'undefined';
SELECT 'User profiles structure:' as status, 
       column_name 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
  AND column_name IN ('company_id', 'position_id');

SELECT '✅ Schema correction completed!' as result;