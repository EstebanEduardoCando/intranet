const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Mock the supabase client module path that the repository will import
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

async function testGetUsers() {
  console.log('🎯 Probando GetUsers caso de uso...\n');

  try {
    // Simulate what GetUsers would do
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('📋 Simulando GetUsers.execute()...');
    
    // Simulate the findAll method from UserRepository
    const offset = 0;
    const limit = 10;

    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        profile_id,
        user_id,
        person_id,
        username,
        is_active,
        last_login_at,
        preferences,
        created_at,
        updated_at,
        persons!inner (
          person_id,
          first_name,
          middle_name,
          last_name,
          second_last_name,
          identity_type,
          identity_number,
          email,
          phone,
          birth_date,
          created_at,
          updated_at
        )
      `)
      .eq('is_active', true)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to find users: ${error.message}`);
    }

    console.log(`✅ Usuarios encontrados: ${data.length}`);

    // Simulate count for pagination
    const { count, error: countError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (countError) {
      throw new Error(`Failed to count users: ${countError.message}`);
    }

    // Simulate the response structure of GetUsers
    const response = {
      users: data.map(profile => ({
        id: profile.user_id,
        email: profile.persons.email || `user${profile.user_id.substring(0, 8)}@example.com`,
        emailVerified: false, // Not available without admin access
        profile: {
          profileId: profile.profile_id,
          userId: profile.user_id,
          personId: profile.person_id,
          username: profile.username || undefined,
          isActive: profile.is_active,
          lastLoginAt: profile.last_login_at ? new Date(profile.last_login_at) : undefined,
          preferences: profile.preferences || {},
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at)
        },
        person: {
          personId: profile.persons.person_id,
          firstName: profile.persons.first_name,
          middleName: profile.persons.middle_name || undefined,
          lastName: profile.persons.last_name,
          secondLastName: profile.persons.second_last_name || undefined,
          identityType: profile.persons.identity_type,
          identityNumber: profile.persons.identity_number,
          phone: profile.persons.phone || undefined,
          birthDate: profile.persons.birth_date ? new Date(profile.persons.birth_date) : undefined,
          createdAt: new Date(profile.persons.created_at),
          updatedAt: new Date(profile.persons.updated_at)
        },
        roles: [] // Roles would be fetched separately
      })),
      total: count || 0,
      page: 0,
      limit: limit,
      totalPages: Math.ceil((count || 0) / limit)
    };

    console.log('\n📊 Resultado simulado de GetUsers:');
    console.log(`   Total usuarios: ${response.total}`);
    console.log(`   Página actual: ${response.page + 1}/${response.totalPages}`);
    console.log(`   Usuarios en página: ${response.users.length}`);

    if (response.users.length > 0) {
      const user = response.users[0];
      console.log('\n👤 Usuario de muestra:');
      console.log(`   Nombre: ${user.person.firstName} ${user.person.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Username: ${user.profile.username || 'N/A'}`);
      console.log(`   Estado: ${user.profile.isActive ? 'Activo' : 'Inactivo'}`);
      console.log(`   Último login: ${user.profile.lastLoginAt ? user.profile.lastLoginAt.toLocaleDateString() : 'Nunca'}`);
    }

    console.log('\n🎉 ¡GetUsers funcionaría correctamente!');
    console.log('✨ UserManagement puede mostrar datos reales de la BD.');

  } catch (error) {
    console.error('❌ Error simulando GetUsers:', error.message);
    console.error('\n🔧 Verificar que las tablas existan y tengan permisos RLS correctos');
  }
}

testGetUsers();