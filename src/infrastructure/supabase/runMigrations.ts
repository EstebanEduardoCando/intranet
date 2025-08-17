import { supabase } from './supabaseClient';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Execute database migrations
 */
export async function runMigrations() {
  console.log('🚀 Starting database migrations...');
  
  try {
    // Read the migration file
    const migrationPath = join(__dirname, 'migrations', '002_create_complete_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: migrationSQL
    });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
    
    console.log('✅ Migration completed successfully!');
    console.log('📊 Database schema is now ready for User Management');
    
    return true;
  } catch (error) {
    console.error('💥 Error running migrations:', error);
    throw error;
  }
}

/**
 * Verify database schema exists
 */
export async function verifySchema() {
  console.log('🔍 Verifying database schema...');
  
  try {
    // Check if required tables exist
    const tables = ['persons', 'companies', 'positions', 'roles', 'user_profiles', 'user_roles'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table '${table}' not found or not accessible`);
        return false;
      }
      
      console.log(`✅ Table '${table}' exists and is accessible`);
    }
    
    console.log('🎉 All required tables are available!');
    return true;
  } catch (error) {
    console.error('💥 Error verifying schema:', error);
    return false;
  }
}

// Run this script directly if called from command line
if (require.main === module) {
  runMigrations()
    .then(() => verifySchema())
    .then(() => {
      console.log('🏁 Setup complete! UserManagement is ready to use.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Setup failed:', error);
      process.exit(1);
    });
}