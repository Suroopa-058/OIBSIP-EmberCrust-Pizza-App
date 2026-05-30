

# 🔥 EmberCrust — Full Stack Pizza Delivery App

## STEP 1 — Open in VS Code
After extracting the zip, open the embercrust/ folder in VS Code.

---

## STEP 2 — Setup Frontend

Open Terminal 1 in VS Code:

cd embercrust-frontend
npm create vite@latest . -- --template react
npm install
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

---

## STEP 3 — Setup Backend

Open Terminal 2 in VS Code:

cd embercrust-backend
npm init -y
npm install express cors dotenv mongoose bcryptjs jsonwebtoken uuid
npm install -D nodemon

---

## STEP 4 — Run Both

Terminal 1 (Frontend):
cd embercrust-frontend
npm run dev
→ http://localhost:5173

Terminal 2 (Backend):
cd embercrust-backend
node server.js
→ http://localhost:5000

---

## Pages
/ → LandingPage
/menu → MenuPage
/cart → CartPage
/order/:id → OrderTrackPage

## API Routes
GET  /api/pizzas
POST /api/orders
POST /api/auth/login
POST /api/auth/register
POST /api/coupons/validate
