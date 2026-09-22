# 🚜 Agriveer Project Technical Documentation

**Agriveer** is an advanced Peer-to-Peer Agriculture Marketplace connecting farmers across India with verified agricultural equipment rentals (tractors, harvesters, ploughs, crop sprayers) and seasonal farm land leases.

---

## 1. 🏗️ Architecture & Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **React 18 + Vite** | High-performance component-based client application |
| **Styling & Design** | **Tailwind CSS** | Utility-first responsive design & custom design tokens |
| **Motion Physics** | **Framer Motion + GSAP** | Spring hover physics, staggered entrances, split reveals |
| **Backend REST API** | **Node.js + Express** | Production-ready RESTful service running on Port 5000 |
| **Database Store** | **JSON Store (`store.json`)** | Persistent storage for Users, Listings, and Booking Locks |
| **Translation Engine** | **Google Translate API Engine** | 100% full-page instant translation for 9 Indian languages |

---

## 2. 🔒 Security & User Role Authentication Flows

Agriveer enforces a strict role-based gated flow to protect marketplace integrity:

### A. 🌾 Farmer / Renter Role
- **Permissions**: Browse equipment/land, view specs, check verified owner details, book rentals.
- **Gated Auth Flow**:
  - Clicking **`Rent Now ⚡`** on an item when unauthenticated automatically prompts the user to register or login as a **Farmer**.
  - **Saved Registration State**: Pre-populates the farmer's Name, Mobile Phone, 12-Digit Aadhaar Card Number, and Address inside the booking checkout ticket.
  - **`My Rentals` Navbar Option**: Appears in the top navigation bar **ONLY** after successful farmer login.

### B. 🏪 Shopkeeper / Owner Role
- **Permissions**: Publish equipment & farmland for rent, set daily/acre rates, manage listed inventory.
- **Gated Auth Flow**:
  - **`+ List Machine / Land` Button**: Hidden for guests & farmers. Appears in the top navbar and floating action button **ONLY** after logging in as a **Shopkeeper / Owner** (`currentUser.role === 'owner'`).
  - Attempts by unauthenticated users to access listing portals trigger the **Shopkeeper Registration Modal**.

---

## 3. 💾 Backend REST API Reference

The backend API runs on `http://localhost:5000/api` with proxy integration configured in `vite.config.js`.

### Endpoints:

#### `GET /api/health`
- **Response**: `{ "status": "ok", "service": "Agriveer REST API", "version": "1.0.0" }`

#### `GET /api/listings`
- **Response**: Returns JSON array of all active machinery and farmland lease items.

#### `POST /api/listings`
- **Headers**: `Content-Type: application/json`
- **Body**: `{ title, type, category, dailyRate, location, ownerName, ownerPhone, specs, description }`
- **Response**: Creates and saves new listing to persistent database `store.json`.

#### `GET /api/bookings`
- **Response**: Returns JSON array of active bookings.

#### `POST /api/bookings`
- **Headers**: `Content-Type: application/json`
- **Body**: `{ itemId, itemTitle, ownerName, ownerPhone, farmerName, farmerPhone, farmerAadhaar, farmerAddress, totalCost }`
- **Response**: Locks item for active rental period.

#### `DELETE /api/bookings/:id`
- **Response**: Cancels booking agreement and unlocks item for new renters.

#### `POST /api/auth/register`
- **Body**: `{ name, shopName, phone, aadhaar, address, password, role }`
- **Response**: Creates Farmer or Shopkeeper account.

#### `POST /api/auth/login`
- **Body**: `{ phone, password, role }`
- **Response**: Authenticates registered user.

---

## 4. 📁 Project Directory Structure

```
agriveer/
├── package.json                   # Root launcher (concurrently runs frontend & backend)
├── agriveer_project_documentation.md # Technical project documentation
├── backend/                       # Express REST API Server
│   ├── package.json
│   ├── server.js                  # Entry point (Port 5000)
│   └── data/
│       └── store.json             # Persistent DB (Users, Listings, Bookings)
└── frontend/                      # React 18 + Vite + Tailwind CSS Application
    ├── package.json
    ├── vite.config.js             # Vite config with API proxy
    ├── index.html                 # Main HTML with Tailwind & Google Translate
    ├── public/
    │   └── assets/                # HD agricultural imagery
    └── src/
        ├── main.jsx               # React DOM root entry
        ├── App.jsx                # Main application & routing logic
        ├── index.css              # Tailwind CSS directives & root tokens
        ├── services/
        │   └── api.js             # Full-stack REST API client layer
        ├── data/
        │   └── mockData.js        # Baseline listings & translations
        └── components/
            ├── Navbar.jsx         # Authenticated glassmorphic navigation header
            ├── Hero.jsx           # Clean GSAP animated search section
            ├── FilterBar.jsx      # Multi-criteria machinery & land filter bar
            ├── ListingCard.jsx    # Framer Motion animated card & HD photo lightbox
            ├── ListingGrid.jsx    # Staggered entrance listing grid
            ├── AuthModal.jsx      # Gated registration & login modal (Farmer/Owner)
            ├── BookingModal.jsx   # Rental agreement checkout ticket
            ├── ListPropertyModal.jsx # Owner listing publication modal
            ├── EquipmentGuide.jsx # Category quick filter guide
            ├── LanguageBar.jsx    # 9 Indian languages translation dropdown
            └── Footer.jsx         # Footer & helpline information
```

---

## 5. 🛠️ Installation & Launch Guide

### Prerequisites:
- Node.js (v18 or higher)
- npm (v9 or higher)

### Step 1: Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Launch Application
```bash
# Launch Express API Server (Backend)
cd backend
node server.js

# Launch React Vite Dev Server (Frontend in a separate terminal)
cd frontend
npx vite --host 127.0.0.1 --port 5173
```

### Access URLs:
- **Frontend Web App**: `http://127.0.0.1:5173/`
- **Backend API Health Check**: `http://localhost:5000/api/health`
