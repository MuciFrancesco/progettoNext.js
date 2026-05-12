/**
 * Seed demo data:
 *  - 50 prodotti distribuiti tra le categorie
 *  - 20 utenti non-admin
 *  - almeno 5 prodotti gia acquistati per ogni utente, in date diverse
 *  - 200 ordini aggiuntivi con date sparse (oggi / settimane / mesi / anni fa)
 */

import process from 'node:process';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import argon2 from 'argon2';
import { Client } from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('Errore: DATABASE_URL non configurata');
  process.exit(1);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Restituisce una Date casuale distribuita tra oggi e `maxDaysAgo` giorni fa */
function randomPastDate(maxDaysAgo) {
  const ms = Math.random() * maxDaysAgo * 24 * 60 * 60 * 1000;
  return new Date(Date.now() - ms);
}

/**
 * Restituisce una Date distribuita in modo non-uniforme:
 *  25% oggi, 25% ultima settimana, 25% ultimo mese, 25% ultimo anno
 */
function weightedOrderDate() {
  const bucket = Math.random();
  if (bucket < 0.25) return randomPastDate(1); // oggi
  if (bucket < 0.5) return randomPastDate(7); // ultima settimana
  if (bucket < 0.75) return randomPastDate(30); // ultimo mese
  return randomPastDate(365); // ultimo anno
}

function orderDateDaysAgo(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(randInt(9, 20), randInt(0, 59), randInt(0, 59), 0);
  return date;
}

function guaranteedOrderDate(userIndex, orderIndex) {
  const dateOffsets = [1, 6, 18, 45, 120];
  return orderDateDaysAgo(dateOffsets[orderIndex] + userIndex);
}

function escapeSvgText(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
    return entities[char];
  });
}

function productImagePath(product) {
  return `/uploads/demo/${product.category.toLowerCase()}-${product.id.split('-')[0]}.svg`;
}

function productBrand(productName) {
  return productName.split(/\s+/)[0].replace(/[^a-zA-Z0-9']/g, '') || 'ThinkShop';
}

function productFeatures(product) {
  return [
    `${product.name} selezionato per qualita e affidabilita`,
    `Disponibile nella categoria ${product.category.toLowerCase()}`,
    'Spedizione rapida e assistenza inclusa',
  ];
}

function productSpecifications(product) {
  return [
    ['Categoria', product.category],
    ['Marca', productBrand(product.name)],
    ['Condizione', 'Nuovo'],
  ];
}

async function writeProductPlaceholder(product) {
  const uploadsDir = join(process.cwd(), 'uploads', 'demo');
  await mkdir(uploadsDir, { recursive: true });

  const accentByCategory = {
    TECHNOLOGY: '#2563eb',
    HOME: '#059669',
    CLOTHING: '#db2777',
    SPORTS: '#ea580c',
    BOOKS: '#7c3aed',
    FOOD: '#ca8a04',
    BEAUTY: '#be123c',
    TOYS: '#0891b2',
    OTHER: '#475569',
  };
  const accent = accentByCategory[product.category] ?? '#475569';
  const fileName = `${product.category.toLowerCase()}-${product.id.split('-')[0]}.svg`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640" viewBox="0 0 960 640" role="img" aria-label="${escapeSvgText(product.title)}">
  <rect width="960" height="640" fill="#f8fafc"/>
  <rect x="64" y="64" width="832" height="512" rx="40" fill="${accent}" opacity="0.12"/>
  <circle cx="760" cy="158" r="86" fill="${accent}" opacity="0.2"/>
  <rect x="120" y="388" width="720" height="42" rx="21" fill="${accent}" opacity="0.18"/>
  <rect x="120" y="456" width="520" height="32" rx="16" fill="${accent}" opacity="0.14"/>
  <text x="120" y="284" fill="#0f172a" font-family="Arial, sans-serif" font-size="52" font-weight="700">${escapeSvgText(product.name)}</text>
  <text x="120" y="344" fill="${accent}" font-family="Arial, sans-serif" font-size="30" font-weight="700">${escapeSvgText(product.category)}</text>
</svg>`;

  await writeFile(join(uploadsDir, fileName), svg, 'utf8');
}

// ── Catalogo prodotti (50 voci) ───────────────────────────────────────────────

const CATEGORIES = [
  'TECHNOLOGY',
  'HOME',
  'CLOTHING',
  'SPORTS',
  'BOOKS',
  'FOOD',
  'BEAUTY',
  'TOYS',
  'OTHER',
];

const PRODUCT_TEMPLATES = [
  // TECHNOLOGY (8)
  { name: 'MacBook Pro 14"', title: 'Laptop Apple M3', category: 'TECHNOLOGY', price: 199900 },
  { name: 'iPhone 16 Pro', title: 'Smartphone Apple 6.3"', category: 'TECHNOLOGY', price: 129900 },
  { name: 'Samsung 4K OLED 65"', title: 'Smart TV OLED UHD', category: 'TECHNOLOGY', price: 89900 },
  {
    name: 'Sony WH-1000XM6',
    title: 'Cuffie Noise Cancelling',
    category: 'TECHNOLOGY',
    price: 34900,
  },
  { name: 'iPad Air 13"', title: 'Tablet Apple M2', category: 'TECHNOLOGY', price: 79900 },
  {
    name: 'Logitech MX Master 4',
    title: 'Mouse ergonomico wireless',
    category: 'TECHNOLOGY',
    price: 9900,
  },
  { name: 'Dell XPS 15', title: 'Laptop Windows OLED', category: 'TECHNOLOGY', price: 179900 },
  { name: 'GoPro Hero 13', title: 'Action cam 5.3K', category: 'TECHNOLOGY', price: 44900 },
  // HOME (7)
  { name: 'Dyson V15 Detect', title: 'Aspirapolvere cordless', category: 'HOME', price: 69900 },
  { name: 'Nespresso Vertuo Pop', title: 'Macchina caffè capsule', category: 'HOME', price: 14900 },
  { name: 'KitchenAid Artisan', title: 'Impastatrice planetaria', category: 'HOME', price: 59900 },
  { name: 'Philips Hue Starter', title: 'Kit luci smart LED', category: 'HOME', price: 8900 },
  { name: 'iRobot Roomba j9+', title: 'Robot aspirapolvere', category: 'HOME', price: 89900 },
  { name: 'Instant Pot Duo 7', title: 'Pentola a pressione smart', category: 'HOME', price: 11900 },
  { name: 'Braun Serie 9 Pro', title: 'Rasoio elettrico premium', category: 'HOME', price: 29900 },
  // CLOTHING (7)
  {
    name: 'Nike Air Max 270',
    title: 'Scarpe running ammortizzate',
    category: 'CLOTHING',
    price: 14900,
  },
  { name: "Levi's 501 Jeans", title: 'Jeans dritti classici', category: 'CLOTHING', price: 8900 },
  { name: 'Patagonia Nano Puff', title: 'Giacca ultraleggera', category: 'CLOTHING', price: 24900 },
  { name: 'Adidas Ultraboost 24', title: 'Scarpe da corsa', category: 'CLOTHING', price: 18900 },
  { name: 'Uniqlo Ultra Light Down', title: 'Piumino compatto', category: 'CLOTHING', price: 9900 },
  {
    name: 'The North Face Resolve',
    title: 'Giacca impermeabile',
    category: 'CLOTHING',
    price: 16900,
  },
  { name: 'Zara Blazer Slim', title: 'Blazer formale slim fit', category: 'CLOTHING', price: 7900 },
  // SPORTS (6)
  {
    name: 'Garmin Forerunner 965',
    title: 'Orologio GPS running',
    category: 'SPORTS',
    price: 59900,
  },
  { name: 'Wilson Pro Staff 97', title: 'Racchetta tennis pro', category: 'SPORTS', price: 24900 },
  { name: 'Peloton Bike+', title: 'Cyclette smart connessa', category: 'SPORTS', price: 199900 },
  { name: 'Yeti Rambler 26oz', title: 'Borraccia termica', category: 'SPORTS', price: 3900 },
  { name: 'Osprey Atmos 65', title: 'Zaino trekking 65L', category: 'SPORTS', price: 29900 },
  { name: 'Salomon X Ultra 4', title: 'Scarpe hiking GTX', category: 'SPORTS', price: 17900 },
  // BOOKS (5)
  { name: 'Clean Code', title: 'R. Martin — Software artigianale', category: 'BOOKS', price: 3900 },
  { name: 'The Pragmatic Programmer', title: 'Hunt & Thomas', category: 'BOOKS', price: 4500 },
  { name: 'Atomic Habits', title: 'James Clear', category: 'BOOKS', price: 2900 },
  { name: 'Sapiens', title: 'Yuval Noah Harari', category: 'BOOKS', price: 2500 },
  { name: 'Il Nome della Rosa', title: 'Umberto Eco', category: 'BOOKS', price: 1900 },
  // FOOD (4)
  { name: 'Parmigiano 24m 1kg', title: 'Parmigiano Reggiano DOP', category: 'FOOD', price: 3200 },
  { name: 'Olio EVO Toscano 500ml', title: 'Olio extravergine bio', category: 'FOOD', price: 1800 },
  { name: 'Tartufo Nero 50g', title: 'Tartufo nero pregiato', category: 'FOOD', price: 5900 },
  {
    name: 'Pasta di Gragnano 5kg',
    title: 'Misto formati artigianale',
    category: 'FOOD',
    price: 2200,
  },
  // BEAUTY (5)
  {
    name: 'La Mer Moisturizing Cream',
    title: 'Crema viso premium',
    category: 'BEAUTY',
    price: 18900,
  },
  {
    name: 'Dyson Airwrap Complete',
    title: 'Styler capelli multifunzione',
    category: 'BEAUTY',
    price: 59900,
  },
  {
    name: 'Charlotte Tilbury Pillow Talk',
    title: 'Matita labbra cult',
    category: 'BEAUTY',
    price: 2900,
  },
  {
    name: 'Tatcha The Water Cream',
    title: 'Idratante viso oilfree',
    category: 'BEAUTY',
    price: 7900,
  },
  { name: 'Sol de Janeiro BJ8', title: 'Crema corpo iconica', category: 'BEAUTY', price: 3900 },
  // TOYS (4)
  { name: 'LEGO Technic Bugatti', title: 'Set LEGO 3599 pezzi', category: 'TOYS', price: 44900 },
  {
    name: 'Nintendo Switch OLED',
    title: 'Console portatile Nintendo',
    category: 'TOYS',
    price: 34900,
  },
  {
    name: 'Hot Wheels Ultimate Garage',
    title: 'Parcheggio 5 piani Hot Wheels',
    category: 'TOYS',
    price: 14900,
  },
  { name: 'Barbie Dreamhouse', title: 'Casa dei sogni Barbie', category: 'TOYS', price: 19900 },
  // OTHER (4)
  {
    name: 'Moleskine Classic A5',
    title: 'Taccuino copertina rigida',
    category: 'OTHER',
    price: 2500,
  },
  { name: 'Polaroid Now+ Gen 2', title: 'Fotocamera istantanea', category: 'OTHER', price: 14900 },
  { name: 'BIC Cristal Cofanetto', title: 'Set 30 penne a sfera', category: 'OTHER', price: 900 },
  { name: 'Moleskine Weekly 2026', title: 'Agenda settimanale', category: 'OTHER', price: 2200 },
];

// ── Nomi/cognomi per utenti casuali ──────────────────────────────────────────

const FIRST_NAMES = [
  'Marco',
  'Giulia',
  'Luca',
  'Sofia',
  'Alessandro',
  'Chiara',
  'Matteo',
  'Valentina',
  'Davide',
  'Francesca',
  'Andrea',
  'Elisa',
  'Simone',
  'Alice',
  'Riccardo',
  'Martina',
  'Lorenzo',
  'Sara',
  'Federico',
  'Anna',
];
const LAST_NAMES = [
  'Rossi',
  'Ferrari',
  'Russo',
  'Bianchi',
  'Ricci',
  'Esposito',
  'Conti',
  'De Luca',
  'Mancini',
  'Costa',
  'Greco',
  'Bruno',
  'Gallo',
  'Lombardi',
  'Barbieri',
  'Fontana',
  'Santoro',
  'Mariani',
  'Romano',
  'Colombo',
];

// ── Main ─────────────────────────────────────────────────────────────────────

async function ensureProductSchema(client) {
  await client.query(
    `ALTER TABLE products
     ADD COLUMN IF NOT EXISTS "is_rebuyable" BOOLEAN NOT NULL DEFAULT false,
     ADD COLUMN IF NOT EXISTS "is_in_sale" BOOLEAN NOT NULL DEFAULT false,
     ADD COLUMN IF NOT EXISTS "sale_price_in_cents" INTEGER,
     ADD COLUMN IF NOT EXISTS "sale_discount_percent" INTEGER`
  );
}

async function main() {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  console.log('Connesso al DB.');
  await ensureProductSchema(client);

  // 1. Prodotti ────────────────────────────────────────────────────────────────
  console.log(`\nInserisco ${PRODUCT_TEMPLATES.length} prodotti...`);
  const productIds = [];
  const productPrices = {};
  const productSnapshots = {};

  for (const p of PRODUCT_TEMPLATES) {
    const id = randomUUID();
    const stock = randInt(5, 200);
    const imagePath = productImagePath({ ...p, id });
    const brand = productBrand(p.name);
    const originalPrice = Math.round(p.price * (1 + randInt(10, 35) / 100));
    await writeProductPlaceholder({ ...p, id });
    await client.query(
      `INSERT INTO products (id, title, name, description, brand, category, "priceInCents", original_price_in_cents, "imagePath", "imagePaths", "stock_quantity", "isAvailableForPurchase", "is_rebuyable", "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,ARRAY[$9]::text[],$10,true,$11,NOW(),NOW())
       ON CONFLICT DO NOTHING`,
      [
        id,
        p.title,
        p.name,
        `${p.name} — prodotto di qualità nella categoria ${p.category.toLowerCase()}.`,
        brand,
        p.category,
        p.price,
        originalPrice,
        imagePath,
        stock,
        true,
      ]
    );

    await client.query(
      `INSERT INTO product_images (id, product_id, url, alt_text, sort_order, is_primary, created_at, updated_at)
       VALUES ($1,$2,$3,$4,0,true,NOW(),NOW())`,
      [randomUUID(), id, imagePath, p.title]
    );

    for (const [index, feature] of productFeatures(p).entries()) {
      await client.query(
        `INSERT INTO product_features (id, product_id, text, sort_order, created_at, updated_at)
         VALUES ($1,$2,$3,$4,NOW(),NOW())`,
        [randomUUID(), id, feature, index]
      );
    }

    for (const [index, [label, value]] of productSpecifications(p).entries()) {
      await client.query(
        `INSERT INTO product_specifications (id, product_id, label, value, sort_order, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,NOW(),NOW())`,
        [randomUUID(), id, label, value, index]
      );
    }

    productIds.push(id);
    productPrices[id] = p.price;
    productSnapshots[id] = { title: p.title, imagePath };
  }
  console.log(`  ✓ ${productIds.length} prodotti inseriti`);

  // 2. Utenti non-admin ─────────────────────────────────────────────────────────
  const existingProducts = await client.query(
    `SELECT id, name, title, category FROM products WHERE "imagePath" LIKE '/uploads/%'`
  );
  for (const product of existingProducts.rows) {
    const imagePath = productImagePath(product);
    await writeProductPlaceholder(product);
    await client.query(
      `UPDATE products SET "imagePath" = $2, "imagePaths" = ARRAY[$2]::text[], "updatedAt" = NOW() WHERE id = $1`,
      [product.id, imagePath]
    );
  }

  console.log('\nInserisco utenti non-admin...');
  const userIds = [];
  const defaultHash = await argon2.hash('Demo1234!');
  const requestedUserHash = await argon2.hash('Amacabanane97!');

  async function insertDemoUser({ email, firstName, lastName, passwordHash = defaultHash }) {
    const id = randomUUID();
    const result = await client.query(
      `INSERT INTO users (id, email, hash, "is_admin", "is_employee", "can_create_cart", "can_order_products", "preferred_locale", "first_name", "last_name", "created_at", "updated_at")
       VALUES ($1,$2,$3,false,false,true,true,'it',$4,$5,NOW(),NOW())
       ON CONFLICT (email) DO UPDATE SET
         hash = EXCLUDED.hash,
         "is_admin" = false,
         "is_employee" = false,
         "can_create_cart" = true,
         "can_order_products" = true,
         "first_name" = EXCLUDED."first_name",
         "last_name" = EXCLUDED."last_name",
         "updated_at" = NOW()
       RETURNING id`,
      [id, email, passwordHash, firstName, lastName]
    );
    userIds.push(result.rows[0].id);
  }

  await insertDemoUser({
    email: 'adolf000@gmail.it',
    firstName: 'Adolf',
    lastName: 'Demo',
    passwordHash: requestedUserHash,
  });

  for (let i = 0; i < 20; i++) {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(' ', '')}.${i + 1}@demo.dev`;

    await insertDemoUser({ email, firstName, lastName });
  }
  console.log(`  ✓ ${userIds.length} utenti inseriti`);

  // 3. Ordini ──────────────────────────────────────────────────────────────────
  console.log('\nInserisco 5 acquisti garantiti per utente in date diverse...');
  let ordersInserted = 0;

  for (const [userIndex, userId] of userIds.entries()) {
    for (let j = 0; j < 5; j++) {
      const orderId = randomUUID();
      const productId = productIds[(userIndex * 5 + j) % productIds.length];
      const price = productPrices[productId];
      const snapshot = productSnapshots[productId];
      const qty = randInt(1, 3);
      const total = price * qty;
      const createdAt = guaranteedOrderDate(userIndex, j);

      await client.query(
        `INSERT INTO orders (id, "userId", status, "totalPriceInCents", "createdAt", "updatedAt")
         VALUES ($1,$2,'PAID',$3,$4,$4)`,
        [orderId, userId, total, createdAt]
      );
      await client.query(
        `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price_in_cents, line_total_in_cents, product_title_snapshot, product_image_snapshot, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          randomUUID(),
          orderId,
          productId,
          qty,
          price,
          total,
          snapshot.title,
          snapshot.imagePath,
          createdAt,
        ]
      );
      ordersInserted++;
    }
  }
  console.log(`  ✓ ${ordersInserted} ordini garantiti inseriti`);

  console.log('\nInserisco 200 ordini aggiuntivi con date distribuite...');
  ordersInserted = 0;

  for (let i = 0; i < 200; i++) {
    const orderId = randomUUID();
    const userId = pick(userIds);
    const productId = pick(productIds);
    const price = productPrices[productId];
    const snapshot = productSnapshots[productId];
    const qty = randInt(1, 3);
    const total = price * qty;
    const createdAt = weightedOrderDate();

    await client.query(
      `INSERT INTO orders (id, "userId", status, "totalPriceInCents", "createdAt", "updatedAt")
       VALUES ($1,$2,'PAID',$3,$4,$4)`,
      [orderId, userId, total, createdAt]
    );
    await client.query(
      `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price_in_cents, line_total_in_cents, product_title_snapshot, product_image_snapshot, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        randomUUID(),
        orderId,
        productId,
        qty,
        price,
        total,
        snapshot.title,
        snapshot.imagePath,
        createdAt,
      ]
    );
    ordersInserted++;
  }
  console.log(`  ✓ ${ordersInserted} ordini inseriti`);

  await client.end();
  console.log('\nSeed demo completato con successo.');
}

try {
  await main();
} catch (err) {
  console.error('Errore seed demo:', err);
  process.exit(1);
}
