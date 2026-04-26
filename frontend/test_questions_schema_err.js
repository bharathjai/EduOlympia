const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(url, key);

async function check() {
  const { data, error } = await supabase.rpc('get_questions_schema', {});
  // Alternatively just intentionally cause a syntax error to get the columns from postgrest
  const res = await supabase.from('questions').select('bad_column').limit(1);
  console.log('Error:', res.error);
}
check();
