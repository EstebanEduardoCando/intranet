const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function seedData() {
  console.log('🌱 Seeding companies and positions...');

  try {
    // Create default company
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('company_id')
      .eq('legal_name', 'General')
      .single();

    if (!existingCompany) {
      const { error: companyError } = await supabase
        .from('companies')
        .insert({
          legal_name: 'General',
          trade_name: 'General',
          is_active: true
        });

      if (companyError) {
        console.error('❌ Error creating default company:', companyError.message);
      } else {
        console.log('✅ Default company "General" created');
      }
    } else {
      console.log('✅ Default company "General" already exists');
    }

    // Create default position
    const { data: existingPosition } = await supabase
      .from('positions')
      .select('position_id')
      .eq('name', 'General')
      .single();

    if (!existingPosition) {
      const { error: positionError } = await supabase
        .from('positions')
        .insert({
          name: 'General',
          description: 'General position for users without specific assignment',
          level: 'general',
          is_active: true
        });

      if (positionError) {
        console.error('❌ Error creating default position:', positionError.message);
      } else {
        console.log('✅ Default position "General" created');
      }
    } else {
      console.log('✅ Default position "General" already exists');
    }

    // Create additional sample data
    const companies = [
      { legal_name: 'TechCorp SA', trade_name: 'TechCorp' },
      { legal_name: 'Innovation Labs SAS', trade_name: 'InnLabs' },
      { legal_name: 'Digital Solutions Ltda', trade_name: 'DigitalSol' }
    ];

    const positions = [
      { name: 'Desarrollador', description: 'Desarrollador de software', level: 'jr' },
      { name: 'Desarrollador Senior', description: 'Desarrollador de software senior', level: 'sr' },
      { name: 'Team Lead', description: 'Líder de equipo técnico', level: 'lead' },
      { name: 'Product Manager', description: 'Gerente de producto', level: 'manager' },
      { name: 'Director Técnico', description: 'Director del área técnica', level: 'director' }
    ];

    // Insert companies
    for (const company of companies) {
      const { data: existing } = await supabase
        .from('companies')
        .select('company_id')
        .eq('legal_name', company.legal_name)
        .single();

      if (!existing) {
        const { error } = await supabase
          .from('companies')
          .insert({ ...company, is_active: true });

        if (error) {
          console.error(`❌ Error creating company ${company.legal_name}:`, error.message);
        } else {
          console.log(`✅ Company "${company.legal_name}" created`);
        }
      }
    }

    // Insert positions
    for (const position of positions) {
      const { data: existing } = await supabase
        .from('positions')
        .select('position_id')
        .eq('name', position.name)
        .single();

      if (!existing) {
        const { error } = await supabase
          .from('positions')
          .insert({ ...position, is_active: true });

        if (error) {
          console.error(`❌ Error creating position ${position.name}:`, error.message);
        } else {
          console.log(`✅ Position "${position.name}" created`);
        }
      }
    }

    console.log('🎉 Seeding completed successfully!');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  }
}

seedData();