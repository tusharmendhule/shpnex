# 🛒 SHPNEX — Modern Full-Stack E-Commerce Platform

Welcome to **SHPNEX**, a highly polished, responsive, and robust full-stack e-commerce application designed to simulate real-world e-commerce powerhouses like Amazon and Flipkart. 

SHPNEX is engineered with a lightning-fast frontend built in **React, Vite, and Tailwind CSS**, combined with an **Express backend powered by MongoDB Atlas** for handling stateful data persistence, user accounts, shopping carts, checkout logic, and a multi-role panel system (User, Seller, and Admin views).

---

## 🌟 Key Features

### 📦 Massive, Dynamic Product Directory
* **1,500+ Realistic Seeded Products**: Generated across **9 distinct e-commerce categories** with high-resolution, valid Unsplash image placeholders, descriptive reviews, real prices, and authentic pricing endings (e.g., `₹99`, `₹49`).
* **9 Dynamic Categories**:
  1. 📱 **Electronics** (Buds, Soundbars, smart hubs, displays, chargers, etc.)
  2. 👟 **Footwear** (Sneakers, runners, boots, loafers, oxfords, etc.)
  3. 👕 **Apparel** (Hoodies, joggers, t-shirts, jackets, chinos, etc.)
  4. 🎒 **Accessories** (Wallets, backpacks, watches, sunglasses, etc.)
  5. 🛋️ **Home & Living** (Chairs, desk lamps, linen, scented candles, diffusers, etc.)
  6. 🧴 **Beauty & Personal Care** (Serums, moisturizers, botanicals, perfumes, face masks, etc.)
  7. ⚽ **Sports & Outdoors** (Dumbbells, camping gear, yoga mats, fitness bottles, etc.)
  8. 📚 **Books & Stationery** (Novels, notebooks, sketchbooks, fountain pens, planners, etc.)
  9. 🍎 **Groceries & Gourmet** (Cold-pressed oils, spice blends, gourmet coffees, organic honey, etc.)

### 👥 Multi-Role User Portals
* **Shopper Experience**: Advanced category filtering, keyword searching, interactive cart management, dynamic checkout sequence, order tracking, and product reviews.
* **Seller Portal (`/seller`)**: Analytics dashboard showcasing total revenue, active listings, order history, inventory status tracking, and forms to add or edit custom products under any category.
* **Admin Dashboard (`/admin`)**: Complete platform administration with order lifecycle management, user directory review, deep analytics charts, and global inventory editing.

### 🎨 Premium UI & Styling
* **Theme Support**: Seamless custom dark mode toggle alongside a clean, crisp light theme.
* **Vibrant Layout**: High-contrast modern grids, smooth micro-interactions via `motion/react`, and responsive bento grids.
* **Shop-First Focus**: The home page opens directly into **Shop by Category** to drive prompt product exploration.

---

## 💻 Tech Stack

* **Frontend**: React (v18), Vite, TypeScript, Tailwind CSS, Lucide Icons, `motion/react` for animations.
* **Backend**: Node.js, Express, TypeScript (`tsx` for live reload, compiled via `esbuild` for production packaging).
* **Database & Persistence**: MongoDB Atlas (populated automatically via automated intelligent seed algorithms to load 1500+ rich entries).
* **Environment Configuration**: Robust environment variable setup for secure back-to-front integrations.

---

## 🚀 Getting Started

### 1. Installation
Install the necessary workspace dependencies:
```bash
npm install
```

### 2. Run in Development
Start the concurrent React-Vite client and Express server:
```bash
npm run dev
```
The application runs locally on **http://localhost:3000**.

### 3. Build & Production Start
Compile both the frontend assets and server bundle into standard production bundles:
```bash
npm run build
npm start
```

---

## 🛠️ Project Structure

```
├── server/
│   ├── config/          # MongoDB & local state configuration
│   ├── controllers/     # Express route controller handlers
│   ├── middleware/      # Auth & security middleware
│   ├── models/          # Database schemas (Mongoose)
│   ├── routes/          # API endpoint declarations
│   └── server.ts        # Custom full-stack Express & Vite dev setup
├── src/
│   ├── components/      # UI components (Hero, Navbar, Footer, Cards, etc.)
│   ├── context/         # React global Context state provider
│   ├── pages/           # Platform views (Home, Shop, Cart, Auth, Admin, Seller)
│   ├── App.tsx          # Main entry route router & layout controller
│   └── main.tsx         # React app bootstrap
├── package.json         # Build & script execution commands
└── README.md            # App overview and documentation
```

---

## 🔐 Credentials for Demo Views
We have simplified authorization so you can explore all features right away. Visit `/auth` to sign in or register:
* **Shopper (User)**: `tusharmendhule1@gmail.com` | Password: `password123`
* **Admin**: `admin@shpnex.com` | Password: `password123`
* **Seller**: Register a new account or utilize standard portal paths to test listing management.
