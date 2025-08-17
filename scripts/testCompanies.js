const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testCompanies() {
  console.log('🏢 Investigando estructura real de companies...\n');

  try {
    // Test: Get companies structure
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .limit(3);

    if (companiesError) {
      console.log('❌ Error en companies:', companiesError.message);
    } else {
      console.log('✅ Estructura companies:', Object.keys(companies[0] || {}));
      console.log('📄 Sample companies:', companies);
    }

    // Test: Get roles structure  
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('*')
      .limit(3);

    if (rolesError) {
      console.log('❌ Error en roles:', rolesError.message);
    } else {
      console.log('✅ Estructura roles:', Object.keys(roles[0] || {}));
      console.log('📄 Sample roles:', roles);
    }

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

testCompanies();