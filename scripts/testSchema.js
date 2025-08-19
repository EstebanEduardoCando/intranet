const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSchema() {
  console.log('🔍 Investigando estructura real de user_profiles...\n');

  try {
    // Test 1: Get a sample user_profile to see available columns
    console.log('📋 Test 1: Obtener estructura de user_profiles');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.log('❌ Error en user_profiles:', profilesError.message);
    } else {
      console.log('✅ Estructura user_profiles:', Object.keys(profiles[0] || {}));
      console.log('📄 Sample data:', profiles[0]);
    }

    console.log('\n📋 Test 2: Probar consulta con company_id');
    const { data: testCompany, error: companyError } = await supabase
      .from('user_profiles')
      .select('company_id')
      .limit(1);

    if (companyError) {
      console.log('❌ company_id NO existe:', companyError.message);
    } else {
      console.log('✅ company_id SÍ existe');
    }

    console.log('\n📋 Test 3: Probar consulta con position_id');
    const { data: testPosition, error: positionError } = await supabase
      .from('user_profiles')
      .select('position_id')
      .limit(1);

    if (positionError) {
      console.log('❌ position_id NO existe:', positionError.message);
    } else {
      console.log('✅ position_id SÍ existe');
    }

    console.log('\n📋 Test 4: Ver tablas relacionadas disponibles');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('company_id, name')
      .limit(3);

    if (companiesError) {
      console.log('❌ Tabla companies no accesible:', companiesError.message);
    } else {
      console.log('✅ Tabla companies:', companies);
    }

    const { data: positions, error: positionsError } = await supabase
      .from('positions')
      .select('position_id, name')
      .limit(3);

    if (positionsError) {
      console.log('❌ Tabla positions no accesible:', positionsError.message);
    } else {
      console.log('✅ Tabla positions:', positions);
    }

    console.log('\n📋 Test 5: Ver si existe tabla de asignaciones user_companies');
    const { data: userCompanies, error: userCompaniesError } = await supabase
      .from('user_companies')
      .select('*')
      .limit(1);

    if (userCompaniesError) {
      console.log('❌ Tabla user_companies no existe:', userCompaniesError.message);
    } else {
      console.log('✅ Tabla user_companies existe:', Object.keys(userCompanies[0] || {}));
    }

    const { data: userPositions, error: userPositionsError } = await supabase
      .from('user_positions')
      .select('*')
      .limit(1);

    if (userPositionsError) {
      console.log('❌ Tabla user_positions no existe:', userPositionsError.message);
    } else {
      console.log('✅ Tabla user_positions existe:', Object.keys(userPositions[0] || {}));
    }

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

testSchema();