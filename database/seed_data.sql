-- ============================
-- SEED DATA FOR INTRANET SYSTEM
-- Base catalog information for system initialization
-- ============================

-- ============================
-- COMPANIES (Sample organizations)
-- ============================

INSERT INTO companies (company_id, tax_id, legal_name, trade_name, contact_email, contact_phone, website, address, is_active) VALUES
(1, '20123456789', 'TechCorp Solutions S.A.C.', 'TechCorp', 'info@techcorp.com', '+51-1-234-5678', 'https://techcorp.com', 'Av. Javier Prado 123, San Isidro, Lima', true),
(2, '20987654321', 'Innovate Digital Peru S.A.', 'Innovate Digital', 'contact@innovatedigital.pe', '+51-1-987-6543', 'https://innovatedigital.pe', 'Calle Las Begonias 456, San Isidro, Lima', true),
(3, '20555666777', 'Global Services International S.A.C.', 'GSI', 'hello@gsi.com.pe', '+51-1-555-6667', 'https://gsi.com.pe', 'Av. El Derby 789, Surco, Lima', true);

-- ============================
-- POSITIONS (Job titles/roles in organizations)
-- ============================

INSERT INTO positions (position_id, name, description, level, is_active) VALUES
-- Executive Level
(1, 'Chief Executive Officer', 'Chief Executive Officer responsible for overall company strategy', 'executive', true),
(2, 'Chief Technology Officer', 'Chief Technology Officer overseeing technology strategy', 'executive', true),
(3, 'Chief Financial Officer', 'Chief Financial Officer managing financial operations', 'executive', true),

-- Management Level
(10, 'General Manager', 'General Manager overseeing multiple departments', 'manager', true),
(11, 'IT Manager', 'IT Manager responsible for technology operations', 'manager', true),
(12, 'HR Manager', 'Human Resources Manager handling people operations', 'manager', true),
(13, 'Finance Manager', 'Finance Manager overseeing financial processes', 'manager', true),
(14, 'Operations Manager', 'Operations Manager handling day-to-day operations', 'manager', true),

-- Senior Level
(20, 'Senior Software Engineer', 'Senior Software Engineer with leadership responsibilities', 'senior', true),
(21, 'Senior Business Analyst', 'Senior Business Analyst leading analysis projects', 'senior', true),
(22, 'Senior Accountant', 'Senior Accountant handling complex financial matters', 'senior', true),
(23, 'Senior HR Specialist', 'Senior HR Specialist with specialized expertise', 'senior', true),

-- Mid Level
(30, 'Software Engineer', 'Software Engineer developing applications', 'mid', true),
(31, 'Business Analyst', 'Business Analyst gathering and analyzing requirements', 'mid', true),
(32, 'Accountant', 'Accountant handling financial records and reporting', 'mid', true),
(33, 'HR Specialist', 'HR Specialist supporting human resources functions', 'mid', true),
(34, 'Project Coordinator', 'Project Coordinator supporting project management', 'mid', true),

-- Junior Level
(40, 'Junior Software Engineer', 'Junior Software Engineer learning and developing', 'junior', true),
(41, 'Junior Business Analyst', 'Junior Business Analyst supporting analysis activities', 'junior', true),
(42, 'Junior Accountant', 'Junior Accountant learning accounting processes', 'junior', true),
(43, 'Administrative Assistant', 'Administrative Assistant providing office support', 'junior', true),
(44, 'Intern', 'Intern gaining professional experience', 'intern', true);

-- ============================
-- SYSTEM ROLES (Permission containers)
-- ============================

INSERT INTO roles (role_id, name, description, is_active) VALUES
-- Administrative Roles
(1, 'System Administrator', 'Full system access and administration capabilities', true),
(2, 'Company Administrator', 'Administration capabilities within company scope', true),
(3, 'HR Administrator', 'Human resources administration and user management', true),

-- Management Roles
(10, 'Executive', 'Executive level access to strategic information and decisions', true),
(11, 'Department Manager', 'Management access within department scope', true),
(12, 'Team Leader', 'Team leadership and coordination capabilities', true),

