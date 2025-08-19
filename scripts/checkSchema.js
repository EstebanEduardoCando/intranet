require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('🔍 Verificando estructura de tablas...\n');

  // Check user_profiles structure
  const { data: userProfiles, error: upError } = await supabase
    .from('user_profiles')
    .select('*')
    .limit(1);

  if (upError) {
    console.log('❌ user_profiles error:', upError.message);
  } else {
    console.log('✅ user_profiles estructura:');
    if (userProfiles.length > 0) {
      console.log('   Columnas encontradas:', Object.keys(userProfiles[0]));
    } else {
      console.log('   Tabla vacía, verificando con insert test...');
    }
  }

  // Fix companies data
  console.log('\n🔧 Corrigiendo datos de empresas...');
  
  // Update companies with correct names
  const companyUpdates = [
    { id: 1, name: 'Matriz', description: 'Oficina principal de la empresa' },
    { id: 2, name: 'Sucursal Norte', description: 'Sucursal ubicada en el norte' },
    { id: 3, name: 'Sucursal Sur', description: 'Sucursal ubicada en el sur' }
  ];

  for (const company of companyUpdates) {
    const { error } = await supabase
      .from('companies')
      .update({ 
        name: company.name, 
        description: company.description 
      })
      .eq('company_id', company.id);

    if (error) {
      console.log(`❌ Error actualizando empresa ${company.id}:`, error.message);
    } else {
      console.log(`✅ Empresa ${company.id} actualizada: ${company.name}`);
    }
  }

  // Check if company_id column needs to be added to user_profiles
  console.log('\n🔧 Verificando si necesitamos agregar columnas a user_profiles...');
  
  const { data: profiles, error: profileError } = await supabase
    .from('user_profiles')
    .select('company_id, position_id')
    .limit(1);

  if (profileError && profileError.message.includes('does not exist')) {
    console.log('❌ Columnas company_id/position_id faltan en user_profiles');
    console.log('🔧 Necesitas ejecutar esta SQL en Supabase:');
    console.log('');
    console.log('   ALTER TABLE public.user_profiles ADD COLUMN company_id INTEGER REFERENCES public.companies(company_id) ON DELETE SET NULL;');
    console.log('   ALTER TABLE public.user_profiles ADD COLUMN position_id INTEGER REFERENCES public.positions(position_id) ON DELETE SET NULL;');
    console.log('');
  } else {
    console.log('✅ Columnas company_id/position_id existen en user_profiles');
  }

  // Final verification
  console.log('\n📊 Verificación final de empresas:');
  const { data: finalCompanies, error: finalError } = await supabase
    .from('companies')
    .select('*')
    .order('company_id');

  if (finalError) {
    console.error('❌ Error:', finalError);
  } else {
    finalCompanies.forEach(company => {
      console.log(`   ✅ ${company.name} (ID: ${company.company_id})`);
    });
  }
}

checkSchema();