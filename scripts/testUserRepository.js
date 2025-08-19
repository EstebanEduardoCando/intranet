const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserRepository() {
  console.log('🧪 Probando UserRepository sin admin permissions...\n');

  try {
    // Test simple query to user_profiles with persons
    console.log('📋 Probando consulta básica user_profiles + persons...');
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
      .limit(5);

    if (error) {
      throw new Error(`Query failed: ${error.message}`);
    }

    console.log(`✅ Encontrados ${data.length} perfiles de usuario`);
    
    // Show sample data
    if (data.length > 0) {
      const sample = data[0];
      console.log('\n📄 Muestra de datos:');
      console.log(`   User ID: ${sample.user_id}`);
      console.log(`   Email: ${sample.persons.email || 'No email'}`);
      console.log(`   Nombre: ${sample.persons.first_name} ${sample.persons.last_name}`);
      console.log(`   Username: ${sample.username || 'No username'}`);
      console.log(`   Estado: ${sample.is_active ? 'Activo' : 'Inactivo'}`);
    }

    // Test roles query
    console.log('\n🔐 Probando consulta de roles...');
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        role_id,
        roles!inner (
          role_id,
          name,
          description,
          is_active,
          created_at,
          updated_at
        )
      `)
      .limit(5);

    if (rolesError) {
      console.log(`⚠️  Error en roles (puede ser normal): ${rolesError.message}`);
    } else {
      console.log(`✅ Roles query OK: ${rolesData.length} asignaciones encontradas`);
    }

    // Test count query
    console.log('\n📊 Probando conteo de usuarios...');
    const { count, error: countError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (countError) {
      throw new Error(`Count failed: ${countError.message}`);
    }

    console.log(`✅ Total usuarios activos: ${count}`);

    console.log('\n🎉 ¡UserRepository puede funcionar sin admin permissions!');
    console.log('✨ Gestión de Usuarios está lista para usar datos reales.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n🔧 Revisar permisos RLS y estructura de BD');
  }
}

testUserRepository();