-- Functional Roles
(20, 'Finance User', 'Access to financial modules and reports', true),
(21, 'HR User', 'Access to human resources modules', true),
(22, 'IT User', 'Access to IT and technology modules', true),
(23, 'Operations User', 'Access to operational modules and processes', true),
(24, 'Project Manager', 'Project management and tracking capabilities', true),

-- Basic Roles
(30, 'Employee', 'Basic employee access to personal and common modules', true),
(31, 'Guest', 'Limited guest access to public information', true),
(32, 'Viewer', 'Read-only access to assigned modules', true);

-- ============================
-- POSITION-ROLE MAPPINGS
-- ============================

INSERT INTO position_roles (position_id, role_id) VALUES
-- Executive positions get executive and administrative roles
(1, 1), (1, 10), -- CEO: System Admin + Executive
(2, 2), (2, 10), (2, 22), -- CTO: Company Admin + Executive + IT User
(3, 2), (3, 10), (3, 20), -- CFO: Company Admin + Executive + Finance User

-- Management positions
(10, 11), (10, 30), -- General Manager: Department Manager + Employee
(11, 11), (11, 22), (11, 30), -- IT Manager: Department Manager + IT User + Employee
(12, 3), (12, 11), (12, 21), (12, 30), -- HR Manager: HR Admin + Department Manager + HR User + Employee
(13, 11), (13, 20), (13, 30), -- Finance Manager: Department Manager + Finance User + Employee
(14, 11), (14, 23), (14, 30), -- Operations Manager: Department Manager + Operations User + Employee

-- Senior positions
(20, 12), (20, 22), (20, 30), -- Senior Software Engineer: Team Leader + IT User + Employee
(21, 12), (21, 23), (21, 30), -- Senior Business Analyst: Team Leader + Operations User + Employee
(22, 12), (22, 20), (22, 30), -- Senior Accountant: Team Leader + Finance User + Employee
(23, 12), (23, 21), (23, 30), -- Senior HR Specialist: Team Leader + HR User + Employee

-- Mid-level positions
(30, 22), (30, 30), -- Software Engineer: IT User + Employee
(31, 23), (31, 30), -- Business Analyst: Operations User + Employee
(32, 20), (32, 30), -- Accountant: Finance User + Employee
(33, 21), (33, 30), -- HR Specialist: HR User + Employee
(34, 24), (34, 30), -- Project Coordinator: Project Manager + Employee

-- Junior positions
(40, 22), (40, 30), -- Junior Software Engineer: IT User + Employee
(41, 23), (41, 30), -- Junior Business Analyst: Operations User + Employee
(42, 20), (42, 30), -- Junior Accountant: Finance User + Employee
(43, 30), -- Administrative Assistant: Employee
(44, 32); -- Intern: Viewer

-- ============================
-- MODULES (System modules hierarchy)
-- ============================

INSERT INTO modules (module_id, parent_id, code, name, description, icon, sort_order, is_active) VALUES
-- Main Modules (parent_id = NULL)
(1, NULL, 'DASHBOARD', 'Dashboard', 'Main dashboard and overview', 'dashboard', 1, true),
(2, NULL, 'ADMIN', 'Administration', 'System administration and configuration', 'settings', 2, true),
(3, NULL, 'HR', 'Human Resources', 'Human resources management', 'people', 3, true),
(4, NULL, 'FINANCE', 'Finance', 'Financial management and accounting', 'attach_money', 4, true),
(5, NULL, 'PROJECTS', 'Projects', 'Project management and tracking', 'assignment', 5, true),
(6, NULL, 'REPORTS', 'Reports', 'Reports and analytics', 'assessment', 6, true),
(7, NULL, 'DOCUMENTS', 'Documents', 'Document management and storage', 'folder', 7, true),
(8, NULL, 'SETTINGS', 'Settings', 'Personal and system settings', 'tune', 8, true),

