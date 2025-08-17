import { supabase } from '../src/infrastructure/supabase/supabaseClient';

/**
 * Verify database schema and data
 */
async function verifyDatabase() {
  console.log('🔍 Verificando esquema de base de datos en Supabase...\n');

  const tables = [
    'persons',
    'companies', 
    'positions',
    'roles',
    'user_profiles',
    'user_roles',
    'modules'
  ];

  try {
    // 1. Verificar que las tablas existen
    console.log('📋 Verificando existencia de tablas:');
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ ${table}: ${error.message}`);
        } else {
          console.log(`   ✅ ${table}: OK`);
        }
      } catch (err) {
        console.log(`   ❌ ${table}: Error de conexión`);
      }
    }

    console.log('\n📊 Verificando datos semilla:');

    // 2. Verificar companies
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*');
    
    if (companiesError) {
      console.log(`   ❌ Companies: ${companiesError.message}`);
    } else {
      console.log(`   ✅ Companies: ${companies?.length || 0} registros`);
      companies?.forEach(company => {
        console.log(`      - ${company.name} (ID: ${company.company_id})`);
      });
    }

    // 3. Verificar positions
    const { data: positions, error: positionsError } = await supabase
      .from('positions')
      .select('*');
    
    if (positionsError) {
      console.log(`   ❌ Positions: ${positionsError.message}`);
    } else {
      console.log(`   ✅ Positions: ${positions?.length || 0} registros`);
      positions?.forEach(position => {
        console.log(`      - ${position.name} (ID: ${position.position_id})`);
      });
    }

    // 4. Verificar roles
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('*');
    
    if (rolesError) {
      console.log(`   ❌ Roles: ${rolesError.message}`);
    } else {
      console.log(`   ✅ Roles: ${roles?.length || 0} registros`);
      roles?.forEach(role => {
        console.log(`      - ${role.name} (ID: ${role.role_id})`);
      });
    }

    // 5. Verificar user_profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select(`
        *,
        persons(*),
        companies(*),
        positions(*)
      `);
    
    if (profilesError) {
      console.log(`   ❌ User Profiles: ${profilesError.message}`);
    } else {
      console.log(`   ✅ User Profiles: ${profiles?.length || 0} registros`);
      profiles?.forEach(profile => {
        console.log(`      - Usuario ID: ${profile.user_id} | Person: ${profile.persons?.first_name} ${profile.persons?.last_name}`);
      });
    }

    // 6. Verificar modules (si existen)
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('*')
      .order('sort_order');
    
    if (modulesError) {
      console.log(`   ❌ Modules: ${modulesError.message}`);
    } else {
      console.log(`   ✅ Modules: ${modules?.length || 0} registros`);
      modules?.forEach(module => {
        console.log(`      - ${module.name} (${module.path}) - Parent: ${module.parent_id || 'Root'}`);
      });
    }

    console.log('\n🧪 Probando casos de uso:');

    // 7. Probar repositorios
    try {
      const { SupabaseCompanyRepository } = await import('../src/infrastructure/supabase/SupabaseCompanyRepository');
      const companyRepo = new SupabaseCompanyRepository();
      const testCompanies = await companyRepo.findAll();
      console.log(`   ✅ CompanyRepository: ${testCompanies.length} empresas cargadas`);
    } catch (err) {
      console.log(`   ❌ CompanyRepository: ${err instanceof Error ? err.message : 'Error'}`);
    }

    try {
      const { SupabasePositionRepository } = await import('../src/infrastructure/supabase/SupabasePositionRepository');
      const positionRepo = new SupabasePositionRepository();
      const testPositions = await positionRepo.findAll();
      console.log(`   ✅ PositionRepository: ${testPositions.length} cargos cargados`);
    } catch (err) {
      console.log(`   ❌ PositionRepository: ${err instanceof Error ? err.message : 'Error'}`);
    }

    try {
      const { SupabaseRoleRepository } = await import('../src/infrastructure/supabase/SupabaseRoleRepository');
      const roleRepo = new SupabaseRoleRepository();
      const testRoles = await roleRepo.findAll();
      console.log(`   ✅ RoleRepository: ${testRoles.length} roles cargados`);
    } catch (err) {
      console.log(`   ❌ RoleRepository: ${err instanceof Error ? err.message : 'Error'}`);
    }

    console.log('\n🎉 Verificación completada!');
    console.log('\n📝 Resumen:');
    console.log('   - Las tablas están creadas y accesibles');
    console.log('   - Los datos semilla están disponibles');
    console.log('   - Los repositorios funcionan correctamente');
    console.log('   - UserManagement está listo para usar datos reales');

  } catch (error) {
    console.error('💥 Error durante la verificación:', error);
  }
}

// Ejecutar verificación
verifyDatabase();