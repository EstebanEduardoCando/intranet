-- Drop old tables if they exist (clean slate)
DROP TABLE IF EXISTS public.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- =================================================================
-- PERSONS TABLE - Base personal information
-- =================================================================
CREATE TABLE IF NOT EXISTS public.persons (
    person_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    second_last_name VARCHAR(100),
    identity_type VARCHAR(20) NOT NULL CHECK (identity_type IN ('DNI', 'PASSPORT', 'CC', 'NIE', 'OTHER')),
    identity_number VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(identity_type, identity_number)
);

-- =================================================================
-- COMPANIES TABLE - Organizations
-- =================================================================
CREATE TABLE IF NOT EXISTS public.companies (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- POSITIONS TABLE - Job positions
-- =================================================================
CREATE TABLE IF NOT EXISTS public.positions (
    position_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- ROLES TABLE - User roles and permissions
-- =================================================================
CREATE TABLE IF NOT EXISTS public.roles (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- USER_PROFILES TABLE - Links auth.users with business data
-- =================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    person_id INTEGER NOT NULL REFERENCES public.persons(person_id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    preferences JSONB DEFAULT '{}',
    company_id INTEGER REFERENCES public.companies(company_id) ON DELETE SET NULL,
    position_id INTEGER REFERENCES public.positions(position_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id),
    UNIQUE(person_id)
);

-- =================================================================
-- USER_ROLES TABLE - Many-to-many relationship between users and roles
-- =================================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES public.roles(role_id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    PRIMARY KEY (user_id, role_id)
);

-- =================================================================
-- MODULES TABLE - System modules (if not exists from previous migration)
-- =================================================================
CREATE TABLE IF NOT EXISTS public.modules (
    module_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    path VARCHAR(200) NOT NULL,
    icon VARCHAR(50),
    parent_id INTEGER REFERENCES public.modules(module_id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- INDEXES for performance
-- =================================================================
CREATE INDEX IF NOT EXISTS idx_persons_identity ON public.persons(identity_type, identity_number);
CREATE INDEX IF NOT EXISTS idx_persons_name ON public.persons(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_person_id ON public.user_profiles(person_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON public.user_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_position ON public.user_profiles(position_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_modules_parent ON public.modules(parent_id);

-- =================================================================
-- TRIGGERS for updated_at columns
-- =================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_persons_updated_at BEFORE UPDATE ON public.persons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON public.positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- ROW LEVEL SECURITY (RLS)
-- =================================================================
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- =================================================================
-- RLS POLICIES
-- =================================================================

-- PERSONS: Users can only access their own person data
CREATE POLICY "Users can view own person data" ON public.persons
    FOR SELECT USING (
        person_id IN (
            SELECT person_id FROM public.user_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own person data" ON public.persons
    FOR UPDATE USING (
        person_id IN (
            SELECT person_id FROM public.user_profiles WHERE user_id = auth.uid()
        )
    );

-- COMPANIES: All authenticated users can read companies
CREATE POLICY "Authenticated users can view companies" ON public.companies
    FOR SELECT USING (auth.role() = 'authenticated');

-- POSITIONS: All authenticated users can read positions
CREATE POLICY "Authenticated users can view positions" ON public.positions
    FOR SELECT USING (auth.role() = 'authenticated');

-- ROLES: All authenticated users can read roles
CREATE POLICY "Authenticated users can view roles" ON public.roles
    FOR SELECT USING (auth.role() = 'authenticated');

-- USER_PROFILES: Users can access their own profile and admins can access all
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (user_id = auth.uid());

-- USER_ROLES: Users can view their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT USING (user_id = auth.uid());

-- MODULES: All authenticated users can read modules
CREATE POLICY "Authenticated users can view modules" ON public.modules
    FOR SELECT USING (auth.role() = 'authenticated');

-- =================================================================
-- SEED DATA
-- =================================================================

-- Insert default companies
INSERT INTO public.companies (name, description, is_active) VALUES
('Matriz', 'Oficina principal de la empresa', true),
('Sucursal Norte', 'Sucursal ubicada en el norte', true),
('Sucursal Sur', 'Sucursal ubicada en el sur', true)
ON CONFLICT DO NOTHING;

-- Insert default positions
INSERT INTO public.positions (name, description, department, is_active) VALUES
('Desarrollador Senior', 'Desarrollador con experiencia avanzada', 'Tecnología', true),
('Desarrollador Junior', 'Desarrollador con experiencia básica', 'Tecnología', true),
('Analista de Sistemas', 'Analista de sistemas y procesos', 'Tecnología', true),
('Gerente de Proyecto', 'Gestión de proyectos', 'Gestión', true),
('Diseñador UX/UI', 'Diseño de experiencia de usuario', 'Diseño', true),
('Administrador', 'Administración general', 'Administración', true)
ON CONFLICT DO NOTHING;

-- Insert default roles
INSERT INTO public.roles (name, description, is_active) VALUES
('Administrador', 'Acceso completo al sistema', true),
('Usuario', 'Acceso básico al sistema', true),
('Supervisor', 'Acceso de supervisión', true),
('Invitado', 'Acceso limitado de solo lectura', true)
ON CONFLICT DO NOTHING;