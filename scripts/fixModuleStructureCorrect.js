const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixModuleStructure() {
  console.log('🔧 Corrigiendo estructura de módulos con esquema correcto...\n');

  try {
    // First, let's see current User Management and Employee Management
    const { data: currentModules, error: fetchError } = await supabase
      .from('modules')
      .select('*')
      .in('code', ['USER_MANAGEMENT', 'EMPLOYEE_MANAGEMENT', 'ADMINISTRATION', 'HR']);

    if (fetchError) {
      console.log('❌ Error obteniendo módulos:', fetchError.message);
      return;
    }

    console.log('📋 Módulos actuales relevantes:');
    currentModules.forEach(module => {
      console.log(`   ${module.code}: ${module.name} (ID: ${module.module_id}, Parent: ${module.parent_id})`);
    });

    // Find the IDs we need
    const administration = currentModules.find(m => m.code === 'ADMINISTRATION');
    const hr = currentModules.find(m => m.code === 'HR');
    const userMgmt = currentModules.find(m => m.code === 'USER_MANAGEMENT');
    const employeeMgmt = currentModules.find(m => m.code === 'EMPLOYEE_MANAGEMENT');

    if (!administration) {
      console.log('❌ No se encontró módulo Administration');
      return;
    }

    // 1. Move User Management under Administration
    if (userMgmt) {
      const { error: userMgmtError } = await supabase
        .from('modules')
        .update({ 
          parent_id: administration.module_id,
          sort_order: 10
        })
        .eq('module_id', userMgmt.module_id);

      if (userMgmtError) {
        console.log('❌ Error moviendo User Management:', userMgmtError.message);
      } else {
        console.log('✅ User Management movido bajo Administration');
      }
    }

    // 2. If HR exists, move Employee Management under it
    if (hr && employeeMgmt) {
      const { error: employeeMgmtError } = await supabase
        .from('modules')
        .update({ 
          parent_id: hr.module_id,
          sort_order: 10
        })
        .eq('module_id', employeeMgmt.module_id);

      if (employeeMgmtError) {
        console.log('❌ Error moviendo Employee Management:', employeeMgmtError.message);
      } else {
        console.log('✅ Employee Management movido bajo HR');
      }
    }

    // 3. Check final structure
    console.log('\n📋 Verificando nueva estructura...');
    const { data: finalModules, error: finalError } = await supabase
      .from('modules')
      .select('*')
      .in('module_id', [
        administration.module_id,
        hr?.module_id,
        userMgmt?.module_id,
        employeeMgmt?.module_id
      ].filter(Boolean))
      .order('module_id');

    if (finalError) {
      throw finalError;
    }

    finalModules.forEach(module => {
      const parentInfo = module.parent_id ? `Parent: ${module.parent_id}` : 'Parent: Root';
      console.log(`   ${module.name}: ${parentInfo} - Code: ${module.code}`);
    });

    console.log('\n🎉 Reorganización completada!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixModuleStructure();