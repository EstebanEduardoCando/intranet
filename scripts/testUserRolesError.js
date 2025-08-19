/**
 * Test script to capture PGRST204 error when managing user roles
 * This error indicates that Supabase can't find the 'assigned_at' column in the schema cache
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUserRolesAssignment() {
  console.log('🧪 Testing User Roles Assignment - PGRST204 Error Detection\n');

  try {
    // First check if user_roles table exists and its structure
    console.log('1. 📋 Checking user_roles table structure...');
    
    const { data: tableInfo, error: tableError } = await supabase
      .from('user_roles')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Error accessing user_roles table:', tableError);
      
      // Check if this is the specific PGRST204 error
      if (tableError.code === 'PGRST204') {
        console.error('🎯 CAPTURED PGRST204 ERROR!');
        console.error('Details:', {
          code: tableError.code,
          message: tableError.message,
          details: tableError.details,
          hint: tableError.hint
        });
        
        // Check if the error mentions 'assigned_at' column
        if (tableError.message.includes('assigned_at')) {
          console.error('🔍 The error is specifically about the "assigned_at" column');
          
          // Suggest solutions
          console.log('\n💡 Suggested Solutions:');
          console.log('1. Refresh Supabase schema cache');
          console.log('2. Check if the user_roles table was created correctly');
          console.log('3. Verify the assigned_at column exists in the database');
          console.log('4. Run the migration script again if necessary');
        }
        
        return false;
      }
    }

    console.log('✅ user_roles table accessible');
    
    // Test 2: Try to get current users for testing
    console.log('\n2. 👥 Getting test users...');
    
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('user_id')
      .limit(1);

    if (usersError) {
      console.error('❌ Error getting users:', usersError);
      return false;
    }

    if (!users || users.length === 0) {
      console.log('⚠️  No users found for testing');
      return true;
    }

    const testUserId = users[0].user_id;
    console.log(`✅ Found test user: ${testUserId}`);

    // Test 3: Try to get available roles
    console.log('\n3. 🎭 Getting available roles...');
    
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('role_id, name')
      .eq('is_active', true)
      .limit(1);

    if (rolesError) {
      console.error('❌ Error getting roles:', rolesError);
      return false;
    }

    if (!roles || roles.length === 0) {
      console.log('⚠️  No roles found for testing');
      return true;
    }

    const testRoleId = roles[0].role_id;
    console.log(`✅ Found test role: ${roles[0].name} (ID: ${testRoleId})`);

    // Test 4: Try to assign role (this is where the error might occur)
    console.log('\n4. 🔧 Testing role assignment (potential error point)...');
    
    try {
      const { data: assignResult, error: assignError } = await supabase
        .from('user_roles')
        .insert({
          user_id: testUserId,
          role_id: testRoleId,
          assigned_at: new Date().toISOString(),
          assigned_by: null
        })
        .select();

      if (assignError) {
        console.error('❌ Error during role assignment:', assignError);
        
        // Check for PGRST204 error specifically
        if (assignError.code === 'PGRST204') {
          console.error('🎯 CAPTURED PGRST204 ERROR DURING ROLE ASSIGNMENT!');
          console.error('Error Details:', {
            code: assignError.code,
            message: assignError.message,
            details: assignError.details,
            hint: assignError.hint
          });
          
          if (assignError.message.includes('assigned_at')) {
            console.error('🔍 The error is about the "assigned_at" column during INSERT');
            
            console.log('\n🔧 Debugging Steps:');
            console.log('1. Check if assigned_at column exists in user_roles table');
            console.log('2. Verify column type (should be TIMESTAMP WITH TIME ZONE)');
            console.log('3. Check if RLS policies are blocking the operation');
            console.log('4. Try inserting without assigned_at (let it use DEFAULT)');
          }
          
          return false;
        }
        
        return false;
      }

      console.log('✅ Role assignment successful:', assignResult);
      
      // Clean up: remove the test assignment
      console.log('\n5. 🧹 Cleaning up test assignment...');
      const { error: cleanupError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', testUserId)
        .eq('role_id', testRoleId);

      if (cleanupError) {
        console.warn('⚠️  Could not clean up test assignment:', cleanupError.message);
      } else {
        console.log('✅ Test assignment cleaned up');
      }

    } catch (insertError) {
      console.error('❌ Exception during role assignment:', insertError);
      return false;
    }

    // Test 5: Try alternative assignment without explicit assigned_at
    console.log('\n6. 🔧 Testing role assignment without explicit assigned_at...');
    
    try {
      const { data: assignResult2, error: assignError2 } = await supabase
        .from('user_roles')
        .insert({
          user_id: testUserId,
          role_id: testRoleId
          // Let assigned_at use its DEFAULT value
        })
        .select();

      if (assignError2) {
        console.error('❌ Error during alternative assignment:', assignError2);
        return false;
      }

      console.log('✅ Alternative assignment successful:', assignResult2);
      
      // Clean up
      const { error: cleanupError2 } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', testUserId)
        .eq('role_id', testRoleId);

      if (cleanupError2) {
        console.warn('⚠️  Could not clean up alternative assignment:', cleanupError2.message);
      } else {
        console.log('✅ Alternative assignment cleaned up');
      }

    } catch (insertError2) {
      console.error('❌ Exception during alternative assignment:', insertError2);
      return false;
    }

    console.log('\n🎉 All user roles tests completed successfully!');
    console.log('ℹ️  The PGRST204 error was not reproduced in this test.');
    console.log('ℹ️  This could mean:');
    console.log('   - The issue has been resolved');
    console.log('   - The error occurs under different conditions');
    console.log('   - The error is intermittent or related to schema cache');

    return true;

  } catch (error) {
    console.error('❌ Unexpected error during testing:', error);
    return false;
  }
}

// Additional function to check database schema directly
async function checkUserRolesSchema() {
  console.log('\n🔍 Additional Schema Check...\n');
  
  try {
    // Try to describe the table structure using a PostgreSQL system query
    const { data, error } = await supabase
      .rpc('get_table_columns', { table_name: 'user_roles' })
      .select();

    if (error) {
      console.log('ℹ️  Could not get schema info via RPC (this is normal)');
      
      // Alternative: try to select with explicit column names
      console.log('🔄 Trying explicit column selection...');
      
      const { data: columnTest, error: columnError } = await supabase
        .from('user_roles')
        .select('user_id, role_id, assigned_at, assigned_by')
        .limit(1);

      if (columnError) {
        console.error('❌ Error with explicit columns:', columnError);
        
        if (columnError.code === 'PGRST204' && columnError.message.includes('assigned_at')) {
          console.error('🎯 CAPTURED THE PGRST204 ERROR WITH EXPLICIT COLUMN SELECT!');
          return false;
        }
      } else {
        console.log('✅ Explicit column selection works fine');
      }
    } else {
      console.log('✅ Schema info retrieved:', data);
    }

  } catch (error) {
    console.error('❌ Error during schema check:', error);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting User Roles Error Detection Test\n');
  
  const testResult = await testUserRolesAssignment();
  await checkUserRolesSchema();
  
  console.log('\n📊 Test Summary:');
  console.log(`Status: ${testResult ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (!testResult) {
    console.log('\n🛠️  If you encountered the PGRST204 error:');
    console.log('1. Check Supabase dashboard for table structure');
    console.log('2. Refresh the schema cache in Supabase');
    console.log('3. Verify the migration was applied correctly');
    console.log('4. Consider re-running the migration script');
  }
  
  process.exit(testResult ? 0 : 1);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});