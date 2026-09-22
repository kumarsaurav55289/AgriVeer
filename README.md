# Agriveer - Smart Agriculture Machinery & Land Rental Platform

Agriveer is a full-stack digital marketplace connecting farmers with farm equipment owners and land lessors across India. It features 100% Kisan Escrow protection, 4-digit Delivery OTP payment release, multi-lingual support, and real-time database synchronization via Supabase PostgreSQL.

---

## 📁 Professional Folder Structure

```
agriveer/
├── backend/                  # Node.js + Express REST API & Database Services
│   ├── server.js             # Express Server Entry Point (Port 5000)
│   ├── package.json          # Backend Dependencies & Scripts
│   └── .env                  # Backend Configuration & API Keys
├── frontend/                 # React 18 + Vite + Tailwind CSS Single Page Application
│   ├── public/               # Assets (Tractors, Harvesters, Land Images)
│   ├── src/                  # Application Source Code
│   │   ├── components/       # Reusable UI Components (Navbar, UserDashboard, BookingModal, AiAssistant, etc.)
│   │   ├── data/             # Translations & Data Constants
│   │   ├── services/         # Supabase Client & REST API Wrappers
│   │   ├── utils/            # Translation & Formatting Utilities
│   │   ├── App.jsx           # Main Application Component & Layout Router
│   │   ├── index.css         # Tailwind CSS & Glassmorphism Styling
│   │   └── main.jsx          # React DOM Mount Entry Point
│   ├── index.html            # Vite HTML Entry Shell
│   ├── vite.config.js        # Vite Bundler Configuration
│   └── package.json          # Frontend Dependencies & Build Scripts
├── package.json              # Root Orchestrator (Runs frontend & backend concurrently)
└── README.md                 # Project Setup & Developer Documentation
```

---

## 🚀 Quick Start Guide

### 1. Install All Dependencies
Install dependencies for root, backend, and frontend with a single command:
```bash
npm run install:all
```

### 2. Run Development Server (Backend + Frontend)
Run both Express API server and Vite dev server concurrently with one command:
```bash
npm run dev
# or
npm start
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🛠️ Individual Service Commands

### Run Only Frontend (Vite + React)
```bash
npm run dev:frontend
```

### Run Only Backend (Express API)
```bash
npm run dev:backend
```

### Production Build (Frontend Output)
```bash
npm run build
```

---

## 🔑 Key Features & Architecture
- **Supabase PostgreSQL Persistence**: All 15 listings, 12 user accounts (2 Shopkeepers, 10 Farmers), and rental agreements save directly to Supabase DB.
- **Kisan Escrow & OTP Safeguard**: 4-digit Delivery OTP unlocks payment upon delivery verification.
- **Kisan AI Assistant**: Floating bottom-right AI Assistant widget (`AiAssistant.jsx`) ready for Gemini / OpenAI API integration.
