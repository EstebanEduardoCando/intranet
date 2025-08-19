-- ============================
-- FIX: Trigger de auditoría para tabla modules
-- Problema: El trigger intenta acceder a OLD.company_id pero modules no tiene ese campo
-- ============================

-- Corregir función de trigger de auditoría
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    v_old_values JSONB;
    v_new_values JSONB;
    v_operation VARCHAR(20);
    v_user_id UUID;
BEGIN
    -- Determinar operación
    IF TG_OP = 'DELETE' THEN
        v_operation := 'DELETE';
        v_old_values := to_jsonb(OLD);
        v_new_values := NULL;
        v_user_id := OLD.updated_by;
    ELSIF TG_OP = 'UPDATE' THEN
        v_operation := 'UPDATE';
        v_old_values := to_jsonb(OLD);
        v_new_values := to_jsonb(NEW);
        v_user_id := NEW.updated_by;
    ELSIF TG_OP = 'INSERT' THEN
        v_operation := 'CREATE';
        v_old_values := NULL;
        v_new_values := to_jsonb(NEW);
        v_user_id := NEW.created_by;
    END IF;
    
    -- Crear log de auditoría con ID correcto para cada tabla
    PERFORM create_audit_log(
        TG_TABLE_NAME::VARCHAR(50),
        CASE 
            WHEN TG_OP = 'DELETE' THEN
                CASE 
                    WHEN TG_TABLE_NAME = 'companies' THEN OLD.company_id::VARCHAR(50)
                    WHEN TG_TABLE_NAME = 'positions' THEN OLD.position_id::VARCHAR(50)
                    WHEN TG_TABLE_NAME = 'roles' THEN OLD.role_id::VARCHAR(50)
                    WHEN TG_TABLE_NAME = 'modules' THEN OLD.module_id::VARCHAR(50)
                    ELSE 'unknown'::VARCHAR(50)
                END
            ELSE -- INSERT or UPDATE
                CASE 
                    WHEN TG_TABLE_NAME = 'companies' THEN NEW.company_id::VARCHAR(50)
                    WHEN TG_TABLE_NAME = 'positions' THEN NEW.position_id::VARCHAR(50)
                    WHEN TG_TABLE_NAME = 'roles' THEN NEW.role_id::VARCHAR(50)
                    WHEN TG_TABLE_NAME = 'modules' THEN NEW.module_id::VARCHAR(50)
                    ELSE 'unknown'::VARCHAR(50)
                END
        END,
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
END;
$$ LANGUAGE plpgsql;

-- Recrear triggers para todas las tablas
DROP TRIGGER IF EXISTS audit_companies_trigger ON companies;
CREATE TRIGGER audit_companies_trigger
    AFTER INSERT OR UPDATE OR DELETE ON companies
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_positions_trigger ON positions;
CREATE TRIGGER audit_positions_trigger
    AFTER INSERT OR UPDATE OR DELETE ON positions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_roles_trigger ON roles;
CREATE TRIGGER audit_roles_trigger
    AFTER INSERT OR UPDATE OR DELETE ON roles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_modules_trigger ON modules;
CREATE TRIGGER audit_modules_trigger
    AFTER INSERT OR UPDATE OR DELETE ON modules
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Verificar que los triggers funcionan correctamente
SELECT 
    trigger_name, 
    event_object_table, 
    action_statement
FROM information_schema.triggers 
WHERE trigger_name LIKE 'audit_%_trigger'
ORDER BY event_object_table;