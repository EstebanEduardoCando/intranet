require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCompanies() {
  console.log('🏢 Verificando empresas detalladamente...\n');

  // Consulta directa a companies
  const { data: companies, error } = await supabase
    .from('companies')
    .select('*')
    .order('company_id');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('📋 Empresas encontradas:');
  companies.forEach(company => {
    console.log(`   ID: ${company.company_id}`);
    console.log(`   Nombre: "${company.name}"`);
    console.log(`   Descripción: "${company.description}"`);
    console.log(`   Activa: ${company.is_active}`);
    console.log(`   Creada: ${company.created_at}`);
    console.log('   ---');
  });

  // También probar user_profiles con companies
  console.log('\n👥 Probando user_profiles con empresas...');
  const { data: profiles, error: profileError } = await supabase
    .from('user_profiles')
    .select(`
      profile_id,
      user_id,
      company_id,
      position_id,
      is_active
    `)
    .limit(5);

  if (profileError) {
    console.error('❌ Error en user_profiles:', profileError);
  } else {
    console.log(`✅ user_profiles: ${profiles.length} registros`);
    profiles.forEach(profile => {
      console.log(`   - Profile ID: ${profile.profile_id}, Company ID: ${profile.company_id}, Position ID: ${profile.position_id}`);
    });
  }
}

checkCompanies();