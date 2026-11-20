// gta6-meme-x-01 entry: the post on X is the entry. This program hands the
// house the post's address by copying POST.json from the repository root to
// /output/POST.json, where the gate reads it. Node 22, standard library only.
// Run locally as: mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// Confirm the copy is a usable post address before the gate reads it:
// it must parse as JSON with a url that is an x.com status link.
const copied = readFileSync(join(OUTPUT_DIR, 'POST.json'), 'utf8');
let postUrl: string;
try {
  postUrl = (JSON.parse(copied) as { url: string }).url;
} catch {
  console.error('copied POST.json is not valid JSON');
  process.exit(1);
}
if (typeof postUrl !== 'string' || !/^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+/.test(postUrl)) {
  console.error(`copied POST.json has no valid X post url: ${postUrl}`);
  process.exit(1);
}
console.log(`POST.json copied, post url: ${postUrl}`);
