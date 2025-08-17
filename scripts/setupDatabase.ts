/**
 * Database Setup Script
 * 
 * Este script debe ejecutarse manualmente en el panel de Supabase
 * porque requiere permisos administrativos para crear tablas y policies.
 * 
 * INSTRUCCIONES:
 * 1. Ve a tu proyecto de Supabase
 * 2. Abre el SQL Editor
 * 3. Copia y pega el contenido de migrations/002_create_complete_schema.sql
 * 4. Ejecuta el script
 * 5. Verifica que todas las tablas se crearon correctamente
 * 
 * Luego podrás usar el UserManagement con datos reales.
 */

import { supabase } from '../src/infrastructure/supabase/supabaseClient';

export async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.message.includes('relation "user_profiles" does not exist')) {
        console.log('❌ Tables not created yet. Please run the migration SQL in Supabase dashboard.');
        console.log('📂 Migration file: src/infrastructure/supabase/migrations/002_create_complete_schema.sql');
        return false;
      }
      throw error;
    }
    
    console.log('✅ Database connection successful and tables exist!');
    return true;
  } catch (error) {
    console.error('💥 Connection test failed:', error);
    return false;
  }
}

export async function seedTestData() {
  console.log('🌱 Creating test user data...');
  
  try {
    // Create test person
    const { data: person, error: personError } = await supabase
      .from('persons')
      .insert({
        first_name: 'Juan',
        last_name: 'Pérez',
        identity_type: 'DNI',
        identity_number: '12345678',
        phone: '+51987654321'
      })
      .select()
      .single();
    
    if (personError) {
      console.log('ℹ️ Test person might already exist:', personError.message);
    } else {
      console.log('✅ Test person created:', person);
    }
    
    return true;
  } catch (error) {
    console.error('💥 Error seeding test data:', error);
    return false;
  }
}

// Manual testing functions
if (require.main === module) {
  console.log('🚀 Starting database setup verification...');
  console.log('');
  console.log('⚠️  IMPORTANT: Before running this, make sure you have:');
  console.log('   1. Executed the SQL migration in Supabase dashboard');
  console.log('   2. File: src/infrastructure/supabase/migrations/002_create_complete_schema.sql');
  console.log('');
  
  testConnection()
    .then((success) => {
      if (success) {
        return seedTestData();
      }
      return false;
    })
    .then((success) => {
      if (success) {
        console.log('🎉 Database setup is complete!');
        console.log('✨ UserManagement is now ready to use with real data.');
      } else {
        console.log('🔧 Please complete the database setup first.');
      }
    })
    .catch((error) => {
      console.error('💥 Setup verification failed:', error);
    });
}