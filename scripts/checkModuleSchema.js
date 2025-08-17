const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkModuleSchema() {
  console.log('🔍 Verificando esquema real de modules...\n');

  try {
    const { data: modules, error } = await supabase
      .from('modules')
      .select('*')
      .limit(1);

    if (error) {
      throw error;
    }

    if (modules.length > 0) {
      console.log('📋 Columnas disponibles en modules:');
      console.log(Object.keys(modules[0]));
      console.log('\n📄 Primer registro:');
      console.log(modules[0]);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkModuleSchema();