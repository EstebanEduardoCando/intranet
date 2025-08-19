-- ============================
-- DEBUG: Investigar triggers en tabla modules
-- ============================

-- 1. Ver todos los triggers activos en la tabla modules
SELECT 
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing,
    action_condition
FROM information_schema.triggers 
WHERE event_object_table = 'modules'
ORDER BY trigger_name;

-- 2. Ver la definición actual de la tabla modules
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'modules'
ORDER BY ordinal_position;

-- 3. Ver si existen funciones de trigger problemáticas
SELECT 
    p.proname as function_name,
    p.prosrc as function_source
FROM pg_proc p
WHERE p.proname LIKE '%audit%' 
   OR p.proname LIKE '%trigger%'
ORDER BY p.proname;

-- 4. Verificar existencia de triggers duplicados o conflictivos
SELECT 
    schemaname,
    tablename,
    triggername,
    triggerdef
FROM pg_triggers 
WHERE tablename = 'modules';