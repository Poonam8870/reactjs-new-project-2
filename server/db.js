import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure server directory exists
if (!fs.existsSync(__dirname)) {
  fs.mkdirSync(__dirname, { recursive: true });
}

const dbPath = path.join(__dirname, 'pharma.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

const removeLegacyRemovedProducts = () => {
  const legacyIds = ['med-7', 'med-8'];
  db.prepare('DELETE FROM products WHERE id IN (@id1, @id2)').run({ id1: legacyIds[0], id2: legacyIds[1] });

  const orders = db.prepare('SELECT * FROM orders').all();
  for (const order of orders) {
    try {
      const items = JSON.parse(order.items || '[]');
      const filtered = items.filter(item => !legacyIds.includes(item.id) && !['Fempro Letrozole 2.5mg Tablets', 'Hydrobact Hydroquinone 4% Cream'].includes(item.name));
      if (filtered.length !== items.length) {
        db.prepare('UPDATE orders SET items = ? WHERE id = ?').run(JSON.stringify(filtered), order.id);
      }
    } catch {
      // Ignore malformed order payloads.
    }
  }
};

// 1. Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    genericName TEXT,
    category TEXT,
    price INTEGER NOT NULL,
    wholesalePrice INTEGER,
    moq INTEGER DEFAULT 1,
    packSize TEXT,
    manufacturer TEXT,
    prescriptionRequired INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 100,
    rating REAL DEFAULT 4.8,
    reviewsCount INTEGER DEFAULT 10,
    isFeatured INTEGER DEFAULT 0,
    isBestSeller INTEGER DEFAULT 0,
    image TEXT,
    description TEXT,
    composition TEXT,
    storage TEXT,
    dosage TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customerName TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    shippingAddress TEXT NOT NULL,
    gstin TEXT,
    company TEXT,
    total INTEGER NOT NULL,
    paymentMethod TEXT,
    paymentStatus TEXT,
    orderStatus TEXT DEFAULT 'Confirmed',
    hasPrescription INTEGER DEFAULT 0,
    prescriptionFile TEXT,
    items TEXT NOT NULL, -- JSON string
    date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    productName TEXT NOT NULL,
    buyerName TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    city TEXT,
    country TEXT,
    quantity TEXT NOT NULL,
    message TEXT,
    date TEXT NOT NULL,
    status TEXT DEFAULT 'New'
  );

  CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    email TEXT NOT NULL,
    country TEXT NOT NULL,
    enquiryFor TEXT NOT NULL,
    recipientEmail TEXT DEFAULT 'salesvitalmedex@gmail.com',
    date TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    syncedToGoogleSheet INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS prescriptions (
    id TEXT PRIMARY KEY,
    fileName TEXT NOT NULL,
    patientName TEXT,
    doctorName TEXT,
    date TEXT NOT NULL,
    status TEXT DEFAULT 'Pending Verification',
    linkedMedicines TEXT,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    phone TEXT,
    company TEXT,
    gstin TEXT
  );
