-- Insert sample companies
INSERT INTO companies (legal_name, trade_name, is_active) VALUES
('General', 'General', true),
('TechCorp SA', 'TechCorp', true),
('Innovation Labs SAS', 'InnLabs', true),
('Digital Solutions Ltda', 'DigitalSol', true)
ON CONFLICT (legal_name) DO NOTHING;

-- Insert sample positions
INSERT INTO positions (name, description, level, is_active) VALUES
('General', 'General position for users without specific assignment', 'general', true),
('Desarrollador', 'Desarrollador de software', 'jr', true),
('Desarrollador Senior', 'Desarrollador de software senior', 'sr', true),
('Team Lead', 'Líder de equipo técnico', 'lead', true),
('Product Manager', 'Gerente de producto', 'manager', true),
('Director Técnico', 'Director del área técnica', 'director', true)
ON CONFLICT (name) DO NOTHING;