-- Administration Submodules
(20, 2, 'ADMIN.USERS', 'User Management', 'Manage system users and access', 'person', 1, true),
(21, 2, 'ADMIN.COMPANIES', 'Company Management', 'Manage companies and organizations', 'business', 2, true),
(22, 2, 'ADMIN.ROLES', 'Role Management', 'Manage roles and permissions', 'security', 3, true),
(23, 2, 'ADMIN.MODULES', 'Module Management', 'Manage system modules and functions', 'extension', 4, true),
(24, 2, 'ADMIN.SYSTEM', 'System Configuration', 'System-wide configuration and maintenance', 'build', 5, true),

-- HR Submodules
(30, 3, 'HR.EMPLOYEES', 'Employee Management', 'Manage employee information and records', 'badge', 1, true),
(31, 3, 'HR.POSITIONS', 'Position Management', 'Manage job positions and assignments', 'work', 2, true),
(32, 3, 'HR.RECRUITMENT', 'Recruitment', 'Recruitment and hiring processes', 'person_add', 3, true),
(33, 3, 'HR.PERFORMANCE', 'Performance', 'Performance evaluation and management', 'trending_up', 4, true),
(34, 3, 'HR.TRAINING', 'Training', 'Training and development programs', 'school', 5, true),

-- Finance Submodules
(40, 4, 'FINANCE.ACCOUNTING', 'Accounting', 'General accounting and bookkeeping', 'calculate', 1, true),
(41, 4, 'FINANCE.BUDGETS', 'Budget Management', 'Budget planning and control', 'pie_chart', 2, true),
(42, 4, 'FINANCE.EXPENSES', 'Expense Management', 'Expense tracking and approval', 'receipt', 3, true),
(43, 4, 'FINANCE.PAYROLL', 'Payroll', 'Payroll processing and management', 'payment', 4, true),
(44, 4, 'FINANCE.INVOICING', 'Invoicing', 'Invoice generation and management', 'description', 5, true),

-- Projects Submodules
(50, 5, 'PROJECTS.PLANNING', 'Project Planning', 'Project planning and scheduling', 'event_note', 1, true),
(51, 5, 'PROJECTS.TRACKING', 'Project Tracking', 'Project progress tracking and monitoring', 'track_changes', 2, true),
(52, 5, 'PROJECTS.RESOURCES', 'Resource Management', 'Project resource allocation and management', 'group_work', 3, true),
(53, 5, 'PROJECTS.TASKS', 'Task Management', 'Task assignment and tracking', 'task_alt', 4, true);

-- ============================
-- FUNCTIONS (Specific actions within modules)
-- ============================

INSERT INTO functions (function_id, module_id, code, name, description, function_type, is_active) VALUES
-- Dashboard Functions
(1, 1, 'VIEW_DASHBOARD', 'View Dashboard', 'Access main dashboard', 'VIEW', true),
(2, 1, 'EXPORT_DASHBOARD', 'Export Dashboard', 'Export dashboard data', 'EXPORT', true),

-- User Management Functions
(10, 20, 'CREATE_USER', 'Create User', 'Create new system user', 'ACTION', true),
(11, 20, 'EDIT_USER', 'Edit User', 'Edit user information', 'ACTION', true),
(12, 20, 'DELETE_USER', 'Delete User', 'Delete system user', 'ACTION', true),
(13, 20, 'RESET_PASSWORD', 'Reset Password', 'Reset user password', 'ACTION', true),
(14, 20, 'VIEW_USERS', 'View Users', 'View user list and details', 'VIEW', true),

-- Company Management Functions
(20, 21, 'CREATE_COMPANY', 'Create Company', 'Create new company', 'ACTION', true),
(21, 21, 'EDIT_COMPANY', 'Edit Company', 'Edit company information', 'ACTION', true),
(22, 21, 'DELETE_COMPANY', 'Delete Company', 'Delete company', 'ACTION', true),
(23, 21, 'VIEW_COMPANIES', 'View Companies', 'View company list and details', 'VIEW', true),

