/**
 * ThinkShop seed data:
 * - Amazon-like catalog with real ProductImage, ProductFeature, ProductSpecification rows
 * - authenticated demo users
 * - real user reviews, one review per user/product
 * - multi-product orders through Order + OrderItem
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

const SUBCATEGORIES = {
  TECHNOLOGY: [
    ['smartphone', 'Smartphone', 'Telefono e mobilita connessa'],
    ['pc', 'PC e laptop', 'Computer, monitor e postazioni di lavoro'],
    ['audio', 'Audio', 'Auricolari, speaker e suono immersivo'],
    ['accessori-tech', 'Accessori tech', 'Dock, charger, router e periferiche'],
  ],
  HOME: [
    ['pulizia-smart', 'Pulizia smart', 'Robot, aspirazione e gestione casa'],
    ['cucina', 'Cucina', 'Piccoli elettrodomestici e preparazione'],
    ['comfort-casa', 'Comfort casa', 'Aria, luce e riposo'],
  ],
  CLOTHING: [
    ['giacche', 'Giacche', 'Outerwear tecnico e urbano'],
    ['scarpe', 'Scarpe', 'Sneaker e calzature quotidiane'],
    ['basic', 'Basic', 'Capi essenziali e stratificazione'],
  ],
  SPORTS: [
    ['running', 'Running', 'Corsa, performance e recupero'],
    ['outdoor', 'Outdoor', 'Trekking, bici e attivita all aperto'],
    ['fitness', 'Fitness', 'Allenamento, yoga e home gym'],
  ],
  BOOKS: [
    ['software', 'Software', 'Programmazione e architettura'],
    ['produttivita', 'Produttivita', 'Metodo, focus e crescita personale'],
    ['design', 'Design', 'UX, prodotto e scrittura digitale'],
  ],
  FOOD: [
    ['gourmet', 'Gourmet', 'Box e specialita selezionate'],
    ['dispensa', 'Dispensa', 'Pasta, caffe, miele e conserve'],
    ['condimenti', 'Condimenti', 'Oli, pesto e balsamici'],
  ],
  BEAUTY: [
    ['skincare', 'Skincare', 'Routine viso e idratazione'],
    ['haircare', 'Haircare', 'Capelli, maschere e riparazione'],
    ['makeup-tools', 'Make-up tools', 'Pennelli e accessori beauty'],
  ],
  TOYS: [
    ['costruzioni', 'Costruzioni', 'Mattoncini, set e montaggio'],
    ['stem', 'STEM', 'Robotica e laboratori educativi'],
    ['puzzle', 'Puzzle', 'Giochi illustrati e logica'],
  ],
  OTHER: [
    ['ufficio', 'Ufficio', 'Scrittura, desk e organizzazione'],
    ['viaggio', 'Viaggio', 'Organizer, sicurezza e accessori'],
    ['gadget', 'Gadget', 'Idee utili e oggetti smart'],
  ],
};

const CATEGORY_SLUGS = {
  TECHNOLOGY: 'tecnologia',
  HOME: 'casa',
  CLOTHING: 'abbigliamento',
  SPORTS: 'sport',
  BOOKS: 'libri',
  FOOD: 'alimentari',
  BEAUTY: 'bellezza',
  TOYS: 'giocattoli',
  OTHER: 'altro',
};

const PRODUCTS = [
  {
    name: 'ThinkPhone Ultra 7',
    title: 'Smartphone AMOLED 6.7 con AI camera',
    brand: 'ThinkTech',
    category: 'TECHNOLOGY',
    subcategory: 'smartphone',
    price: 89900,
    originalPrice: 109900,
    stock: 48,
    color: '#2563eb',
    description:
      'Smartphone premium con display AMOLED fluido, tripla fotocamera e batteria a lunga durata.',
    features: [
      'Display AMOLED 6.7 a 120Hz',
      'Tripla fotocamera con stabilizzazione ottica',
      'Ricarica rapida USB-C e autonomia per tutta la giornata',
      'Scocca in alluminio e vetro rinforzato',
    ],
    specifications: [
      ['Display', '6.7 AMOLED 120Hz'],
      ['RAM', '12GB'],
      ['Storage', '256GB'],
      ['Batteria', '5000mAh'],
      ['Connettivita', '5G, Wi-Fi 7, Bluetooth 5.4'],
    ],
  },
  {
    name: 'ThinkBook Pro 14',
    title: 'Laptop OLED per lavoro e creativita',
    brand: 'ThinkTech',
    category: 'TECHNOLOGY',
    subcategory: 'pc',
    price: 149900,
    originalPrice: 169900,
    stock: 21,
    color: '#4f46e5',
    description:
      'Notebook sottile con pannello OLED, tastiera retroilluminata e prestazioni da workstation mobile.',
    features: [
      'Schermo OLED 14.2 con colori accurati',
      'Processore di nuova generazione per multitasking pesante',
      'SSD NVMe veloce e chassis in metallo',
      'Webcam full HD con microfoni beamforming',
    ],
    specifications: [
      ['Display', '14.2 OLED'],
      ['RAM', '32GB'],
      ['Storage', '1TB SSD'],
      ['Peso', '1.35kg'],
      ['Porte', 'Thunderbolt, HDMI, USB-C'],
    ],
  },
  {
    name: 'Aurora Buds Max',
    title: 'Auricolari ANC con audio spaziale',
    brand: 'Aurora',
    category: 'TECHNOLOGY',
    subcategory: 'audio',
    price: 17900,
    originalPrice: 22900,
    stock: 96,
    color: '#0891b2',
    description:
      'Auricolari true wireless con cancellazione del rumore, custodia wireless e modalita trasparenza.',
    features: [
      'ANC adattivo con modalita trasparenza',
      'Audio spaziale e bassa latenza',
      'Custodia con ricarica wireless',
      'Resistenza a sudore e schizzi',
    ],
    specifications: [
      ['Autonomia', '8h + 28h custodia'],
      ['Driver', '11mm dinamico'],
      ['Codec', 'AAC, LC3'],
      ['Microfoni', '6 totali'],
      ['Protezione', 'IPX4'],
    ],
  },
  {
    name: 'CasaFlow Robot X9',
    title: 'Robot aspirapolvere con base autosvuotante',
    brand: 'CasaFlow',
    category: 'HOME',
    subcategory: 'pulizia-smart',
    price: 69900,
    originalPrice: 84900,
    stock: 32,
    color: '#059669',
    description:
      'Robot aspirapolvere e lavapavimenti con mappatura LiDAR, base autosvuotante e lavaggio intelligente.',
    features: [
      'Mappatura LiDAR multilivello',
      'Base autosvuotante e serbatoio acqua controllato',
      'Riconoscimento tappeti e ostacoli',
      'Programmazione da app',
    ],
    specifications: [
      ['Aspirazione', '6500Pa'],
      ['Autonomia', '180 minuti'],
      ['Mappatura', 'LiDAR 360'],
      ['Serbatoio acqua', '300ml'],
      ['Compatibilita', 'Alexa, Google Home'],
    ],
  },
  {
    name: 'KitchenLab Air Chef',
    title: 'Friggitrice ad aria doppio cestello',
    brand: 'KitchenLab',
    category: 'HOME',
    subcategory: 'cucina',
    price: 15900,
    originalPrice: 19900,
    stock: 77,
    color: '#16a34a',
    description:
      'Friggitrice ad aria con due zone indipendenti, programmi smart e cestelli antiaderenti.',
    features: [
      'Due cestelli indipendenti sincronizzabili',
      'Programmi automatici per forno, grill e air fry',
      'Pulizia semplice con parti lavabili',
      'Display touch inclinato',
    ],
    specifications: [
      ['Capacita', '9L totali'],
      ['Potenza', '2400W'],
      ['Programmi', '10'],
      ['Temperatura', '40-240 C'],
      ['Materiale cestelli', 'Antiaderente senza PFOA'],
    ],
  },
  {
    name: 'RunPeak Carbon 2',
    title: 'Scarpe running con piastra in carbonio',
    brand: 'RunPeak',
    category: 'SPORTS',
    subcategory: 'running',
    price: 21900,
    originalPrice: 25900,
    stock: 54,
    color: '#ea580c',
    description:
      'Scarpa running leggera per gare e allenamenti veloci, con schiuma reattiva e piastra in carbonio.',
    features: [
      'Piastra in carbonio a tutta lunghezza',
      'Mesh traspirante con rinforzi mirati',
      'Schiuma ad alto ritorno energetico',
      'Suola grip per asfalto bagnato',
    ],
    specifications: [
      ['Drop', '8mm'],
      ['Peso', '218g'],
      ['Uso', 'Gara e tempo run'],
      ['Tomaia', 'Engineered mesh'],
      ['Taglie', '40-46'],
    ],
  },
  {
    name: 'TrailPack Summit 45',
    title: 'Zaino trekking tecnico 45L',
    brand: 'TrailPack',
    category: 'SPORTS',
    subcategory: 'outdoor',
    price: 18900,
    originalPrice: 22900,
    stock: 43,
    color: '#65a30d',
    description:
      'Zaino da trekking con schienale ventilato, copertura antipioggia e tasche organizzate.',
    features: [
      'Schienale regolabile e ventilato',
      'Copertura rain cover inclusa',
      'Agganci per bastoncini e sacca idrica',
      'Tasche laterali elastiche',
    ],
    specifications: [
      ['Volume', '45L'],
      ['Peso', '1.4kg'],
      ['Materiale', 'Nylon ripstop'],
      ['Rain cover', 'Inclusa'],
      ['Garanzia', '2 anni'],
    ],
  },
  {
    name: 'UrbanWarm Parka',
    title: 'Parka impermeabile imbottito',
    brand: 'UrbanWarm',
    category: 'CLOTHING',
    subcategory: 'giacche',
    price: 16900,
    originalPrice: 21900,
    stock: 65,
    color: '#db2777',
    description:
      'Parka caldo e impermeabile con cappuccio regolabile, tasche interne e vestibilita urbana.',
    features: [
      'Tessuto esterno impermeabile',
      'Imbottitura riciclata ad alta tenuta termica',
      'Cappuccio e polsini regolabili',
      'Tasche interne per smartphone e documenti',
    ],
    specifications: [
      ['Vestibilita', 'Regular fit'],
      ['Impermeabilita', '10.000mm'],
      ['Imbottitura', 'Sintetica riciclata'],
      ['Lavaggio', '30 C'],
      ['Taglie', 'S-XXL'],
    ],
  },
  {
    name: 'GlowLab Hydra Set',
    title: 'Routine skincare idratante completa',
    brand: 'GlowLab',
    category: 'BEAUTY',
    subcategory: 'skincare',
    price: 7900,
    originalPrice: 9900,
    stock: 88,
    color: '#be123c',
    description:
      'Set skincare con detergente, siero ialuronico e crema barriera per uso quotidiano.',
    features: [
      'Routine in 3 step per mattina e sera',
      'Siero con acido ialuronico multi-peso',
      'Crema barriera senza profumo',
      'Packaging riciclabile',
    ],
    specifications: [
      ['Contenuto', 'Detergente 150ml, siero 30ml, crema 50ml'],
      ['Tipo pelle', 'Normale, secca, sensibile'],
      ['Profumo', 'Assente'],
      ['PAO', '12M'],
      ['Dermatologicamente testato', 'Si'],
    ],
  },
  {
    name: 'Mastering TypeScript',
    title: 'Manuale pratico per architetture frontend',
    brand: 'CodePress',
    category: 'BOOKS',
    subcategory: 'software',
    price: 4200,
    originalPrice: 5200,
    stock: 120,
    color: '#7c3aed',
    description:
      'Libro tecnico con pattern TypeScript, test, refactor e organizzazione enterprise per team moderni.',
    features: [
      'Esempi pratici con React e Node',
      'Capitoli su type safety e architettura',
      'Checklist di code review',
      'Esercizi progressivi',
    ],
    specifications: [
      ['Pagine', '486'],
      ['Formato', 'Copertina flessibile'],
      ['Lingua', 'Italiano'],
      ['Editore', 'CodePress'],
      ['Anno', '2026'],
    ],
  },
  {
    name: 'GustoBox Italia',
    title: 'Box gourmet con specialita italiane',
    brand: 'GustoBox',
    category: 'FOOD',
    subcategory: 'gourmet',
    price: 5900,
    originalPrice: 6900,
    stock: 39,
    color: '#ca8a04',
    description:
      'Selezione gourmet con pasta artigianale, olio EVO, pesto, biscotti e conserve italiane.',
    features: [
      'Prodotti selezionati da piccoli fornitori',
      'Ingredienti a lunga conservazione',
      'Idea regalo pronta da consegnare',
      'Schede degustazione incluse',
    ],
    specifications: [
      ['Peso netto', '2.4kg'],
      ['Allergeni', 'Glutine, frutta a guscio possibile'],
      ['Origine', 'Italia'],
      ['Conservazione', 'Luogo fresco e asciutto'],
      ['Scadenza minima', '6 mesi'],
    ],
  },
  {
    name: 'BrickWorld Space Base',
    title: 'Set costruzioni base spaziale modulare',
    brand: 'BrickWorld',
    category: 'TOYS',
    subcategory: 'costruzioni',
    price: 12900,
    originalPrice: 15900,
    stock: 58,
    color: '#0891b2',
    description:
      'Set costruzioni con moduli componibili, rover, minifigure e luci compatibili.',
    features: [
      'Base modulare espandibile',
      'Rover con sospensioni e laboratorio',
      'Istruzioni digitali incluse',
      'Compatibile con mattoncini standard',
    ],
    specifications: [
      ['Pezzi', '1280'],
      ['Eta consigliata', '9+'],
      ['Minifigure', '6'],
      ['Dimensioni montato', '48 x 32 cm'],
      ['Batterie', 'Non incluse'],
    ],
  },
];

const USERS = [
  ['adolf000@gmail.it', 'Adolf', 'Demo', 'Amacabanane97!'],
];

const FIRST_NAMES = [
  'Giulia',
  'Marco',
  'Sofia',
  'Luca',
  'Alice',
  'Matteo',
  'Chiara',
  'Davide',
  'Francesca',
  'Andrea',
  'Elisa',
  'Simone',
  'Martina',
  'Riccardo',
  'Sara',
  'Lorenzo',
  'Valentina',
  'Federico',
  'Anna',
  'Gabriele',
  'Noemi',
  'Tommaso',
  'Irene',
  'Alessio',
  'Beatrice',
  'Nicolò',
  'Marta',
  'Edoardo',
  'Viola',
];

const LAST_NAMES = [
  'Rossi',
  'Bianchi',
  'Ferrari',
  'Conti',
  'Greco',
  'Romano',
  'Costa',
  'Ricci',
  'Mancini',
  'Gallo',
  'Fontana',
  'Lombardi',
  'Barbieri',
  'Mariani',
  'Colombo',
  'Santoro',
  'Rizzo',
  'Moretti',
  'Caruso',
  'Leone',
  'Villa',
  'Riva',
  'Serra',
  'Coppola',
  'Ferraro',
  'Martini',
  'Longo',
  'Fiore',
  'Sala',
];

const CATEGORY_VARIANTS = {
  TECHNOLOGY: [
    ['NovaPad Air 11', 'Tablet leggero con display retina', 42900],
    ['PixelView Monitor 32', 'Monitor 4K HDR per produttivita', 39900],
    ['StreamCam Pro', 'Webcam 4K con microfoni smart', 14900],
    ['ChargeHub 120W', 'Dock USB-C multiporta compatta', 9900],
    ['MeshRouter Trio', 'Sistema Wi-Fi mesh per casa', 27900],
  ],
  HOME: [
    ['SleepWell Hybrid', 'Materasso ibrido memory e molle', 64900],
    ['PureAir Sense', 'Purificatore aria smart HEPA', 24900],
    ['BrewMaster Mini', 'Macchina espresso compatta', 12900],
    ['SteamCare Pro', 'Ferro da stiro verticale', 8900],
    ['LumaDesk Lamp', 'Lampada scrivania LED smart', 6900],
  ],
  CLOTHING: [
    ['AeroFit Hoodie', 'Felpa tecnica traspirante', 6900],
    ['DenimFlex 501', 'Jeans elasticizzato regular fit', 7900],
    ['CityStep Leather', 'Sneaker pelle urbana', 11900],
    ['RainShell Light', 'Giacca impermeabile ripiegabile', 12900],
    ['Merino Base Tee', 'T-shirt merino termoregolante', 4900],
  ],
  SPORTS: [
    ['HydroRun Bottle', 'Borraccia termica sportiva', 2900],
    ['CoreYoga Mat', 'Tappetino yoga antiscivolo', 3900],
    ['PowerBand Set', 'Set elastici fitness progressivi', 3400],
    ['CycleGuard MIPS', 'Casco bici ventilato', 8900],
    ['SwimPro Goggles', 'Occhialini nuoto antiappannamento', 2500],
  ],
  BOOKS: [
    ['Designing Data Systems', 'Guida pratica ai sistemi dati', 4800],
    ['Deep Work', 'Focus e produttivita consapevole', 2600],
    ['UX Writing Handbook', 'Manuale per microcopy digitale', 3200],
    ['Storie di Innovazione', 'Casi italiani di prodotto', 2400],
    ['Clean Architecture Pocket', 'Architettura software essenziale', 3600],
  ],
  FOOD: [
    ['Caffe Arabica Reserve', 'Chicchi arabica monorigine 1kg', 2900],
    ['Miele Alpino Bio', 'Miele biologico di montagna', 1600],
    ['Pesto Genovese DOP', 'Pesto artigianale basilico DOP', 1200],
    ['Riserva Pasta Box', 'Pasta artigianale mista 3kg', 2100],
    ['Aceto Balsamico 12', 'Condimento balsamico affinato', 3400],
  ],
  BEAUTY: [
    ['SilkHair Repair Mask', 'Maschera capelli nutriente', 2400],
    ['Mineral SPF 50', 'Protezione solare minerale viso', 2800],
    ['NightPeptide Serum', 'Siero notte peptidi e niacinamide', 3900],
    ['Velvet Hand Cream', 'Crema mani barriera', 1200],
    ['CleanBrush Set', 'Set pennelli make-up vegan', 3500],
  ],
  TOYS: [
    ['RoboKit Explorer', 'Kit robotica educativa', 8900],
    ['Puzzle World 3000', 'Puzzle illustrato grande formato', 2900],
    ['MiniLab Chemistry', 'Laboratorio chimica per ragazzi', 4900],
    ['WoodCity Rails', 'Treno in legno modulare', 5900],
    ['Drone Junior Safe', 'Mini drone indoor protetto', 6900],
  ],
  OTHER: [
    ['NotePro A5', 'Taccuino premium puntinato', 1900],
    ['TravelSafe Organizer', 'Organizer viaggio RFID', 2900],
    ['PhotoFrame Cloud', 'Cornice digitale Wi-Fi', 9900],
    ['DeskMat Studio', 'Tappetino scrivania grande', 2400],
    ['KeyFinder Duo', 'Localizzatori Bluetooth coppia', 3900],
  ],
};

const REVIEW_TITLES = [
  'Ottimo acquisto',
  'Molto meglio del previsto',
  'Qualita convincente',
  'Buon rapporto qualita prezzo',
  'Arrivato perfetto',
  'Prodotto consigliato',
];

const REVIEW_BODIES = [
  'Uso il prodotto da alcuni giorni e la qualita percepita e alta. La descrizione e coerente con cio che arriva.',
  'Consegna rapida, confezione curata e prestazioni solide. Lo ricomprerei senza problemi.',
  'Materiali buoni e dettagli ben rifiniti. Ho apprezzato soprattutto la facilita di utilizzo.',
  'Esperienza positiva: prezzo corretto, prodotto stabile e assistenza chiara nelle informazioni.',
  'Il prodotto risponde alle aspettative e si integra bene nella routine quotidiana.',
];

function pick(arr, index) {
  return arr[index % arr.length];
}

function categoryColor(category) {
  const colors = {
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
  return colors[category] ?? '#475569';
}

function categoryBrand(category, index) {
  const brands = {
    TECHNOLOGY: ['ThinkTech', 'Aurora', 'NovaLab', 'PixelView'],
    HOME: ['CasaFlow', 'KitchenLab', 'PureHome', 'Luma'],
    CLOTHING: ['UrbanWarm', 'AeroFit', 'DenimFlex', 'CityStep'],
    SPORTS: ['RunPeak', 'TrailPack', 'CoreSport', 'CycleGuard'],
    BOOKS: ['CodePress', 'MindWorks', 'UX Studio', 'DataCraft'],
    FOOD: ['GustoBox', 'TerraBuona', 'Riserva Italia', 'BioCollina'],
    BEAUTY: ['GlowLab', 'SilkCare', 'MineralSkin', 'Velvet'],
    TOYS: ['BrickWorld', 'RoboKit', 'WoodCity', 'MiniLab'],
    OTHER: ['Moleskine', 'TravelSafe', 'DeskStudio', 'CloudFrame'],
  };
  return pick(brands[category] ?? brands.OTHER, index);
}

function categorySubcategory(category, index) {
  const subcategories = SUBCATEGORIES[category] ?? SUBCATEGORIES.OTHER;
  return subcategories[index % subcategories.length][0];
}

function categoryFeatures(product, index) {
  return [
    `${product.name} selezionato per la categoria ${product.category.toLowerCase()}`,
    'Scheda prodotto completa con gallery e dettagli tecnici',
    'Spedizione rapida e assistenza ThinkShop inclusa',
    index % 2 === 0 ? 'Ideale per uso quotidiano e regalo' : 'Configurazione curata per utenti esigenti',
  ];
}

function categorySpecifications(product, index) {
  const common = [
    ['Marca', product.brand],
    ['Categoria', product.category],
    ['Condizione', 'Nuovo'],
  ];
  const byCategory = {
    TECHNOLOGY: [
      ['Display', index % 2 === 0 ? 'AMOLED / IPS premium' : '4K HDR'],
      ['Memoria', `${8 + (index % 5) * 4}GB`],
      ['Connettivita', 'Wi-Fi, Bluetooth, USB-C'],
    ],
    HOME: [
      ['Potenza', `${800 + (index % 5) * 300}W`],
      ['Materiale', 'Acciaio e polimeri rinforzati'],
      ['Controllo smart', index % 2 === 0 ? 'Si' : 'No'],
    ],
    CLOTHING: [
      ['Vestibilita', index % 2 === 0 ? 'Regular fit' : 'Slim fit'],
      ['Materiale', 'Tessuto tecnico / cotone premium'],
      ['Taglie', 'S-XXL'],
    ],
    SPORTS: [
      ['Uso', 'Allenamento e outdoor'],
      ['Peso', `${200 + index * 12}g`],
      ['Garanzia', '2 anni'],
    ],
    BOOKS: [
      ['Pagine', `${220 + index * 18}`],
      ['Lingua', 'Italiano'],
      ['Formato', 'Copertina flessibile'],
    ],
    FOOD: [
      ['Origine', 'Italia'],
      ['Peso netto', `${250 + index * 50}g`],
      ['Conservazione', 'Luogo fresco e asciutto'],
    ],
    BEAUTY: [
      ['Tipo pelle', 'Tutti i tipi'],
      ['Formato', `${30 + index * 5}ml`],
      ['Dermatologicamente testato', 'Si'],
    ],
    TOYS: [
      ['Eta consigliata', `${6 + (index % 6)}+`],
      ['Pezzi', `${120 + index * 25}`],
      ['Batterie', index % 2 === 0 ? 'Non incluse' : 'Incluse'],
    ],
    OTHER: [
      ['Materiale', 'Materiali premium'],
      ['Formato', 'Standard'],
      ['Garanzia', '2 anni'],
    ],
  };
  return [...(byCategory[product.category] ?? []), ...common];
}

function buildProductCatalog() {
  const generated = [...PRODUCTS];
  for (const category of CATEGORIES) {
    for (const [variantIndex, [name, title, price]] of CATEGORY_VARIANTS[category].entries()) {
      if (generated.length >= 50) break;
      const brand = categoryBrand(category, variantIndex);
      generated.push({
        name,
        title,
        brand,
        category,
        subcategory: categorySubcategory(category, variantIndex),
        price,
        originalPrice: Math.round(price * (1.18 + (variantIndex % 3) * 0.07)),
        stock: 18 + ((generated.length + variantIndex) % 90),
        color: categoryColor(category),
        description: `${title} pensato per chi cerca una soluzione affidabile nella categoria ${category.toLowerCase()}.`,
        features: categoryFeatures({ name, category }, variantIndex),
        specifications: categorySpecifications({ name, brand, category }, variantIndex),
      });
    }
  }

  let fillerIndex = 0;
  while (generated.length < 50) {
    const base = PRODUCTS[fillerIndex % PRODUCTS.length];
    const variant = Math.floor(fillerIndex / PRODUCTS.length) + 2;
    generated.push({
      ...base,
      name: `${base.name} Edition ${variant}`,
      title: `${base.title} - edizione ${variant}`,
      price: Math.round(base.price * (0.86 + (variant % 4) * 0.06)),
      originalPrice: Math.round(base.originalPrice * (0.9 + (variant % 3) * 0.05)),
      stock: 20 + ((fillerIndex * 7) % 110),
      features: categoryFeatures({ name: base.name, category: base.category }, variant),
      specifications: categorySpecifications(base, variant),
    });
    fillerIndex++;
  }

  return generated.slice(0, 50);
}

function buildSeedUsers() {
  const normalUsers = [...USERS];
  for (let index = 0; normalUsers.length < 30; index++) {
    const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
    const lastName = LAST_NAMES[index % LAST_NAMES.length];
    normalUsers.push([
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${index + 1}.demo@thinkshop.dev`,
      firstName,
      lastName,
      'Demo1234!',
    ]);
  }

  return {
    normalUsers,
    employee: ['employee.demo@thinkshop.dev', 'Elena', 'Employee', 'Employee1234!'],
  };
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(10 + (days % 8), 15 + (days % 30), 0, 0);
  return date;
}

function escapeSvgText(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };
    return entities[char];
  });
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function imagePath(product, index) {
  return `/uploads/thinkshop/${slug(product.name)}-${index + 1}.svg`;
}

async function writeProductImage(product, index) {
  const uploadsDir = join(process.cwd(), 'uploads', 'thinkshop');
  await mkdir(uploadsDir, { recursive: true });

  const fileName = `${slug(product.name)}-${index + 1}.svg`;
  const labels = ['Hero view', 'Detail view', 'Lifestyle view'];
  const opacity = [0.16, 0.22, 0.28][index] ?? 0.16;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640" viewBox="0 0 960 640" role="img" aria-label="${escapeSvgText(product.title)}">
  <rect width="960" height="640" fill="#f8fafc"/>
  <rect x="72" y="64" width="816" height="512" rx="36" fill="${product.color}" opacity="${opacity}"/>
  <circle cx="${index === 1 ? 220 : 760}" cy="158" r="86" fill="${product.color}" opacity="0.25"/>
  <rect x="118" y="386" width="${index === 2 ? 610 : 720}" height="42" rx="21" fill="${product.color}" opacity="0.22"/>
  <rect x="118" y="456" width="${index === 2 ? 430 : 520}" height="32" rx="16" fill="${product.color}" opacity="0.16"/>
  <text x="118" y="256" fill="#0f172a" font-family="Arial, sans-serif" font-size="50" font-weight="700">${escapeSvgText(product.name)}</text>
  <text x="118" y="318" fill="${product.color}" font-family="Arial, sans-serif" font-size="28" font-weight="700">${escapeSvgText(labels[index] ?? labels[0])}</text>
  <text x="118" y="354" fill="#334155" font-family="Arial, sans-serif" font-size="22">${escapeSvgText(product.brand)} / ${escapeSvgText(product.category)}</text>
</svg>`;

  await writeFile(join(uploadsDir, fileName), svg, 'utf8');
}

async function writeHeroImage(slug, title, color) {
  const uploadsDir = join(process.cwd(), 'uploads', 'thinkshop', 'heroes');
  await mkdir(uploadsDir, { recursive: true });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="720" viewBox="0 0 1440 720" role="img" aria-label="${escapeSvgText(title)}">
  <rect width="1440" height="720" fill="#0f172a"/>
  <rect x="80" y="70" width="1280" height="580" rx="44" fill="${color}" opacity="0.22"/>
  <circle cx="1120" cy="190" r="190" fill="${color}" opacity="0.36"/>
  <circle cx="1030" cy="520" r="120" fill="#ffffff" opacity="0.10"/>
  <rect x="140" y="430" width="520" height="44" rx="22" fill="#ffffff" opacity="0.18"/>
  <rect x="140" y="504" width="380" height="34" rx="17" fill="#ffffff" opacity="0.12"/>
  <text x="140" y="272" fill="#ffffff" font-family="Arial, sans-serif" font-size="68" font-weight="800">${escapeSvgText(title)}</text>
  <text x="142" y="336" fill="#f8fafc" font-family="Arial, sans-serif" font-size="30" font-weight="600">ThinkShop curated category</text>
</svg>`;

  await writeFile(join(uploadsDir, `${slug}.svg`), svg, 'utf8');
}

async function cleanupDemoData(client) {
  await client.query('BEGIN');
  try {
    const demoProducts = await client.query(
      `SELECT id FROM products WHERE "imagePath" LIKE '/uploads/demo/%' OR "imagePath" LIKE '/uploads/thinkshop/%'`
    );
    const demoProductIds = demoProducts.rows.map((row) => row.id);

    if (demoProductIds.length > 0) {
      await client.query('DELETE FROM product_reviews WHERE product_id = ANY($1::text[])', [
        demoProductIds,
      ]);
      await client.query('DELETE FROM order_items WHERE product_id = ANY($1::text[])', [
        demoProductIds,
      ]);
      await client.query(
        'DELETE FROM orders WHERE id NOT IN (SELECT DISTINCT order_id FROM order_items)'
      );
      await client.query('DELETE FROM products WHERE id = ANY($1::text[])', [demoProductIds]);
    }

    await client.query('UPDATE products SET subcategory_id = NULL');
    await client.query('DELETE FROM product_subcategories');

    const seedUsers = buildSeedUsers();
    const demoEmails = [
      ...seedUsers.normalUsers.map(([email]) => email),
      seedUsers.employee[0],
    ];
    await client.query('DELETE FROM product_reviews WHERE user_id IN (SELECT id FROM users WHERE email = ANY($1::text[]))', [
      demoEmails,
    ]);
    await client.query('DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE "userId" IN (SELECT id FROM users WHERE email = ANY($1::text[])))', [
      demoEmails,
    ]);
    await client.query('DELETE FROM orders WHERE "userId" IN (SELECT id FROM users WHERE email = ANY($1::text[]))', [
      demoEmails,
    ]);
    await client.query(
      `DELETE FROM users
       WHERE email = ANY($1::text[])
          OR email LIKE '%.demo@thinkshop.dev'
          OR email = 'employee.demo@thinkshop.dev'`,
      [demoEmails]
    );

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}

async function insertSubcategories(client) {
  const rowsBySlug = new Map();

  for (const category of CATEGORIES) {
    const entries = SUBCATEGORIES[category] ?? [];
    for (const [index, [slugValue, label, subtitle]] of entries.entries()) {
      const id = randomUUID();
      const color = categoryColor(category);
      await writeHeroImage(slugValue, label, color);
      const result = await client.query(
        `INSERT INTO product_subcategories (id, category, slug, label, hero_title, hero_subtitle, hero_image_path, sort_order, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())
         RETURNING id, slug`,
        [
          id,
          category,
          slugValue,
          label,
          label,
          subtitle,
          `/uploads/thinkshop/heroes/${slugValue}.svg`,
          index,
        ]
      );
      rowsBySlug.set(result.rows[0].slug, result.rows[0].id);
    }
  }

  for (const category of CATEGORIES) {
    await writeHeroImage(CATEGORY_SLUGS[category] ?? category.toLowerCase(), category, categoryColor(category));
  }

  return rowsBySlug;
}

async function insertProduct(client, product, index, subcategoryIds) {
  const id = randomUUID();
  const paths = [0, 1, 2].map((imageIndex) => imagePath(product, imageIndex));
  await Promise.all(paths.map((_, imageIndex) => writeProductImage(product, imageIndex)));

  const subcategoryId = subcategoryIds.get(product.subcategory);

  await client.query(
    `INSERT INTO products (id, title, name, description, brand, category, subcategory_id, "priceInCents", original_price_in_cents, "imagePath", "imagePaths", "stock_quantity", "isAvailableForPurchase", "createdAt", "updatedAt")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::text[],$12,true,NOW(),NOW())`,
    [
      id,
      product.title,
      product.name,
      product.description,
      product.brand,
      product.category,
      subcategoryId ?? null,
      product.price,
      product.originalPrice,
      paths[0],
      paths,
      product.stock,
    ]
  );

  for (const [imageIndex, path] of paths.entries()) {
    await client.query(
      `INSERT INTO product_images (id, product_id, url, alt_text, sort_order, is_primary, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())`,
      [
        randomUUID(),
        id,
        path,
        `${product.title} - immagine ${imageIndex + 1}`,
        imageIndex,
        imageIndex === 0,
      ]
    );
  }

  for (const [featureIndex, feature] of product.features.entries()) {
    await client.query(
      `INSERT INTO product_features (id, product_id, text, sort_order, created_at, updated_at)
       VALUES ($1,$2,$3,$4,NOW(),NOW())`,
      [randomUUID(), id, feature, featureIndex]
    );
  }

  for (const [specIndex, [label, value]] of product.specifications.entries()) {
    await client.query(
      `INSERT INTO product_specifications (id, product_id, label, value, sort_order, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,NOW(),NOW())`,
      [randomUUID(), id, label, value, specIndex]
    );
  }

  return {
    id,
    index,
    price: product.price,
    title: product.title,
    imagePath: paths[0],
  };
}

async function insertUser(client, [email, firstName, lastName, password], options = {}) {
  const passwordHash = await argon2.hash(password);
  const result = await client.query(
    `INSERT INTO users (id, email, hash, "is_admin", "is_employee", "can_create_cart", "can_order_products", "preferred_locale", "first_name", "last_name", "created_at", "updated_at")
     VALUES ($1,$2,$3,false,$4,true,true,'it',$5,$6,NOW(),NOW())
     RETURNING id`,
    [randomUUID(), email, passwordHash, Boolean(options.isEmployee), firstName, lastName]
  );
  return result.rows[0].id;
}

async function insertOrder(client, userId, products, dayOffset) {
  const createdAt = daysAgo(dayOffset);
  const orderId = randomUUID();
  const total = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

  await client.query(
    `INSERT INTO orders (id, "userId", status, "totalPriceInCents", "createdAt", "updatedAt")
     VALUES ($1,$2,'PAID',$3,$4,$4)`,
    [orderId, userId, total, createdAt]
  );

  for (const item of products) {
    await client.query(
      `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price_in_cents, line_total_in_cents, product_title_snapshot, product_image_snapshot, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        randomUUID(),
        orderId,
        item.id,
        item.quantity,
        item.price,
        item.price * item.quantity,
        item.title,
        item.imagePath,
        createdAt,
      ]
    );
  }
}

async function insertReviews(client, userIds, products) {
  let inserted = 0;
  for (const [userIndex, userId] of userIds.entries()) {
    for (let offset = 0; offset < 3; offset++) {
      const product = products[(userIndex + offset * 2) % products.length];
      await client.query(
        `INSERT INTO product_reviews (id, product_id, user_id, rating, title, body, status, is_verified_purchase, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,'PUBLISHED',$7,$8,$8)
         ON CONFLICT (user_id, product_id) DO UPDATE SET
           rating = EXCLUDED.rating,
           title = EXCLUDED.title,
           body = EXCLUDED.body,
           status = 'PUBLISHED',
           is_verified_purchase = EXCLUDED.is_verified_purchase,
           updated_at = EXCLUDED.updated_at`,
        [
          randomUUID(),
          product.id,
          userId,
          4 + ((userIndex + offset) % 2),
          pick(REVIEW_TITLES, userIndex + offset),
          pick(REVIEW_BODIES, userIndex + offset),
          offset < 2,
          daysAgo(userIndex * 3 + offset + 2),
        ]
      );
      inserted++;
    }
  }
  return inserted;
}

async function main() {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  console.log('Connesso al DB.');
  const seedProducts = buildProductCatalog();
  const seedUsers = buildSeedUsers();

  console.log('\nPulisco vecchi dati demo ThinkShop...');
  await cleanupDemoData(client);

  console.log('\nInserisco sottocategorie ThinkShop e hero immagini...');
  const subcategoryIds = await insertSubcategories(client);
  console.log(`  OK ${subcategoryIds.size} sottocategorie inserite`);

  console.log(`\nInserisco ${seedProducts.length} prodotti ThinkShop con gallery, feature e specifiche...`);
  const productRows = [];
  for (const [index, product] of seedProducts.entries()) {
    productRows.push(await insertProduct(client, product, index, subcategoryIds));
  }
  console.log(`  OK ${productRows.length} prodotti inseriti`);

  console.log('\nInserisco 30 utenti demo autenticati + 1 employee...');
  const userIds = [];
  for (const user of seedUsers.normalUsers) {
    userIds.push(await insertUser(client, user));
  }
  const employeeId = await insertUser(client, seedUsers.employee, { isEmployee: true });
  console.log(`  OK ${userIds.length} utenti normali inseriti`);
  console.log(`  OK 1 employee inserito (${employeeId})`);

  console.log('\nInserisco almeno 5 ordini multi-prodotto per ogni utente normale...');
  let orderCount = 0;
  for (const [userIndex, userId] of userIds.entries()) {
    for (let orderIndex = 0; orderIndex < 5; orderIndex++) {
      const first = productRows[(userIndex + orderIndex) % productRows.length];
      const second = productRows[(userIndex + orderIndex + 4) % productRows.length];
      const third = productRows[(userIndex + orderIndex + 8) % productRows.length];
      await insertOrder(
        client,
        userId,
        [
          { ...first, quantity: 1 + ((userIndex + orderIndex) % 2) },
          { ...second, quantity: 1 },
          ...(orderIndex % 2 === 0 ? [{ ...third, quantity: 2 }] : []),
        ],
        userIndex * 9 + orderIndex * 11 + 1
      );
      orderCount++;
    }
  }
  console.log(`  OK ${orderCount} ordini multi-prodotto inseriti`);

  console.log('\nInserisco recensioni utente reali...');
  const reviewCount = await insertReviews(client, userIds, productRows);
  console.log(`  OK ${reviewCount} recensioni inserite`);

  const visibleProducts = await client.query(
    `SELECT COUNT(*)::int AS count
     FROM products
     WHERE "isAvailableForPurchase" = true AND stock_quantity > 0`
  );
  const demoOrderCheck = await client.query(
    `SELECT COUNT(*)::int AS users_with_five_orders
     FROM (
       SELECT "userId"
       FROM orders
       WHERE "userId" = ANY($1::text[])
       GROUP BY "userId"
       HAVING COUNT(*) >= 5
     ) checked_users`,
    [userIds]
  );
  console.log(`\nVerifica catalogo pubblico: ${visibleProducts.rows[0].count} prodotti visibili.`);
  console.log(
    `Verifica ordini utenti: ${demoOrderCheck.rows[0].users_with_five_orders}/${userIds.length} utenti con almeno 5 ordini.`
  );

  await client.end();
  console.log('\nSeed ThinkShop completato con successo.');
}

try {
  await main();
} catch (err) {
  console.error('Errore seed ThinkShop:', err);
  process.exit(1);
}
