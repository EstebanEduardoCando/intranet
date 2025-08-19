const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkModules() {
  console.log('🔍 Analizando estructura de módulos...\n');

  try {
    const { data: modules, error } = await supabase
      .from('modules')
      .select('*')
      .order('module_id');

    if (error) {
      throw error;
    }

    console.log('📋 Módulos encontrados:');
    modules.forEach(module => {
      const parentInfo = module.parent_module_id ? `Parent: ${module.parent_module_id}` : 'Parent: Root';
      console.log(`   ${module.module_id}: ${module.name} - ${parentInfo} - Path: ${module.route_path}`);
    });

    // Find UserManagement and Employee Management
    const userMgmt = modules.find(m => m.name === 'User Management');
    const employeeMgmt = modules.find(m => m.name === 'Employee Management');
    const humanResources = modules.find(m => m.name === 'Human Resources');
    const administration = modules.find(m => m.name === 'Administration');

    console.log('\n🎯 Módulos relevantes:');
    if (userMgmt) {
      console.log(`   User Management: ID ${userMgmt.module_id}, Parent: ${userMgmt.parent_module_id}, Path: ${userMgmt.route_path}`);
    }
    if (employeeMgmt) {
      console.log(`   Employee Management: ID ${employeeMgmt.module_id}, Parent: ${employeeMgmt.parent_module_id}, Path: ${employeeMgmt.route_path}`);
    }
    if (humanResources) {
      console.log(`   Human Resources: ID ${humanResources.module_id}, Parent: ${humanResources.parent_module_id}, Path: ${humanResources.route_path}`);
    }
    if (administration) {
      console.log(`   Administration: ID ${administration.module_id}, Parent: ${administration.parent_module_id}, Path: ${administration.route_path}`);
    }

    // Check current route for user management page
    console.log('\n🔍 Buscando módulo con ruta /management/users...');
    const userMgmtPage = modules.find(m => m.route_path === '/management/users');
    if (userMgmtPage) {
      console.log(`   ✅ Encontrado: ${userMgmtPage.name} (ID: ${userMgmtPage.module_id}, Parent: ${userMgmtPage.parent_module_id})`);
    } else {
      console.log('   ❌ No encontrado módulo con ruta /management/users');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkModules();