const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixModulesByIds() {
  console.log('🔧 Reorganizando módulos por IDs...\n');

  try {
    // 1. Move User Management (ID 20) under Administration (ID 2)
    const { error: userMgmtError } = await supabase
      .from('modules')
      .update({ 
        parent_id: 2, // Administration
        sort_order: 10
      })
      .eq('module_id', 20); // User Management

    if (userMgmtError) {
      console.log('❌ Error moviendo User Management:', userMgmtError.message);
    } else {
      console.log('✅ User Management movido bajo Administration');
    }

    // 2. Move Employee Management (ID 30) under Human Resources (ID 3)
    const { error: employeeMgmtError } = await supabase
      .from('modules')
      .update({ 
        parent_id: 3, // Human Resources
        sort_order: 10
      })
      .eq('module_id', 30); // Employee Management

    if (employeeMgmtError) {
      console.log('❌ Error moviendo Employee Management:', employeeMgmtError.message);
    } else {
      console.log('✅ Employee Management movido bajo Human Resources');
    }

    // 3. Check final structure
    console.log('\n📋 Verificando nueva estructura...');
    const { data: modules, error: fetchError } = await supabase
      .from('modules')
      .select('*')
      .in('module_id', [2, 3, 20, 30])
      .order('module_id');

    if (fetchError) {
      throw fetchError;
    }

    modules.forEach(module => {
      const parentInfo = module.parent_id ? `Parent: ${module.parent_id}` : 'Parent: Root';
      console.log(`   ${module.name}: ${parentInfo} - ID: ${module.module_id}`);
    });

    console.log('\n🎉 Reorganización completada!');
    console.log('📍 User Management ahora está bajo Administration');
    console.log('📍 Employee Management ahora está bajo Human Resources');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixModulesByIds();