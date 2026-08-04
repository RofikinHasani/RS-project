/**
 * Downloads every dish photo used on the site into public/assets, named
 * images01.png, images02.png, images03.png ... in the same order as
 * the dishes in src/data/menuData.js.
 *
 * These live in /public (not /src) on purpose: they're referenced by
 * plain URL path (e.g. "/assets/images01.png"), not a JS import. That
 * way, if a file is missing, the browser just gets a normal 404 for
 * that one <img> and DishImage.jsx swaps to the Unsplash fallback URL
 * automatically — a missing file here can never break the whole build.
 *
 * Runs automatically after `npm install` (see "postinstall" in
 * package.json). You can also run it manually any time with:
 *   npm run images:download
 *
 * Safe to re-run: files that already exist are skipped.
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'public', 'assets');

// Same order as menuItems in src/data/menuData.js, plus 6 gallery-only
// photos (restaurant / chef / customer categories — see Gallery.jsx)
const images = [
  { name: 'images01.png', dish: 'Garden Omelette', id: '1510693206972-df098062cb71' },
  { name: 'images02.png', dish: 'Smoked Salmon Toast', id: '1608039867578-2bba47388911' },
  { name: 'images03.png', dish: 'Margherita Pizza', id: '1574071318508-1cdbab80d002' },
  { name: 'images04.png', dish: 'Ember Burger', id: '1550547660-d9450f859349' },
  { name: 'images05.png', dish: 'Wild Mushroom Pasta', id: '1689793607035-1a25fb32a510' },
  { name: 'images06.png', dish: 'Charred Ribeye Steak', id: '1611171711791-b34fa42e9fc2' },
  { name: 'images07.png', dish: 'Whole Grilled Fish', id: '1519708227418-c8fd9a32b7a2' },
  { name: 'images08.png', dish: 'Slow Roasted Lamb', id: '1766589152455-22eb3ab8849e' },
  { name: 'images09.png', dish: 'Ash Chocolate Tart', id: '1616031037011-087000171abe' },
  { name: 'images10.png', dish: 'Grilled Pineapple', id: '1566071732121-8f2669919fe5' },
  { name: 'images11.png', dish: 'Vine Coffee', id: '1497515114629-f71d768fd07c' },
  { name: 'images12.png', dish: 'Garden Iced Tea', id: '1681974913878-1c446bac7cf5' },
  { name: 'images13.png', dish: 'Weekend Brunch (soup)', id: '1629978448078-c94a0ab6500f' },
  { name: 'images14.png', dish: 'Plating a Dish', id: '1577106263724-2c8e03bfe9cf' },
  { name: 'images15.png', dish: 'Bar Corner', id: '1514933651103-005eec06c04b' },
  { name: 'images16.png', dish: 'Guests Dining', id: '1723744910051-da35a92321af' },
  { name: 'images17.png', dish: 'Chef at the Grill', id: '1734313276344-b4105538ac10' },
  { name: 'images18.png', dish: 'Dining Room', id: '1632210826643-9ff7e84be2f9' },
];

function photoUrl(id, { forcePng = true } = {}) {
  const base = `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop&q=80`;
  // fm=png forces the CDN to actually return PNG bytes. Some photo IDs /
  // CDN configurations reject this param — if so we retry without it.
  return forcePng ? `${base}&fm=png` : `${base}&auto=format`;
}

async function tryFetch(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`Response was not an image (content-type: ${contentType || 'unknown'})`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function downloadOne({ name, dish, id }) {
  const dest = join(assetsDir, name);
  if (existsSync(dest)) {
    console.log(`skip  ${name}  (already exists) — ${dish}`);
    return;
  }
  try {
    let buf;
    try {
      buf = await tryFetch(photoUrl(id, { forcePng: true }));
    } catch {
      // Retry without fm=png — still saved as .png, browsers sniff the
      // real format from the file bytes so this displays fine either way.
      buf = await tryFetch(photoUrl(id, { forcePng: false }));
    }
    writeFileSync(dest, buf);
    console.log(`saved ${name}  — ${dish}`);
  } catch (err) {
    console.warn(`FAILED ${name} (${dish}): ${err.message}`);
    console.warn('  The site will still show this dish via its Unsplash fallback URL.');
    console.warn('  To fix it locally, save this image manually as:', dest);
    console.warn(`  ${photoUrl(id, { forcePng: false })}`);
  }
}

async function main() {
  if (!existsSync(assetsDir)) mkdirSync(assetsDir, { recursive: true });
  console.log(`Downloading ${images.length} dish photos into src/assets ...`);
  for (const img of images) {
    // sequential, gentle on the CDN
    // eslint-disable-next-line no-await-in-loop
    await downloadOne(img);
  }
  console.log('Done.');
}

main();
