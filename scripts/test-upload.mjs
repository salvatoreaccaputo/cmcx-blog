import { createClient } from '../../cmcx/node_modules/@supabase/supabase-js/dist/index.mjs';
import { readFileSync } from 'fs';

const blogEnv = readFileSync(new URL('../.env.local', import.meta.url).pathname, 'utf8');
const cmcxEnv = readFileSync(new URL('../../cmcx/.env.local', import.meta.url).pathname, 'utf8');
const SUPABASE_URL = blogEnv.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const ANON_KEY = blogEnv.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const SERVICE_KEY = cmcxEnv.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim();

const uploadKey = SERVICE_KEY || ANON_KEY;
console.log('Verwendeter Key:', SERVICE_KEY ? 'SERVICE_ROLE_KEY ✓' : 'ANON_KEY (kein Service-Key in .env.local)');

const supabase = createClient(SUPABASE_URL, uploadKey, { auth: { persistSession: false } });

const testBuf = Buffer.from('UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoBAAEAAkA4JZACdAEO/gHOAAA=', 'base64');
const fname = `sdk-test-${Date.now()}.webp`;

console.log('Testing Supabase SDK upload with anon key...');
const { data, error } = await supabase.storage
  .from('blog-images')
  .upload(fname, testBuf, { contentType: 'image/webp', upsert: true });

if (error) {
  console.log('✗ Fehlgeschlagen:', error.message);
} else {
  const { data: urlData } = supabase.storage.from('blog-images').getPublicUrl(fname);
  console.log('✓ Erfolgreich! URL:', urlData.publicUrl);
}