`);

removeLegacyRemovedProducts();

// 2. Seed Initial Products if empty
const countProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (countProducts.count === 0) {
  const seedProducts = [
    {
      id: "med-1",
      name: "Zopiclone Tablet 10mg",
      genericName: "Dutasteride 0.5mg",
      category: "Tablets",
      price: 420,
      wholesalePrice: 280,
      moq: 10,
      packSize: "Box of 3 x 10 Tablets",
      manufacturer: "Healing Pharma",
      prescriptionRequired: 1,
      stock: 250,
      rating: 4.8,
      reviewsCount: 38,
      isFeatured: 1,
      isBestSeller: 1,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80",
      description: "Dutaheal (Dutasteride 0.5mg) is a 5-alpha reductase inhibitor used to treat symptoms of benign prostatic hyperplasia (BPH) and male pattern hair loss.",
      composition: "Each film-coated tablet contains: Dutasteride IP 0.5 mg",
      storage: "Store below 30°C in a dry place. Protect from direct sunlight.",
      dosage: "As directed by the Physician.",
    },
    {
      id: "med-2",
      name: "Pregabalin 150mg",
      genericName: "Isotretinoin 20mg",
      category: "Capsules",
      price: 680,
      wholesalePrice: 480,
      moq: 5,
      packSize: "Box of 10 x 10 Softgels",
      manufacturer: "Sun Pharma",
      prescriptionRequired: 1,
      stock: 180,
      rating: 4.9,
      reviewsCount: 64,
      isFeatured: 1,
      isBestSeller: 1,
      image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80",
      description: "AccuRet (Isotretinoin 20mg) soft gelatin capsules for severe, recalcitrant nodular acne unresponsive to conventional systemic antibiotic therapy.",
      composition: "Each soft gelatin capsule contains: Isotretinoin IP 20 mg",
      storage: "Store below 25°C. Protect from moisture and light.",
      dosage: "Strictly as prescribed by a licensed Dermatologist.",
    },
    {
      id: "med-3",
      name: "A RET TRETIGEL 0.1% 20 MG GEL",
      genericName: "Semaglutide 3mg",
      category: "Tablets",
      price: 3450,
      wholesalePrice: 2850,
      moq: 3,
      packSize: "Strip of 10 Sublingual Tablets",
      manufacturer: "Novo Nordisk / Partner",
      prescriptionRequired: 1,
      stock: 90,
      rating: 4.9,
      reviewsCount: 52,
      isFeatured: 1,
      isBestSeller: 1,
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80",
      description: "Semalix (Oral Semaglutide 3mg) is a GLP-1 receptor agonist indicated as an adjunct to diet and exercise to improve glycemic control in adults with type 2 diabetes mellitus.",
      composition: "Each tablet contains: Semaglutide 3 mg with SNAC absorption enhancer",
      storage: "Store in original package between 15°C and 30°C.",
      dosage: "Take on an empty stomach upon waking with a sip of water.",
    },
    {
      id: "med-4",
      name: "Semaglutide Tablets",
      genericName: "Edaravone 30mg / 20ml",
      category: "Injections",
      price: 1850,
      wholesalePrice: 1250,
      moq: 5,
      packSize: "Pack of 2 Ampoules (20ml each)",
      manufacturer: "Intas Pharmaceuticals",
      prescriptionRequired: 1,
      stock: 65,
      rating: 4.7,
      reviewsCount: 19,
      isFeatured: 1,
      isBestSeller: 0,
      image: "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?w=600&auto=format&fit=crop&q=80",
      description: "Eravone (Edaravone) is a potent free-radical neuroprotective antioxidant injection indicated for acute ischemic stroke and amyotrophic lateral sclerosis (ALS).",
      composition: "Each ml contains: Edaravone 1.5 mg, Sterile aqueous base q.s.",
      storage: "Store below 25°C. Do not freeze.",
      dosage: "For Intravenous Infusion only under hospital supervision.",
    },
    {
      id: "med-5",
      name: "Urenone Eplerenone 25 Mg Tablet",
      genericName: "Exemestane 25mg",
      category: "Anti-Cancer",
      price: 2200,
      wholesalePrice: 1650,
      moq: 5,
      packSize: "Box of 30 Film-coated Tablets",
      manufacturer: "Pfizer / Cipla Generic",
      prescriptionRequired: 1,
      stock: 110,
      rating: 4.8,
      reviewsCount: 29,
      isFeatured: 1,
      isBestSeller: 0,
      image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80",
      description: "Aromasin (Exemestane 25mg) is an irreversible steroidal aromatase inactivator used for adjuvant treatment of postmenopausal women with estrogen-receptor positive early breast cancer.",
      composition: "Each film-coated tablet contains: Exemestane 25 mg",
      storage: "Store between 20°C to 25°C. Keep out of reach of children.",
      dosage: "One tablet daily after a meal or as recommended by Oncologist.",
    },
    {
      id: "med-6",
      name: "Doxicip Doxycycline 100mg Tablets",
      genericName: "Doxycycline Hyclate 100mg",
      category: "Antibiotics",
      price: 180,
      wholesalePrice: 95,
      moq: 20,
      packSize: "Strip of 10 Capsules",
      manufacturer: "Cipla Ltd",
      prescriptionRequired: 1,
      stock: 400,
      rating: 4.6,
      reviewsCount: 75,
      isFeatured: 0,
      isBestSeller: 1,
      image: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=600&auto=format&fit=crop&q=80",
      description: "Doxicip is a broad-spectrum tetracycline antibiotic used to treat bacterial pneumonia, acne vulgaris, chlamydia, Lyme disease, and cholera.",
      composition: "Each capsule contains: Doxycycline Hyclate equivalent to Doxycycline 100 mg",
      storage: "Store protected from light and moisture at a temperature not exceeding 30°C.",
      dosage: "Take with a full glass of water. Do not lie down immediately.",
    },
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, name, genericName, category, price, wholesalePrice, moq, packSize,
      manufacturer, prescriptionRequired, stock, rating, reviewsCount, isFeatured,
      isBestSeller, image, description, composition, storage, dosage
    ) VALUES (
      @id, @name, @genericName, @category, @price, @wholesalePrice, @moq, @packSize,
      @manufacturer, @prescriptionRequired, @stock, @rating, @reviewsCount, @isFeatured,
      @isBestSeller, @image, @description, @composition, @storage, @dosage
    )
  `);

  for (const prod of seedProducts) {
    insertProduct.run(prod);
  }
}

// 3. Seed Initial Demo Orders if empty
const countOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get();
if (countOrders.count === 0) {
  const insertOrder = db.prepare(`
    INSERT INTO orders (
      id, customerName, email, phone, shippingAddress, gstin, company, total,
      paymentMethod, paymentStatus, orderStatus, hasPrescription, prescriptionFile,
      items, date
    ) VALUES (
      @id, @customerName, @email, @phone, @shippingAddress, @gstin, @company, @total,
      @paymentMethod, @paymentStatus, @orderStatus, @hasPrescription, @prescriptionFile,
      @items, @date
    )
  `);

  insertOrder.run({
    id: 'ORD-8821',
    customerName: 'Dr. Rajesh Sharma',
    email: 'rajesh@apollohealth.com',
    phone: '+91 9876543210',
    shippingAddress: 'Flat 402, Green Avenue, Ramdaspeth, Nagpur, Maharashtra - 440010',
    gstin: '27AAAAA0000A1Z5',
    company: 'Apollo Clinic & Chemist',
    total: 3960,
    paymentMethod: 'UPI / Online Banking',
    paymentStatus: 'Paid',
    orderStatus: 'Dispatched',
    hasPrescription: 1,
    prescriptionFile: 'Dr_Prescription_Sharma.pdf',
    items: JSON.stringify([
      { id: 'med-1', name: 'Zopiclone Tablet 10mg', quantity: 6, price: 420 }
    ]),
    date: '2026-09-29'
  });

  insertOrder.run({
    id: 'ORD-8822',
    customerName: 'Sanjay Deshmukh',
    email: 'sanjay@citymed.in',
    phone: '+91 9822334455',
    shippingAddress: 'Plot 12, Medical Square, Nagpur - 440009',
    gstin: '27AEPFS7579K1ZW',
    company: 'CityMed Pharmacy',
    total: 480,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending (COD)',
    orderStatus: 'Confirmed',
    hasPrescription: 0,
    prescriptionFile: null,
    items: JSON.stringify([
      { id: 'med-2', name: 'Pregabalin 150mg', quantity: 1, price: 480 }
    ]),
    date: '2026-10-01'
  });
}

// 4. Seed Initial Inquiries if empty
const countInquiries = db.prepare('SELECT COUNT(*) as count FROM inquiries').get();
if (countInquiries.count === 0) {
  const insertInq = db.prepare(`
    INSERT INTO inquiries (
      id, productName, buyerName, email, phone, city, country, quantity, message, date, status
    ) VALUES (
      @id, @productName, @buyerName, @email, @phone, @city, @country, @quantity, @message, @date, @status
    )
  `);

  insertInq.run({
    id: 'inq-101',
    productName: 'A RET TRETIGEL 0.1% 20 MG GEL',
    buyerName: 'Dr. Vivek Mehra',
    email: 'vivek@delhiclinic.com',
    phone: '+91 9811223344',
    city: 'New Delhi',
    country: 'India',
    quantity: '50 Strips',
    message: 'Looking for regular monthly clinic supply with cold-chain shipping.',
    date: '2026-09-28',
    status: 'In Progress'
  });

  insertInq.run({
    id: 'inq-102',
    productName: 'Semaglutide Tablets',
    buyerName: 'Metro Hospital Procurement',
    email: 'procure@metrohospitals.in',
    phone: '+91 9922334455',
    city: 'Mumbai',
    country: 'India',
    quantity: '200 Ampoules',
    message: 'Please send formal GST quote and WHO-GMP batch test certificates.',
    date: '2026-09-30',
    status: 'New'
  });
}

// 5. Seed Users if empty
const countUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (countUsers.count === 0) {
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password, role, phone, company, gstin)
    VALUES (@id, @name, @email, @password, @role, @phone, @company, @gstin)
  `);

  insertUser.run({
    id: 'user-admin',
    name: 'Manoj (Sigma Medex)',
    email: 'admin@sigmamedex.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 8047302413',
    company: 'Sigma Medex Wholesale',
    gstin: '27AEPFS7579K1ZW',
  });

  insertUser.run({
    id: 'user-customer',
    name: 'Dr. Rajesh Sharma',
    email: 'rajesh@apollohealth.com',
    password: 'buyer123',
    role: 'customer',
    phone: '+91 9876543210',
    company: 'Apollo Clinic & Chemist',
    gstin: '27AAAAA0000A1Z5',
  });
}

export default db;
