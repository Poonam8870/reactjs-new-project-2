import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'SQLite (pharma.db)', timestamp: new Date() });
});

// --- 1. PRODUCTS API ---
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY isFeatured DESC, name ASC').all();
    const formatted = products.map(p => ({
      ...p,
      prescriptionRequired: Boolean(p.prescriptionRequired),
      isFeatured: Boolean(p.isFeatured),
      isBestSeller: Boolean(p.isBestSeller),
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const p = req.body;
    const newId = p.id || 'med-' + Date.now();
    const stmt = db.prepare(`
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

    const productRecord = {
      id: newId,
      name: p.name,
      genericName: p.genericName || p.name,
      category: p.category || 'Tablets',
      price: Number(p.price) || 0,
      wholesalePrice: Number(p.wholesalePrice) || Math.round(Number(p.price) * 0.7),
      moq: Number(p.moq) || 1,
      packSize: p.packSize || 'Box / Strip',
      manufacturer: p.manufacturer || 'Sigma Medex Partner',
      prescriptionRequired: p.prescriptionRequired ? 1 : 0,
      stock: Number(p.stock) || 100,
      rating: 4.8,
      reviewsCount: 1,
      isFeatured: p.isFeatured ? 1 : 0,
      isBestSeller: 0,
      image: p.image || '',
      description: p.description || '',
      composition: p.composition || '',
      storage: p.storage || 'Store below 25Â°C.',
      dosage: p.dosage || 'As directed by Physician.',
    };

    stmt.run(productRecord);
    res.status(201).json({ ...productRecord, prescriptionRequired: Boolean(productRecord.prescriptionRequired) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const p = req.body;
    const stmt = db.prepare(`
      UPDATE products SET
        name = COALESCE(@name, name),
        genericName = COALESCE(@genericName, genericName),
        category = COALESCE(@category, category),
        price = COALESCE(@price, price),
        wholesalePrice = COALESCE(@wholesalePrice, wholesalePrice),
        moq = COALESCE(@moq, moq),
        stock = COALESCE(@stock, stock),
        packSize = COALESCE(@packSize, packSize),
        manufacturer = COALESCE(@manufacturer, manufacturer)
      WHERE id = @id
    `);

    stmt.run({
      id,
      name: p.name,
      genericName: p.genericName,
      category: p.category,
      price: p.price !== undefined ? Number(p.price) : null,
      wholesalePrice: p.wholesalePrice !== undefined ? Number(p.wholesalePrice) : null,
      moq: p.moq !== undefined ? Number(p.moq) : null,
      stock: p.stock !== undefined ? Number(p.stock) : null,
      packSize: p.packSize,
      manufacturer: p.manufacturer
    });

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ success: true, deletedId: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 2. ORDERS API (SQLITE) ---
app.get('/api/orders', (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY rowid DESC').all();
    const formatted = orders.map(o => ({
      ...o,
      hasPrescription: Boolean(o.hasPrescription),
      items: JSON.parse(o.items || '[]')
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/user/:email', (req, res) => {
  try {
    const { email } = req.params;
    const orders = db.prepare('SELECT * FROM orders WHERE LOWER(email) = LOWER(?) ORDER BY rowid DESC').all(email);
    const formatted = orders.map(o => ({
      ...o,
      hasPrescription: Boolean(o.hasPrescription),
      items: JSON.parse(o.items || '[]')
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const o = req.body;
    const orderId = o.id || 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const stmt = db.prepare(`
      INSERT INTO orders (
        id, customerName, email, phone, shippingAddress, gstin, company,
        total, paymentMethod, paymentStatus, orderStatus, hasPrescription,
        prescriptionFile, items, date
      ) VALUES (
        @id, @customerName, @email, @phone, @shippingAddress, @gstin, @company,
        @total, @paymentMethod, @paymentStatus, @orderStatus, @hasPrescription,
        @prescriptionFile, @items, @date
      )
    `);

    const orderRecord = {
      id: orderId,
      customerName: o.customerName || 'Direct Buyer',
      email: o.email || '',
      phone: o.phone || '',
      shippingAddress: o.shippingAddress || '',
      gstin: o.gstin || null,
      company: o.company || null,
      total: Number(o.total) || 0,
      paymentMethod: o.paymentMethod || 'UPI / Online Banking',
      paymentStatus: o.paymentMethod === 'Cash on Delivery' ? 'Pending (COD)' : 'Paid',
      orderStatus: 'Confirmed',
      hasPrescription: o.hasPrescription ? 1 : 0,
      prescriptionFile: o.prescriptionFile || null,
      items: typeof o.items === 'string' ? o.items : JSON.stringify(o.items || []),
      date: o.date || new Date().toISOString().split('T')[0]
    };

    stmt.run(orderRecord);
    res.status(201).json({ ...orderRecord, items: JSON.parse(orderRecord.items) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE orders SET orderStatus = ? WHERE id = ?').run(status, id);
    res.json({ success: true, id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 3. B2B INQUIRIES API ---
app.get('/api/inquiries', (req, res) => {
  try {
    const inqs = db.prepare('SELECT * FROM inquiries ORDER BY rowid DESC').all();
    res.json(inqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/inquiries', (req, res) => {
  try {
    const inq = req.body;
    const id = inq.id || 'inq-' + Date.now();
    const stmt = db.prepare(`
      INSERT INTO inquiries (id, productName, buyerName, email, phone, city, country, quantity, message, date, status)
      VALUES (@id, @productName, @buyerName, @email, @phone, @city, @country, @quantity, @message, @date, @status)
    `);

    const record = {
      id,
      productName: inq.productName,
      buyerName: inq.buyerName,
      email: inq.email || '',
      phone: inq.phone,
      city: inq.city || 'Nagpur',
      country: inq.country || 'India',
      quantity: inq.quantity,
      message: inq.message || '',
      date: new Date().toISOString().split('T')[0],
      status: 'New'
    };

    stmt.run(record);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/inquiries/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true, id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 4. PRESCRIPTIONS API ---
app.get('/api/prescriptions', (req, res) => {
  try {
    const rxList = db.prepare('SELECT * FROM prescriptions ORDER BY rowid DESC').all();
    res.json(rxList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/prescriptions', (req, res) => {
  try {
    const rx = req.body;
    const id = rx.id || 'rx-' + Date.now();
    const stmt = db.prepare(`
      INSERT INTO prescriptions (id, fileName, patientName, doctorName, date, status, linkedMedicines, notes)
      VALUES (@id, @fileName, @patientName, @doctorName, @date, @status, @linkedMedicines, @notes)
    `);

    const record = {
      id,
      fileName: rx.fileName,
      patientName: rx.patientName || 'Anonymous',
      doctorName: rx.doctorName || 'Doctor',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Verification',
      linkedMedicines: rx.linkedMedicines || 'General',
      notes: rx.notes || ''
    };

    stmt.run(record);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/prescriptions/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE prescriptions SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true, id, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 5. AUTH API ---
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?) AND password = ?').get(email, password);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register', (req, res) => {
  try {
    const u = req.body;
    const existing = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(u.email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const id = 'user-' + Date.now();
    const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password, role, phone, company, gstin)
      VALUES (@id, @name, @email, @password, @role, @phone, @company, @gstin)
    `);

    const newUser = {
      id,
      name: u.name,
      email: u.email.toLowerCase(),
      password: u.password,
      role: u.role || 'customer',
      phone: u.phone || '',
      company: u.company || '',
      gstin: u.gstin || ''
    };

    stmt.run(newUser);
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 6. ALL TIME MEDEX ENQUIRIES API (with Google Sheets sync) ---
const CONFIG_FILE = fileURLToPath(new URL('./googleSheetConfig.json', import.meta.url));

function getGoogleSheetConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Config read error:', e.message);
  }
  return { recipientEmail: 'salesvitalmedex@gmail.com', webhookUrl: '', sheetName: 'All Time Medex Enquiries' };
}

// POST new Enquiry (saves to SQLite & forwards to Google Sheets)
app.post('/api/enquiries', async (req, res) => {
  try {
    const { name, contact, email, country, enquiryFor } = req.body;

    if (!name || !contact || !email) {
      return res.status(400).json({ error: 'Name, Contact and Email are required.' });
    }

    const id = 'ENQ-' + Date.now();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-IN', { hour12: true });

    let synced = 0;
    const config = getGoogleSheetConfig();

    // Forward to Google Sheets Webhook if provided
    // NOTE: Google Apps Script Web App redirects POST → use GET with query params (most reliable method)
    if (config.webhookUrl) {
      try {
        const payload = {
          id,
          date: dateStr,
          time: timeStr,
          timestamp: `${dateStr} ${timeStr}`,
          name: name.trim(),
          contact: contact.trim(),
          email: email.trim(),
          country: (country || 'India').trim(),
          enquiryFor: (enquiryFor || 'General Medicine Enquiry').trim(),
          recipientEmail: 'salesvitalmedex@gmail.com',
          secretToken: 'ATMSecure2026' // Secure token for Apps Script authentication
        };

        // Google Apps Script redirects POST requests (302), losing the body.
        // Sending as GET with query params is the standard reliable workaround.
        const params = new URLSearchParams(payload);
        const gasUrl = `${config.webhookUrl}?${params.toString()}`;

        const gRes = await fetch(gasUrl, {
          method: 'GET',
          redirect: 'follow'
        });

        if (gRes.ok) {
          synced = 1;
          console.log('[Google Sheets] ✅ Data synced successfully for:', payload.name);
        } else {
          console.warn('[Google Sheets] ⚠️ Sync responded with status:', gRes.status);
        }
      } catch (sheetErr) {
        console.warn('[Google Sheets Sync Error]:', sheetErr.message);
      }
    }

    // The user requested to save ONLY in the Google Sheet and NOT in the website's local database.
    // We construct the record for the response and logging, but we do not insert it into SQLite.
    
    const record = {
      id,
      name: name.trim(),
      contact: contact.trim(),
      email: email.trim(),
      country: (country || 'India').trim(),
      enquiryFor: (enquiryFor || 'General Medicine Enquiry').trim(),
      recipientEmail: 'salesvitalmedex@gmail.com',
      date: dateStr,
      timestamp: `${dateStr} ${timeStr}`,
      syncedToGoogleSheet: synced
    };

    console.log(`[All Time Medex Enquiry Logged]:`, record);

    res.status(201).json({
      success: true,
      message: 'Enquiry received and recorded for salesvitalmedex@gmail.com',
      data: record,
      googleSheetSynced: Boolean(synced)
    });
  } catch (err) {
    console.error('Enquiry error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[All Time Medex Server] running at http://localhost:${PORT}`);
  console.log(`[Database] connected to SQLite at pharma.db`);
});