-- Role Management Functions
(30, 22, 'CREATE_ROLE', 'Create Role', 'Create new system role', 'ACTION', true),
(31, 22, 'EDIT_ROLE', 'Edit Role', 'Edit role information and permissions', 'ACTION', true),
(32, 22, 'DELETE_ROLE', 'Delete Role', 'Delete system role', 'ACTION', true),
(33, 22, 'VIEW_ROLES', 'View Roles', 'View role list and permissions', 'VIEW', true),
(34, 22, 'ASSIGN_PERMISSIONS', 'Assign Permissions', 'Assign permissions to roles', 'ACTION', true),

-- Employee Management Functions
(40, 30, 'CREATE_EMPLOYEE', 'Create Employee', 'Create new employee record', 'ACTION', true),
(41, 30, 'EDIT_EMPLOYEE', 'Edit Employee', 'Edit employee information', 'ACTION', true),
(42, 30, 'DELETE_EMPLOYEE', 'Delete Employee', 'Delete employee record', 'ACTION', true),
(43, 30, 'VIEW_EMPLOYEES', 'View Employees', 'View employee list and details', 'VIEW', true),
(44, 30, 'EXPORT_EMPLOYEES', 'Export Employees', 'Export employee data', 'EXPORT', true),

-- Finance Functions
(50, 40, 'CREATE_TRANSACTION', 'Create Transaction', 'Create accounting transaction', 'ACTION', true),
(51, 40, 'APPROVE_TRANSACTION', 'Approve Transaction', 'Approve financial transaction', 'ACTION', true),
(52, 40, 'VIEW_TRANSACTIONS', 'View Transactions', 'View transaction history', 'VIEW', true),
(53, 40, 'FINANCIAL_REPORTS', 'Financial Reports', 'Generate financial reports', 'REPORT', true),

-- Project Management Functions
(60, 50, 'CREATE_PROJECT', 'Create Project', 'Create new project', 'ACTION', true),
(61, 50, 'EDIT_PROJECT', 'Edit Project', 'Edit project information', 'ACTION', true),
(62, 50, 'DELETE_PROJECT', 'Delete Project', 'Delete project', 'ACTION', true),
(63, 50, 'VIEW_PROJECTS', 'View Projects', 'View project list and details', 'VIEW', true),
(64, 53, 'ASSIGN_TASK', 'Assign Task', 'Assign task to team member', 'ACTION', true),
(65, 53, 'UPDATE_TASK_STATUS', 'Update Task Status', 'Update task progress status', 'ACTION', true);

-- Reset sequences to continue from current max values
SELECT setval('companies_company_id_seq', (SELECT MAX(company_id) FROM companies));
SELECT setval('positions_position_id_seq', (SELECT MAX(position_id) FROM positions));
SELECT setval('roles_role_id_seq', (SELECT MAX(role_id) FROM roles));
SELECT setval('modules_module_id_seq', (SELECT MAX(module_id) FROM modules));
SELECT setval('functions_function_id_seq', (SELECT MAX(function_id) FROM functions));

-- ============================
-- BASIC ROLE PERMISSIONS
-- Sample permissions for common roles
-- ============================

-- System Administrator gets full access to all modules
INSERT INTO role_module_permissions (role_id, module_id, can_view, can_create, can_edit, can_delete, can_execute)
SELECT 1, module_id, true, true, true, true, true FROM modules WHERE is_active = true;

-- Employee role gets basic access to dashboard and settings
INSERT INTO role_module_permissions (role_id, module_id, can_view, can_create, can_edit, can_delete, can_execute) VALUES
(30, 1, true, false, false, false, true), -- Dashboard
(30, 8, true, false, true, false, true);  -- Settings (personal)

-- HR Administrator gets full access to HR modules
INSERT INTO role_module_permissions (role_id, module_id, can_view, can_create, can_edit, can_delete, can_execute)
SELECT 3, module_id, true, true, true, true, true FROM modules WHERE code LIKE 'HR%' OR code = 'DASHBOARD';

-- Finance User gets access to finance modules
INSERT INTO role_module_permissions (role_id, module_id, can_view, can_create, can_edit, can_delete, can_execute)
SELECT 20, module_id, true, true, true, false, true FROM modules WHERE code LIKE 'FINANCE%' OR code = 'DASHBOARD';