-- ============================
-- SOLUCIÓN COMPLETA: Fix definitivo para triggers de auditoría modules
-- ============================

-- PASO 1: Eliminar TODOS los triggers de auditoría existentes
DROP TRIGGER IF EXISTS audit_modules_trigger ON modules;
DROP TRIGGER IF EXISTS audit_companies_trigger ON companies;
DROP TRIGGER IF EXISTS audit_positions_trigger ON positions;
DROP TRIGGER IF EXISTS audit_roles_trigger ON roles;

-- PASO 2: Eliminar función problemática si existe
DROP FUNCTION IF EXISTS audit_trigger_function() CASCADE;

-- PASO 3: Crear función de auditoría completamente nueva y corregida
CREATE OR REPLACE FUNCTION audit_trigger_function_v2()
RETURNS TRIGGER AS $$
DECLARE
    v_old_values JSONB;
    v_new_values JSONB;
    v_operation VARCHAR(20);
    v_user_id UUID;
    v_record_id VARCHAR(50);
BEGIN
    -- Determinar operación y valores
    IF TG_OP = 'DELETE' THEN
        v_operation := 'DELETE';
        v_old_values := to_jsonb(OLD);
        v_new_values := NULL;
        v_user_id := OLD.updated_by;
        
        -- Obtener ID del registro eliminado específico por tabla
        v_record_id := CASE TG_TABLE_NAME
            WHEN 'companies' THEN OLD.company_id::VARCHAR(50)
            WHEN 'positions' THEN OLD.position_id::VARCHAR(50)
            WHEN 'roles' THEN OLD.role_id::VARCHAR(50)
            WHEN 'modules' THEN OLD.module_id::VARCHAR(50)
            ELSE 'unknown'
        END;
        
    ELSIF TG_OP = 'UPDATE' THEN
        v_operation := 'UPDATE';
        v_old_values := to_jsonb(OLD);
        v_new_values := to_jsonb(NEW);
        v_user_id := NEW.updated_by;
        
        -- Obtener ID del registro actualizado específico por tabla
        v_record_id := CASE TG_TABLE_NAME
            WHEN 'companies' THEN NEW.company_id::VARCHAR(50)
            WHEN 'positions' THEN NEW.position_id::VARCHAR(50)
            WHEN 'roles' THEN NEW.role_id::VARCHAR(50)
            WHEN 'modules' THEN NEW.module_id::VARCHAR(50)
            ELSE 'unknown'
        END;
        
    ELSIF TG_OP = 'INSERT' THEN
        v_operation := 'CREATE';
        v_old_values := NULL;
        v_new_values := to_jsonb(NEW);
        v_user_id := NEW.created_by;
        
        -- Obtener ID del registro creado específico por tabla
        v_record_id := CASE TG_TABLE_NAME
            WHEN 'companies' THEN NEW.company_id::VARCHAR(50)
            WHEN 'positions' THEN NEW.position_id::VARCHAR(50)
            WHEN 'roles' THEN NEW.role_id::VARCHAR(50)
            WHEN 'modules' THEN NEW.module_id::VARCHAR(50)
            ELSE 'unknown'
        END;
    END IF;
    
    -- Crear log de auditoría usando la función create_audit_log
    PERFORM create_audit_log(
        TG_TABLE_NAME::VARCHAR(50),
        v_record_id,
        v_operation,
        v_old_values,
        v_new_values,
        v_user_id
    );
    
    -- Retornar registro apropiado
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log del error pero no fallar la operación principal
        RAISE WARNING 'Error en audit_trigger_function_v2 para tabla %: %', TG_TABLE_NAME, SQLERRM;
        
        IF TG_OP = 'DELETE' THEN
            RETURN OLD;
        ELSE
            RETURN NEW;
        END IF;
END;
$$ LANGUAGE plpgsql;

-- PASO 4: Crear triggers nuevos con función corregida
CREATE TRIGGER audit_companies_trigger_v2
    AFTER INSERT OR UPDATE OR DELETE ON companies
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function_v2();

CREATE TRIGGER audit_positions_trigger_v2
    AFTER INSERT OR UPDATE OR DELETE ON positions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function_v2();

CREATE TRIGGER audit_roles_trigger_v2
    AFTER INSERT OR UPDATE OR DELETE ON roles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function_v2();

CREATE TRIGGER audit_modules_trigger_v2
    AFTER INSERT OR UPDATE OR DELETE ON modules
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function_v2();

-- PASO 5: Verificar que los triggers se crearon correctamente
SELECT 
    trigger_name, 
    event_object_table, 
    action_statement,
    action_timing
FROM information_schema.triggers 
WHERE trigger_name LIKE '%_v2'
ORDER BY event_object_table;

-- PASO 6: Test básico - Verificar que la tabla modules tiene los campos correctos
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'modules' 
AND column_name IN ('module_id', 'created_by', 'updated_by', 'company_id')
ORDER BY column_name;