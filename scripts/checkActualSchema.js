require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkActualSchema() {
  console.log('🔍 Verificando estructura REAL de las tablas...\n');

  // Check companies structure
  const { data: companies, error: compError } = await supabase
    .from('companies')
    .select('*')
    .limit(1);

  console.log('🏢 Tabla COMPANIES:');
  if (compError) {
    console.log('❌ Error:', compError.message);
  } else {
    if (companies.length > 0) {
      console.log('✅ Columnas encontradas:', Object.keys(companies[0]));
      console.log('✅ Primer registro:', companies[0]);
    } else {
      console.log('⚠️ Tabla vacía');
    }
  }

  // Check positions structure  
  const { data: positions, error: posError } = await supabase
    .from('positions')
    .select('*')
    .limit(1);

  console.log('\n💼 Tabla POSITIONS:');
  if (posError) {
    console.log('❌ Error:', posError.message);
  } else {
    if (positions.length > 0) {
      console.log('✅ Columnas encontradas:', Object.keys(positions[0]));
      console.log('✅ Primer registro:', positions[0]);
    } else {
      console.log('⚠️ Tabla vacía');
    }
  }

  // Check roles structure
  const { data: roles, error: roleError } = await supabase
    .from('roles')
    .select('*')
    .limit(1);

  console.log('\n🔐 Tabla ROLES:');
  if (roleError) {
    console.log('❌ Error:', roleError.message);
  } else {
    if (roles.length > 0) {
      console.log('✅ Columnas encontradas:', Object.keys(roles[0]));
      console.log('✅ Primer registro:', roles[0]);
    } else {
      console.log('⚠️ Tabla vacía');
    }
  }

  // Check user_profiles structure
  const { data: profiles, error: profError } = await supabase
    .from('user_profiles')
    .select('*')
    .limit(1);

  console.log('\n👤 Tabla USER_PROFILES:');
  if (profError) {
    console.log('❌ Error:', profError.message);
  } else {
    if (profiles.length > 0) {
      console.log('✅ Columnas encontradas:', Object.keys(profiles[0]));
      console.log('✅ Primer registro:', profiles[0]);
    } else {
      console.log('⚠️ Tabla vacía pero existe');
      console.log('📋 Para obtener estructura, intentaré insertar un registro de prueba...');
    }
  }

  // Check persons structure
  const { data: persons, error: persError } = await supabase
    .from('persons')
    .select('*')
    .limit(1);

  console.log('\n👥 Tabla PERSONS:');
  if (persError) {
    console.log('❌ Error:', persError.message);
  } else {
    if (persons.length > 0) {
      console.log('✅ Columnas encontradas:', Object.keys(persons[0]));
      console.log('✅ Primer registro:', persons[0]);
    } else {
      console.log('⚠️ Tabla vacía');
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE ESTRUCTURA ACTUAL:');
  console.log('='.repeat(60));
}

checkActualSchema();