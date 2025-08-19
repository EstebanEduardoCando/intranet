-- ============================
-- INTRANET DATABASE SCHEMA - SUPABASE VERSION
-- Compatible with Supabase SQL Editor
-- Note: Execute this in Supabase SQL Editor, not the complete schema.sql
-- ============================

-- ============================
-- CORE ENTITIES
-- ============================

-- Person entity (core identity information)
CREATE TABLE IF NOT EXISTS persons (
    person_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    second_last_name VARCHAR(50),
    identity_type VARCHAR(20) NOT NULL CHECK (identity_type IN ('DNI', 'PASSPORT', 'CC', 'NIE', 'OTHER')),
    identity_number VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(120) UNIQUE,
    phone VARCHAR(30),
    birth_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User profile entity (extends Supabase auth.users with business logic)
-- Links to auth.users via user_id (UUID) - managed by Supabase
CREATE TABLE IF NOT EXISTS user_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    person_id INTEGER NOT NULL UNIQUE REFERENCES persons(person_id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Company entity
CREATE TABLE IF NOT EXISTS companies (
    company_id SERIAL PRIMARY KEY,
    tax_id VARCHAR(20) UNIQUE,
    legal_name VARCHAR(120) NOT NULL,
    trade_name VARCHAR(120),
    contact_email VARCHAR(120),
    contact_phone VARCHAR(30),
    website VARCHAR(200),
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- ROLES AND POSITIONS SYSTEM
-- ============================

-- Job positions within organizations
CREATE TABLE IF NOT EXISTS positions (
    position_id SERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description TEXT,
    level VARCHAR(30),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System roles (permissions container)
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-many: Position can have multiple roles
CREATE TABLE IF NOT EXISTS position_roles (
    position_role_id SERIAL PRIMARY KEY,
    position_id INTEGER NOT NULL REFERENCES positions(position_id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(position_id, role_id)
);

-- Person assignment to company with position
CREATE TABLE IF NOT EXISTS position_assignments (
    assignment_id SERIAL PRIMARY KEY,
    person_id INTEGER NOT NULL REFERENCES persons(person_id) ON DELETE CASCADE,
    company_id INTEGER NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    position_id INTEGER NOT NULL REFERENCES positions(position_id) ON DELETE RESTRICT,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(person_id, company_id, position_id, start_date)
);

-- Optional: Direct role assignments to users (exceptions/overrides)
CREATE TABLE IF NOT EXISTS user_roles (
    user_role_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    company_id INTEGER REFERENCES companies(company_id) ON DELETE CASCADE,
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id, company_id)
);

-- ============================
-- MODULES AND FUNCTIONS SYSTEM
-- ============================

-- Hierarchical module system (modules and submodules)
CREATE TABLE IF NOT EXISTS modules (
    module_id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES modules(module_id) ON DELETE CASCADE,
    code VARCHAR(80) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Functions within modules/submodules
CREATE TABLE IF NOT EXISTS functions (
    function_id SERIAL PRIMARY KEY,
    module_id INTEGER NOT NULL REFERENCES modules(module_id) ON DELETE CASCADE,
    code VARCHAR(80) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    function_type VARCHAR(20) DEFAULT 'ACTION' CHECK (function_type IN ('ACTION', 'REPORT', 'VIEW', 'EXPORT')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- PERMISSIONS SYSTEM
-- ============================

-- Role permissions at module level
CREATE TABLE IF NOT EXISTS role_module_permissions (
    permission_id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL REFERENCES modules(module_id) ON DELETE CASCADE,
    can_view BOOLEAN NOT NULL DEFAULT false,
    can_create BOOLEAN NOT NULL DEFAULT false,
    can_edit BOOLEAN NOT NULL DEFAULT false,
    can_delete BOOLEAN NOT NULL DEFAULT false,
    can_execute BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, module_id)
);

-- Role permissions at function level (granular control)
CREATE TABLE IF NOT EXISTS role_function_permissions (
    permission_id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    function_id INTEGER NOT NULL REFERENCES functions(function_id) ON DELETE CASCADE,
    is_enabled BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, function_id)
);

-- ============================
-- OPTIONAL: USER PERMISSION OVERRIDES
-- ============================

-- User-specific module permission overrides
CREATE TABLE IF NOT EXISTS user_module_permissions (
    permission_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL REFERENCES modules(module_id) ON DELETE CASCADE,
    can_view BOOLEAN,
    can_create BOOLEAN,
    can_edit BOOLEAN,
    can_delete BOOLEAN,
    can_execute BOOLEAN,
    permission_source VARCHAR(30) DEFAULT 'OVERRIDE' CHECK (permission_source IN ('OVERRIDE', 'INHERITED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, module_id)
);

-- User-specific function permission overrides
CREATE TABLE IF NOT EXISTS user_function_permissions (
    permission_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    function_id INTEGER NOT NULL REFERENCES functions(function_id) ON DELETE CASCADE,
    is_enabled BOOLEAN,
    permission_source VARCHAR(30) DEFAULT 'OVERRIDE' CHECK (permission_source IN ('OVERRIDE', 'INHERITED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, function_id)
);

-- ============================
-- INDEXES FOR PERFORMANCE
-- ============================

-- Persons indexes
CREATE INDEX IF NOT EXISTS idx_persons_email ON persons(email);
CREATE INDEX IF NOT EXISTS idx_persons_identity ON persons(identity_type, identity_number);

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_person_id ON user_profiles(person_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_active ON user_profiles(is_active);

-- Assignments indexes
CREATE INDEX IF NOT EXISTS idx_position_assignments_person ON position_assignments(person_id);
CREATE INDEX IF NOT EXISTS idx_position_assignments_company ON position_assignments(company_id);
CREATE INDEX IF NOT EXISTS idx_position_assignments_active ON position_assignments(status, end_date);

-- Modules hierarchy index
CREATE INDEX IF NOT EXISTS idx_modules_parent ON modules(parent_id);
CREATE INDEX IF NOT EXISTS idx_modules_active ON modules(is_active);

-- Permission indexes
CREATE INDEX IF NOT EXISTS idx_role_module_permissions_role ON role_module_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_function_permissions_role ON role_function_permissions(role_id);

-- ============================
-- TRIGGERS FOR UPDATED_AT
-- ============================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
DROP TRIGGER IF EXISTS update_persons_updated_at ON persons;
CREATE TRIGGER update_persons_updated_at BEFORE UPDATE ON persons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_positions_updated_at ON positions;
CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_position_assignments_updated_at ON position_assignments;
CREATE TRIGGER update_position_assignments_updated_at BEFORE UPDATE ON position_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_modules_updated_at ON modules;
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_functions_updated_at ON functions;
CREATE TRIGGER update_functions_updated_at BEFORE UPDATE ON functions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_role_module_permissions_updated_at ON role_module_permissions;
CREATE TRIGGER update_role_module_permissions_updated_at BEFORE UPDATE ON role_module_permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_role_function_permissions_updated_at ON role_function_permissions;
CREATE TRIGGER update_role_function_permissions_updated_at BEFORE UPDATE ON role_function_permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_module_permissions_updated_at ON user_module_permissions;
CREATE TRIGGER update_user_module_permissions_updated_at BEFORE UPDATE ON user_module_permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_function_permissions_updated_at ON user_function_permissions;
CREATE TRIGGER update_user_function_permissions_updated_at BEFORE UPDATE ON user_function_permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();