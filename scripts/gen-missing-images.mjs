/**
 * Generates images for blog posts missing image_url,
 * uploads them to Supabase Storage, and updates the campaigns table.
 * Uses the OpenAI SDK from the cmcx project (sibling directory).
 */

import https from 'https';
import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

// ── Load env ──────────────────────────────────────────────────────────────
const env = readFileSync(new URL('../.env.local', import.meta.url).pathname, 'utf8');
const SUPABASE_URL = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const SUPABASE_KEY = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const cmcxEnv = readFileSync(new URL('../../cmcx/.env.local', import.meta.url).pathname, 'utf8');
const OPENAI_KEY = cmcxEnv.match(/OPENAI_API_KEY=(.*)/)[1].trim();

// ── Use OpenAI SDK from cmcx node_modules ────────────────────────────────
const require = createRequire(import.meta.url);
const cmcxDir = path.resolve(fileURLToPath(import.meta.url), '../../../cmcx');
const OpenAI = require(path.join(cmcxDir, 'node_modules/openai'));
const openai = new OpenAI.default({ apiKey: OPENAI_KEY });

// ── Helpers ───────────────────────────────────────────────────────────────
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    });
    req.on('error', reject);
  });
}

async function supabaseGet(path) {
  return new Promise((resolve, reject) => {
    https.get(`${SUPABASE_URL}${path}`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    }, (res) => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });
}

async function supabasePatch(id, payload) {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(payload));
    const url = new URL(`${SUPABASE_URL}/rest/v1/campaigns?id=eq.${id}`);
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
        'Content-Length': data.length,
      },
    }, (res) => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function saveLocally(buffer, postId) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const slug = postId.slice(0, 8);
  const filename = `blog-${slug}.webp`;
  const filePath = path.resolve(__dirname, '../public/images', filename);
  writeFileSync(filePath, buffer);
  return `/images/${filename}`;
}

async function generateDallePrompt(title, idea, excerpt) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 400,
    messages: [
      {
        role: 'system',
        content: `You are the creative director of a world-class visual studio.
Write an image generation prompt for a blog hero image.
Rules:
- Find an unexpected visual METAPHOR, never illustrate the topic literally
- Maximum 3 colors, dominant neutral + one chromatic accent
- NO: people, robots, AI visuals, circuit boards, lightbulbs, text, logos
- Format: 16:9 landscape, cinematic photography or high-end CGI, single dominant light source
- Output: ONLY the prompt, max 250 words, start with the visual approach`
      },
      {
        role: 'user',
        content: `Blog title: "${title}"\nCore idea: "${idea}"\nExcerpt: "${excerpt}"`
      }
    ]
  });
  return res.choices[0].message.content.trim();
}

async function generateImage(prompt) {
  // Try gpt-image-1 first, fall back to dall-e-3
  try {
    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
      n: 1,
    });
    const image = response.data?.[0];
    if (!image) throw new Error('No image data');
    // gpt-image-1 returns base64
    if (image.b64_json) {
      return { buffer: Buffer.from(image.b64_json, 'base64'), revisedPrompt: null };
    }
    if (image.url) {
      const buffer = await httpsGet(image.url);
      return { buffer, revisedPrompt: image.revised_prompt };
    }
    throw new Error('No image URL or b64 data returned');
  } catch (err) {
    if (err.message?.includes('gpt-image-1')) {
      console.log('  gpt-image-1 not available, trying dall-e-3...');
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt,
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      });
      const image = response.data?.[0];
      if (!image?.url) throw new Error('No image URL');
      const buffer = await httpsGet(image.url);
      return { buffer, revisedPrompt: image.revised_prompt };
    }
    throw err;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────
async function main() {
  const posts = await supabaseGet(
    '/rest/v1/campaigns?select=id,title,idea,blog&image_url=is.null&blog=not.is.null&order=created_at.desc'
  );

  console.log(`\nFound ${posts.length} post(s) without images.\n`);

  for (const post of posts) {
    console.log(`\n[${'='.repeat(60)}]`);
    console.log(`Post: ${post.title}`);
    console.log(`ID:   ${post.id}`);

    try {
      const excerpt = (post.blog || '').slice(0, 400).replace(/\n/g, ' ');

      console.log('  → Generating image prompt via GPT-4o...');
      const dallePrompt = await generateDallePrompt(post.title, post.idea || post.title, excerpt);
      console.log(`  Prompt: ${dallePrompt.slice(0, 120)}...`);

      console.log('  → Generating image...');
      const { buffer, revisedPrompt } = await generateImage(dallePrompt);
      console.log(`  Image buffer: ${buffer.length} bytes`);

      console.log('  → Saving image locally...');
      const publicUrl = saveLocally(buffer, post.id);
      console.log(`  Saved as: ${publicUrl}`);

      console.log('  → Updating database...');
      const patchRes = await supabasePatch(post.id, {
        image_url: publicUrl,
        image_prompt: revisedPrompt || dallePrompt,
      });

      if (patchRes.status < 300) {
        console.log(`  ✓ Done!`);
      } else {
        console.error(`  ✗ DB update failed (${patchRes.status}): ${patchRes.body}`);
      }
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
      if (err.status) console.error(`    HTTP ${err.status}:`, err.error);
    }
  }

  console.log('\n\nAll done!');
}

main().catch(console.error);
