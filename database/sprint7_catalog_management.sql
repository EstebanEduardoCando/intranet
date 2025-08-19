-- ============================
-- SPRINT 7 - ADMINISTRACIÓN DE CATÁLOGOS
-- Sistema de Auditoría y Gestión de Cambios
-- ============================

-- ============================
-- EXTENSIONES DE TABLAS EXISTENTES
-- ============================

-- Agregar campos de auditoría a tablas existentes
ALTER TABLE companies ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE companies ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

ALTER TABLE positions ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE positions ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE positions ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE positions ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

ALTER TABLE roles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE roles ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE roles ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

ALTER TABLE modules ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE modules ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id);
ALTER TABLE modules ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE modules ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- ============================
-- TABLA DE AUDITORÍA UNIVERSAL
-- ============================

CREATE TABLE IF NOT EXISTS audit_logs (
    audit_id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id VARCHAR(50) NOT NULL, -- Puede ser INT, UUID, etc.
    operation_type VARCHAR(20) NOT NULL CHECK (operation_type IN ('CREATE', 'UPDATE', 'DELETE', 'RESTORE')),
    
    -- Datos del cambio
    old_values JSONB, -- Valores anteriores (NULL en CREATE)
    new_values JSONB, -- Valores nuevos (NULL en DELETE)
    changed_fields TEXT[], -- Array de campos modificados
    
    -- Información del usuario
    user_id UUID NOT NULL REFERENCES auth.users(id),
    user_email VARCHAR(120),
    user_role VARCHAR(50),
    
    -- Información del contexto
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Metadata adicional
    comment TEXT, -- Comentario opcional del usuario
    tags TEXT[], -- Tags para categorización
    
    -- Índices para búsqueda
    CONSTRAINT idx_audit_table_record UNIQUE (audit_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_audit_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_record_id ON audit_logs(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_operation ON audit_logs(operation_type);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_table_record ON audit_logs(table_name, record_id);

-- ============================
-- FUNCIONES DE AUDITORÍA
-- ============================

-- Función para crear logs de auditoría
CREATE OR REPLACE FUNCTION create_audit_log(
    p_table_name VARCHAR(50),
    p_record_id VARCHAR(50),
    p_operation_type VARCHAR(20),
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_user_id UUID DEFAULT NULL,
    p_comment TEXT DEFAULT NULL
) RETURNS BIGINT AS $$
DECLARE
    v_audit_id BIGINT;
    v_user_email VARCHAR(120);
    v_changed_fields TEXT[];
    v_key TEXT;
BEGIN
    -- Obtener email del usuario
    SELECT email INTO v_user_email 
    FROM auth.users 
    WHERE id = p_user_id;
    
    -- Calcular campos cambiados
    IF p_old_values IS NOT NULL AND p_new_values IS NOT NULL THEN
        SELECT array_agg(key) INTO v_changed_fields
        FROM jsonb_each(p_new_values) 
        WHERE value != coalesce(p_old_values->key, 'null'::jsonb);
    END IF;
    
    -- Insertar log de auditoría
    INSERT INTO audit_logs (
        table_name, record_id, operation_type,
        old_values, new_values, changed_fields,
        user_id, user_email, comment,
        created_at
    ) VALUES (
        p_table_name, p_record_id, p_operation_type,
        p_old_values, p_new_values, v_changed_fields,
        p_user_id, v_user_email, p_comment,
        CURRENT_TIMESTAMP
    ) RETURNING audit_id INTO v_audit_id;
    
    RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql;

-- ============================
-- TRIGGERS DE AUDITORÍA AUTOMÁTICA
-- ============================

-- Función trigger genérica para auditoría
CREATE OR REPLACE FUNCTION audit_trigger_function() RETURNS TRIGGER AS $$
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
    
    -- Crear log de auditoría
    PERFORM create_audit_log(
        TG_TABLE_NAME::VARCHAR(50),
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.company_id::VARCHAR(50) -- Para companies
            WHEN TG_TABLE_NAME = 'companies' THEN NEW.company_id::VARCHAR(50)
            WHEN TG_TABLE_NAME = 'positions' THEN NEW.position_id::VARCHAR(50)
            WHEN TG_TABLE_NAME = 'roles' THEN NEW.role_id::VARCHAR(50)
            WHEN TG_TABLE_NAME = 'modules' THEN NEW.module_id::VARCHAR(50)
            ELSE 'unknown'::VARCHAR(50)
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

-- Aplicar triggers a tablas principales
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

-- ============================
-- NOTIFICACIONES PERSISTENTES
-- ============================

CREATE TABLE IF NOT EXISTS user_notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Contenido de la notificación
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('success', 'error', 'warning', 'info')),
    
    -- Metadatos
    category VARCHAR(50) DEFAULT 'general', -- audit, system, user, etc.
    priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 5), -- 1=max, 5=min
    
    -- Estado
    is_read BOOLEAN DEFAULT false,
    is_dismissed BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    dismissed_at TIMESTAMP WITH TIME ZONE,
    
    -- Datos adicionales
    data JSONB, -- Datos contextuales (IDs, enlaces, etc.)
    expires_at TIMESTAMP WITH TIME ZONE, -- Expiración opcional
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_read ON user_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_user_notifications_type ON user_notifications(type);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created ON user_notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_user_notifications_priority ON user_notifications(priority);

-- ============================
-- CONFIGURACIONES DEL SISTEMA
-- ============================

CREATE TABLE IF NOT EXISTS system_configurations (
    config_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL = configuración global
    
    -- Clave de configuración
    config_key VARCHAR(100) NOT NULL,
    config_value JSONB NOT NULL,
    
    -- Metadatos
    description TEXT,
    category VARCHAR(50) DEFAULT 'general', -- theme, notifications, validation, etc.
    
    -- Control de acceso
    is_public BOOLEAN DEFAULT false, -- Si otros usuarios pueden ver esta config
    is_system BOOLEAN DEFAULT false, -- Si es configuración del sistema
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraint para evitar duplicados
    UNIQUE(user_id, config_key)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_system_config_user ON system_configurations(user_id);
CREATE INDEX IF NOT EXISTS idx_system_config_key ON system_configurations(config_key);
CREATE INDEX IF NOT EXISTS idx_system_config_category ON system_configurations(category);

-- ============================
-- VISTAS PARA AUDITORÍA
-- ============================

-- Vista de auditoría con información de usuario
CREATE OR REPLACE VIEW audit_logs_detailed AS
SELECT 
    al.*,
    p.first_name || ' ' || p.last_name as user_full_name,
    up.username
FROM audit_logs al
LEFT JOIN user_profiles up ON al.user_id = up.user_id
LEFT JOIN persons p ON up.person_id = p.person_id
ORDER BY al.created_at DESC;

-- Vista de cambios recientes por tabla
CREATE OR REPLACE VIEW recent_changes_summary AS
SELECT 
    table_name,
    operation_type,
    COUNT(*) as change_count,
    MAX(created_at) as last_change,
    COUNT(DISTINCT user_id) as users_involved
FROM audit_logs 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY table_name, operation_type
ORDER BY last_change DESC;

-- ============================
-- FUNCIONES DE UTILIDAD
-- ============================

-- Función para obtener historial de un registro
CREATE OR REPLACE FUNCTION get_record_history(
    p_table_name VARCHAR(50),
    p_record_id VARCHAR(50)
) RETURNS TABLE (
    audit_id BIGINT,
    operation_type VARCHAR(20),
    changed_fields TEXT[],
    user_full_name TEXT,
    audit_timestamp TIMESTAMP WITH TIME ZONE,
    comment TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.audit_id,
        al.operation_type,
        al.changed_fields,
        COALESCE(p.first_name || ' ' || p.last_name, al.user_email) as user_full_name,
        al.created_at,
        al.comment
    FROM audit_logs al
    LEFT JOIN user_profiles up ON al.user_id = up.user_id
    LEFT JOIN persons p ON up.person_id = p.person_id
    WHERE al.table_name = p_table_name 
      AND al.record_id = p_record_id
    ORDER BY al.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para crear notificación de usuario
CREATE OR REPLACE FUNCTION create_user_notification(
    p_user_id UUID,
    p_title VARCHAR(200),
    p_message TEXT,
    p_type VARCHAR(50) DEFAULT 'info',
    p_category VARCHAR(50) DEFAULT 'general',
    p_priority INTEGER DEFAULT 3,
    p_data JSONB DEFAULT NULL
) RETURNS BIGINT AS $$
DECLARE
    v_notification_id BIGINT;
BEGIN
    INSERT INTO user_notifications (
        user_id, title, message, type, category, priority, data
    ) VALUES (
        p_user_id, p_title, p_message, p_type, p_category, p_priority, p_data
    ) RETURNING notification_id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- ============================
-- TRIGGERS PARA UPDATED_AT
-- ============================

-- Aplicar trigger de updated_at a nuevas tablas
DROP TRIGGER IF EXISTS update_user_notifications_updated_at ON user_notifications;
CREATE TRIGGER update_user_notifications_updated_at 
    BEFORE UPDATE ON user_notifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_system_configurations_updated_at ON system_configurations;
CREATE TRIGGER update_system_configurations_updated_at 
    BEFORE UPDATE ON system_configurations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================
-- DATOS INICIALES
-- ============================

-- Configuraciones del sistema por defecto
INSERT INTO system_configurations (config_key, config_value, description, category, is_system) VALUES
('theme.primaryColor', '"#1976d2"', 'Color primario del tema', 'theme', true),
('theme.secondaryColor', '"#dc004e"', 'Color secundario del tema', 'theme', true),
('theme.sidebarWidth', '280', 'Ancho del sidebar en pixels', 'theme', true),
('notifications.defaultDuration', '3000', 'Duración por defecto de notificaciones en ms', 'notifications', true),
('notifications.maxHistory', '50', 'Máximo de notificaciones en historial', 'notifications', true),
('pagination.defaultRowsPerPage', '10', 'Filas por página por defecto', 'pagination', true),
('pagination.options', '[5, 10, 25, 50]', 'Opciones de filas por página', 'pagination', true),
('validation.password.minLength', '8', 'Longitud mínima de contraseña', 'validation', true),
('validation.names.minLength', '2', 'Longitud mínima de nombres', 'validation', true)
ON CONFLICT (user_id, config_key) DO NOTHING;

-- ============================
-- COMENTARIOS
-- ============================

COMMENT ON TABLE audit_logs IS 'Registro histórico de todos los cambios en las tablas principales del sistema';
COMMENT ON TABLE user_notifications IS 'Notificaciones persistentes por usuario';
COMMENT ON TABLE system_configurations IS 'Configuraciones del sistema por usuario y globales';

COMMENT ON COLUMN audit_logs.old_values IS 'Valores anteriores al cambio en formato JSONB';
COMMENT ON COLUMN audit_logs.new_values IS 'Valores nuevos después del cambio en formato JSONB';
COMMENT ON COLUMN audit_logs.changed_fields IS 'Array con los nombres de los campos modificados';
COMMENT ON COLUMN user_notifications.data IS 'Datos contextuales adicionales en formato JSONB';
COMMENT ON COLUMN system_configurations.config_value IS 'Valor de la configuración en formato JSONB para flexibilidad de tipos';

-- ============================
-- PERMISOS RLS (Row Level Security)
-- ============================

-- Habilitar RLS en nuevas tablas
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_configurations ENABLE ROW LEVEL SECURITY;

-- Políticas para user_notifications
CREATE POLICY "Users can view their own notifications" ON user_notifications
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON user_notifications
    FOR UPDATE USING (user_id = auth.uid());

-- Políticas para system_configurations
CREATE POLICY "Users can view their own configs and public configs" ON system_configurations
    FOR SELECT USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can manage their own configs" ON system_configurations
    FOR ALL USING (user_id = auth.uid());

-- Solo administradores pueden ver audit_logs (configurar según roles)
-- CREATE POLICY "Admin can view audit logs" ON audit_logs FOR SELECT USING (...);