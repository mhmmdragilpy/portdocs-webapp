import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function test() {
  console.log("Testing upload...");
  const { data, error } = await supabase.storage.from('draft-files').upload('test/test2.txt', 'hello', { upsert: false });
  console.log('Error:', error);
  console.log('Data:', data);
}
test();
