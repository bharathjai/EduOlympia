const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.from('subjects').select(`
    name,
    chapters (
      id,
      name,
      topics (
        study_materials (
          id,
          title,
          type,
          status
        )
      )
    )
  `);
  console.log('Error:', error);
  console.log('Data count:', data ? data.length : 0);
  if (data && data.length > 0) {
    console.log('Sample subject:', JSON.stringify(data[0], null, 2));
  }
}
check();
