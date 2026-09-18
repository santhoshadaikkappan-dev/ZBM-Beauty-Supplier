# ZANDRA BEAUTY MATRIX (ZBM) — USA Private Label Cosmetics

> High-End USA White-Label & Private-Label Cosmetic Formulations Platform

---

## ✦ Overview

**ZANDRA BEAUTY MATRIX (ZBM)** is a B2B wholesale digital catalogue and ordering portal for 202 certified formulations across skincare, haircare, body care, and specialty treatments.

- **US FDA Registered** & **WHO-GMP Certified**
- **ISO 9001:2015** & **FSSAI Certified**
- **Zero Minimum Order Quantity (MOQ)** on sample units
- **Tiered Wholesale Pricing Engine**:
  - Cart > $100: **20% Bulk Discount**
  - Cart > $500: **28% Bulk Discount**
  - Cart == $1,000: **35% Bulk Discount**
  - Cart > $1,000: Direct VIP WhatsApp desk routing
- **Direct WhatsApp Order Formatting**: Real-time order dispatch to trade desk (`+91 9344087944`)
- **Interactive Formulation Viewer**: 202 unique photorealistic WebP product mockups

---

## ✦ Project Structure

```
zbm-catalogue/
├── index.html              # Main single-page application & catalogue interface
├── vercel.json             # Vercel deployment routing configuration
├── .gitignore              # Clean repository ignore file
├── css/
│   └── styles.css          # Anti-gravity dark luxury theme & responsive styles
├── js/
│   ├── app.js              # Catalogue filtering, search, cart & WhatsApp logic
│   ├── auth.js             # Client authentication & modal management
│   └── products-data.js    # Master database of 202 formulations
├── assets/
│   ├── certificates/       # FDA, WHO-GMP, ISO, FSSAI vector badges
│   └── images/
│       ├── brand/          # ZBM logos and emblem assets
│       ├── mockups/        # Base packaging textures
│       └── products/       # 202 unique photorealistic WebP mockups
├── server/
│   ├── server.js           # Node.js / Express authentication backend
│   ├── db.js               # Dual SQLite / MongoDB storage engine
│   └── routes/auth.js      # Bcrypt password hashing & auth API
└── scripts/                # Database build tools & headless canvas generators
```

---

## ✦ Vercel Deployment

This project is configured out-of-the-box for **Vercel**:

1. Import this repository (`ZBM-beauty-supplier`) directly into your Vercel dashboard.
2. Framework Preset: **Other** / **Static HTML**.
3. Root Directory: `./` (leave default).
4. Deploy — all relative paths (`css/styles.css`, `js/app.js`, `assets/...`) resolve immediately.

---

## ✦ Local Development

To run locally with live server or Python:
```bash
# Using Python
python -m http.server 8000

# Or using Node.js backend
cd server
npm install
npm start
```
Open `http://localhost:5000` in your browser.
