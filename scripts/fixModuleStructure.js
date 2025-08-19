const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixModuleStructure() {
  console.log('🔧 Corrigiendo estructura de módulos...\n');

  try {
    // 1. Set User Management as a child of Administration
    console.log('1. Reorganizando jerarquía...');
    
    const { error: userMgmtError } = await supabase
      .from('modules')
      .update({ 
        parent_module_id: 2, // Administration
        route_path: '/administration/users',
        icon: 'people',
        order_index: 1
      })
      .eq('module_id', 20); // User Management

    if (userMgmtError) {
      console.log('❌ Error actualizando User Management:', userMgmtError.message);
    } else {
      console.log('✅ User Management movido a Administration');
    }

    // 2. Keep Employee Management under Human Resources but rename it
    const { error: employeeMgmtError } = await supabase
      .from('modules')
      .update({ 
        parent_module_id: 3, // Human Resources
        name: 'Employee Records',
        route_path: '/hr/employees',
        icon: 'badge',
        order_index: 1
      })
      .eq('module_id', 30); // Employee Management

    if (employeeMgmtError) {
      console.log('❌ Error actualizando Employee Management:', employeeMgmtError.message);
    } else {
      console.log('✅ Employee Management renombrado a Employee Records bajo HR');
    }

    // 3. Update Administration module route
    const { error: adminError } = await supabase
      .from('modules')
      .update({ 
        route_path: '/administration',
        icon: 'settings',
        order_index: 8
      })
      .eq('module_id', 2); // Administration

    if (adminError) {
      console.log('❌ Error actualizando Administration:', adminError.message);
    } else {
      console.log('✅ Administration route actualizada');
    }

    // 4. Update Human Resources module route  
    const { error: hrError } = await supabase
      .from('modules')
      .update({ 
        route_path: '/hr',
        icon: 'people',
        order_index: 3
      })
      .eq('module_id', 3); // Human Resources

    if (hrError) {
      console.log('❌ Error actualizando Human Resources:', hrError.message);
    } else {
      console.log('✅ Human Resources route actualizada');
    }

    // 5. Check current structure
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
      const parentInfo = module.parent_module_id ? `Parent: ${module.parent_module_id}` : 'Parent: Root';
      console.log(`   ${module.name}: ${parentInfo} - Route: ${module.route_path}`);
    });

    console.log('\n🎉 Estructura de módulos actualizada!');
    console.log('📍 Ahora User Management está en: Administration > User Management');
    console.log('📍 Employee Records está en: Human Resources > Employee Records');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixModuleStructure();