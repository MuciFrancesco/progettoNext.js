/**
 * Seed demo data:
 *  - 50 prodotti distribuiti tra le categorie
 *  - 20 utenti non-admin
 *  - 200 ordini con date sparse (oggi / settimane / mesi / anni fa)
 */

import process from 'node:process';
import { randomUUID } from 'node:crypto';
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

async function main() {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  console.log('Connesso al DB.');

  // 1. Prodotti ────────────────────────────────────────────────────────────────
  console.log(`\nInserisco ${PRODUCT_TEMPLATES.length} prodotti...`);
  const productIds = [];
  const productPrices = {};

  for (const p of PRODUCT_TEMPLATES) {
    const id = randomUUID();
    const stock = randInt(5, 200);
    await client.query(
      `INSERT INTO products (id, title, name, description, category, "priceInCents", "imagePath", "stock_quantity", "isAvailableForPurchase", "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true,NOW(),NOW())
       ON CONFLICT DO NOTHING`,
      [
        id,
        p.title,
        p.name,
        `${p.name} — prodotto di qualità nella categoria ${p.category.toLowerCase()}.`,
        p.category,
        p.price,
        `/uploads/${p.category.toLowerCase()}-${id.split('-')[0]}.jpg`,
        stock,
      ]
    );
    productIds.push(id);
    productPrices[id] = p.price;
  }
  console.log(`  ✓ ${productIds.length} prodotti inseriti`);

  // 2. Utenti non-admin ─────────────────────────────────────────────────────────
  console.log('\nInserisco 20 utenti non-admin...');
  const userIds = [];
  const defaultHash = await argon2.hash('Demo1234!');

  for (let i = 0; i < 20; i++) {
    const id = randomUUID();
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(' ', '')}.${i + 1}@demo.dev`;

    await client.query(
      `INSERT INTO users (id, email, hash, "is_admin", "can_create_cart", "can_order_products", "preferred_locale", "first_name", "last_name", "created_at", "updated_at")
       VALUES ($1,$2,$3,false,true,true,'it',$4,$5,NOW(),NOW())
       ON CONFLICT (email) DO NOTHING`,
      [id, email, defaultHash, firstName, lastName]
    );
    userIds.push(id);
  }
  console.log(`  ✓ ${userIds.length} utenti inseriti`);

  // 3. Ordini ──────────────────────────────────────────────────────────────────
  console.log('\nInserisco 2 ordini garantiti per utente...');
  let ordersInserted = 0;

  for (const userId of userIds) {
    for (let j = 0; j < 2; j++) {
      const orderId = randomUUID();
      const productId = pick(productIds);
      const price = productPrices[productId];
      const qty = randInt(1, 3);
      const total = price * qty;
      const createdAt = weightedOrderDate();

      await client.query(
        `INSERT INTO orders (id, "userId", "productId", "totalPriceInCents", "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$5)`,
        [orderId, userId, productId, total, createdAt]
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
    const qty = randInt(1, 3);
    const total = price * qty;
    const createdAt = weightedOrderDate();

    await client.query(
      `INSERT INTO orders (id, "userId", "productId", "totalPriceInCents", "createdAt", "updatedAt")
       VALUES ($1,$2,$3,$4,$5,$5)`,
      [orderId, userId, productId, total, createdAt]
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
