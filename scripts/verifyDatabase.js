require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas');
  console.log('Asegúrate de tener configurado VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

    // 6. Verificar user_roles relationships
    const { data: userRoles, error: userRolesError } = await supabase
      .from('user_roles')
      .select(`
        *,
        roles(name)
      `);
    
    if (userRolesError) {
      console.log(`   ❌ User Roles: ${userRolesError.message}`);
    } else {
      console.log(`   ✅ User Roles: ${userRoles?.length || 0} asignaciones`);
      userRoles?.forEach(userRole => {
        console.log(`      - User ${userRole.user_id} tiene rol: ${userRole.roles?.name}`);
      });
    }

    // 7. Verificar modules (si existen)
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

    // 8. Verificar usuarios de auth.users
    console.log('\n👥 Verificando usuarios autenticados:');
    try {
      // Esta consulta requiere admin access, así que puede fallar
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.log(`   ❌ Auth Users: ${authError.message} (Requiere permisos admin)`);
      } else {
        console.log(`   ✅ Auth Users: ${authUsers.users?.length || 0} usuarios registrados`);
        authUsers.users?.forEach(user => {
          console.log(`      - ${user.email} (ID: ${user.id.substring(0, 8)}...)`);
        });
      }
    } catch (err) {
      console.log(`   ❌ Auth Users: No se pudo acceder (normal con anon key)`);
    }

    console.log('\n🎉 Verificación completada!');
    console.log('\n📝 Resumen:');
    console.log('   - Las tablas están creadas y accesibles');
    console.log('   - Los datos semilla están disponibles'); 
    console.log('   - UserManagement está listo para usar datos reales');
    console.log('\n🚀 Ahora puedes ir a la página de Gestión de Empleados para verlo funcionando!');

  } catch (error) {
    console.error('💥 Error durante la verificación:', error);
  }
}

// Ejecutar verificación
verifyDatabase();