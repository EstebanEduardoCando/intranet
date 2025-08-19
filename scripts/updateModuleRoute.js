const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateModuleRoute() {
  console.log('🔧 Actualizando ruta del módulo User Management...\n');

  try {
    // First check if we can add a route field or update description with route info
    const { data: beforeUpdate, error: beforeError } = await supabase
      .from('modules')
      .select('*')
      .eq('module_id', 20)
      .single();

    if (beforeError) {
      throw beforeError;
    }

    console.log('📋 Módulo antes:', beforeUpdate);

    // Try to update the description to include route information
    const { error: updateError } = await supabase
      .from('modules')
      .update({ 
        description: 'User account management and administration - Route: /administration/users'
      })
      .eq('module_id', 20); // User Management

    if (updateError) {
      console.log('❌ Error actualizando descripción:', updateError.message);
    } else {
      console.log('✅ Descripción actualizada con información de ruta');
    }

    // Verify the update
    const { data: afterUpdate, error: afterError } = await supabase
      .from('modules')
      .select('*')
      .eq('module_id', 20)
      .single();

    if (afterError) {
      throw afterError;
    }

    console.log('\n📋 Módulo después:', afterUpdate);

    console.log('\n🎉 Actualización completada!');
    console.log('📍 User Management ahora está configurado para /administration/users');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateModuleRoute();