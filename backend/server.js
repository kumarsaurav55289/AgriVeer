import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data', 'store.json');

// Helper to read database
function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { users: [], listings: [], bookings: [] };
  }
}

// Helper to write database
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write store.json:', err);
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Agriveer REST API', version: '1.0.0' });
});

// GET all listings
app.get('/api/listings', (req, res) => {
  const db = readData();
  res.json(db.listings);
});

// POST add a new listing (Shopkeeper / Owner)
app.post('/api/listings', (req, res) => {
  const db = readData();
  const newListing = {
    id: 'listing-' + Date.now(),
    ...req.body,
    rating: 5.0,
    isVerified: true
  };
  db.listings.unshift(newListing);
  writeData(db);
  res.status(201).json({ success: true, listing: newListing });
});

// GET all bookings
app.get('/api/bookings', (req, res) => {
  const db = readData();
  res.json(db.bookings);
});

// POST create a booking (locks item)
app.post('/api/bookings', (req, res) => {
  const db = readData();
  const { itemId, itemTitle, itemImage, ownerName, ownerPhone, farmerName, farmerPhone, farmerAadhaar, farmerAddress, totalCost } = req.body;
  
  if (!farmerName || !farmerPhone || !farmerAadhaar || !farmerAddress) {
    return res.status(400).json({ error: 'Please provide all mandatory farmer details.' });
  }

  const newBooking = {
    id: 'booking-' + Date.now(),
    itemId: itemId || ('item-' + Date.now()),
    itemTitle: itemTitle || 'Agricultural Resource',
    itemImage: itemImage || '/assets/tractor.png',
    ownerName: ownerName || 'Verified Owner',
    ownerPhone: ownerPhone || '+91 98765 43210',
    farmerName,
    farmerPhone,
    farmerAadhaar,
    farmerAddress,
    totalCost: totalCost || 1800,
    bookingDate: new Date().toLocaleDateString(),
    status: 'Booked'
  };

  db.bookings.unshift(newBooking);
  writeData(db);
  res.status(201).json({ success: true, booking: newBooking });
});

// DELETE a booking (unlocks item)
app.delete('/api/bookings/:id', (req, res) => {
  const db = readData();
  const bookingId = req.params.id;
  const initialLen = db.bookings.length;
  db.bookings = db.bookings.filter(b => b.id !== bookingId);
  
  if (db.bookings.length === initialLen) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  writeData(db);
  res.json({ success: true, message: 'Booking canceled and item unlocked.' });
});

// POST register user (Farmer or Shopkeeper)
app.post('/api/auth/register', (req, res) => {
  const db = readData();
  const { name, shopName, phone, aadhaar, address, password, role } = req.body;

  if (!name || !phone || !aadhaar || !address || !password) {
    return res.status(400).json({ error: 'Please fill in all mandatory fields.' });
  }

  const newUser = {
    id: 'usr-' + Date.now(),
    name,
    shopName: role === 'owner' ? (shopName || 'Agri Shop') : '',
    phone,
    aadhaar,
    address,
    password,
    role: role === 'owner' ? 'owner' : 'farmer'
  };

  db.users.push(newUser);
  writeData(db);
  res.status(201).json({ success: true, user: newUser });
});

// POST login user
app.post('/api/auth/login', (req, res) => {
  const db = readData();
  const { phone, password, role } = req.body;

  const foundUser = db.users.find(u => u.phone === phone && u.role === (role === 'owner' ? 'owner' : 'farmer'));
  if (foundUser) {
    if (foundUser.password && foundUser.password !== password) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }
    return res.json({ success: true, user: foundUser });
  }

  // Demo fallback
  const demoUser = {
    id: 'usr-demo',
    name: role === 'owner' ? 'Verified Shopkeeper Owner' : 'Verified Farmer Member',
    shopName: role === 'owner' ? 'Agri Equipment Provider' : '',
    phone,
    aadhaar: '1234 5678 9012',
    address: 'Ludhiana, Punjab',
    password,
    role: role === 'owner' ? 'owner' : 'farmer'
  };
  res.json({ success: true, user: demoUser });
});

app.listen(PORT, () => {
  console.log(`🚀 Agriveer Backend API server running on http://localhost:${PORT}`);
});
