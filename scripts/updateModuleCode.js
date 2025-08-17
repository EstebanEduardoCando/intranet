const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateModuleCode() {
  console.log('🔧 Actualizando código del módulo User Management...\n');

  try {
    // Update User Management module code to generate correct path
    const { error: updateError } = await supabase
      .from('modules')
      .update({ 
        code: 'ADMINISTRATION.USERS' // This will generate /administration/users
      })
      .eq('module_id', 20); // User Management

    if (updateError) {
      console.log('❌ Error actualizando código:', updateError.message);
    } else {
      console.log('✅ Código actualizado a ADMINISTRATION.USERS');
    }

    // Also update Administration module code for consistency
    const { error: adminUpdateError } = await supabase
      .from('modules')
      .update({ 
        code: 'ADMINISTRATION'
      })
      .eq('module_id', 2); // Administration

    if (adminUpdateError) {
      console.log('❌ Error actualizando Administration code:', adminUpdateError.message);
    } else {
      console.log('✅ Administration code actualizado');
    }

    // Verify the update
    const { data: modules, error: fetchError } = await supabase
      .from('modules')
      .select('*')
      .in('module_id', [2, 20])
      .order('module_id');

    if (fetchError) {
      throw fetchError;
    }

    console.log('\n📋 Módulos actualizados:');
    modules.forEach(module => {
      const expectedPath = '/' + module.code.toLowerCase().replace(/\./g, '/');
      console.log(`   ${module.name}: Code: ${module.code} → Path: ${expectedPath}`);
    });

    console.log('\n🎉 Códigos actualizados!');
    console.log('📍 User Management ahora generará la ruta /administration/users');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateModuleCode();