require('dotenv').config();

async function testRepositories() {
  console.log('🧪 Probando repositorios corregidos...\n');

  try {
    // Test CompanyRepository
    console.log('🏢 Probando CompanyRepository...');
    const { SupabaseCompanyRepository } = await import('../src/infrastructure/supabase/SupabaseCompanyRepository.js');
    const companyRepo = new SupabaseCompanyRepository();
    
    const companies = await companyRepo.findAll();
    console.log(`✅ CompanyRepository: ${companies.length} empresas encontradas`);
    companies.forEach(company => {
      console.log(`   - ${company.name} (ID: ${company.companyId})`);
    });

    // Test PositionRepository  
    console.log('\n💼 Probando PositionRepository...');
    const { SupabasePositionRepository } = await import('../src/infrastructure/supabase/SupabasePositionRepository.js');
    const positionRepo = new SupabasePositionRepository();
    
    const positions = await positionRepo.findAll();
    console.log(`✅ PositionRepository: ${positions.length} cargos encontrados`);
    positions.slice(0, 5).forEach(position => {
      console.log(`   - ${position.name} (ID: ${position.positionId})`);
    });

    // Test RoleRepository
    console.log('\n🔐 Probando RoleRepository...');
    const { SupabaseRoleRepository } = await import('../src/infrastructure/supabase/SupabaseRoleRepository.js');
    const roleRepo = new SupabaseRoleRepository();
    
    const roles = await roleRepo.findAll();
    console.log(`✅ RoleRepository: ${roles.length} roles encontrados`);
    roles.slice(0, 5).forEach(role => {
      console.log(`   - ${role.name} (ID: ${role.roleId})`);
    });

    // Test UserRepository
    console.log('\n👤 Probando UserRepository...');
    const { SupabaseUserRepository } = await import('../src/infrastructure/supabase/SupabaseUserRepository.js');
    const userRepo = new SupabaseUserRepository();
    
    const users = await userRepo.findAll(0, 5);
    console.log(`✅ UserRepository: ${users.length} usuarios encontrados`);
    users.forEach(user => {
      console.log(`   - ${user.person.firstName} ${user.person.lastName} (${user.email})`);
      console.log(`     Roles: ${user.roles.map(r => r.name).join(', ') || 'Sin roles'}`);
    });

    // Test GetUsers use case
    console.log('\n🎯 Probando GetUsers caso de uso...');
    const { GetUsers } = await import('../src/application/user/GetUsers.js');
    const getUsers = new GetUsers(userRepo);
    
    const usersResponse = await getUsers.execute({ page: 0, limit: 3 });
    console.log(`✅ GetUsers: ${usersResponse.users.length} usuarios de ${usersResponse.total} total`);

    console.log('\n🎉 ¡Todos los repositorios funcionan correctamente!');
    console.log('✨ UserManagement está listo para usar con datos reales.');

  } catch (error) {
    console.error('❌ Error probando repositorios:', error.message);
    console.error('\n🔧 Posible causa: Estructura de BD no coincide o permisos insuficientes');
  }
}

testRepositories();