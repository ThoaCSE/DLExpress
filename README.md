# Foodie App v5.2

## Architecture

```text
MongoDB :27017          (database)
Backend :8080           (Spring Boot — shared API)
frontend/buyer-app      → localhost:5173  (Customer portal)
frontend/seller-app     → localhost:5174  (Seller portal)
frontend/admin-app      → localhost:5175  (Admin panel)
```

## What's New in v5.2

1. **3 Separate Frontends** — Buyer :5173, Seller :5174, Admin :5175
   - Each has its own `localStorage` scope → no login collision
   - Each validates role on login (wrong role → blocked)

2. **3 Payment Methods** — Cash on Delivery, Card (Razorpay), QR Code
   - `POST /api/buyer/payment/initiate` with method=CASH|CARD|QR
   - CASH: confirmed on delivery, COD reference saved
   - CARD/QR: Razorpay flow (demo auto-verify if no real key)
   - Separate `payments` collection in MongoDB

3. **Database Viewer** (Admin only)
   - Browse users, stores, orders, payments, notifications
   - Full-text search within each collection
   - Live from MongoDB via Spring Boot endpoints

4. **Account Deletion with Verify Checklist**
   - User submits deletion request with reason
   - Admin sees all pending requests
   - `Run Safety Check` verifies: unpaid orders, failed payments
   - Approve only if no open issues (enforced in UI and backend)
   - User notified of outcome via notification system

5. **global: 'window'** in all 3 vite.config.js (fixes SockJS/STOMP in Vite)

## Run

### Step 1 — MongoDB

```bash
mongod
# or if installed as service, it starts automatically
```

### Step 2 — Backend (IntelliJ or terminal)

```bash
cd backend
mvn spring-boot:run
# → http://localhost:8080
# Admin account auto-seeded: admin@foodie.com / Admin@123
```

### Step 2a — Backend in IntelliJ

1. Open the `backend` folder as a Maven project in IntelliJ.
2. Set the Project SDK to JDK 25.
3. Open `backend/src/main/java/com/foodie/FoodieApplication.java`.
4. Click the run icon next to `FoodieApplication`.
5. Confirm the server starts on `http://localhost:8080`.

### Step 3 — 3 Frontend Apps (3 separate terminals)

```bash
# Terminal A — Customer
cd frontend/buyer-app && npm install && npm run dev

# Terminal B — Seller
cd frontend/seller-app && npm install && npm run dev

# Terminal C — Admin
cd frontend/admin-app && npm install && npm run dev
```

### Frontend naming and font baseline

- The three Vite apps now use the same Poppins-based font baseline.
- The shared CSS entry point is `src/index.css` in each frontend app.
- Keep React component names in PascalCase and utility file names in camelCase for consistency.

## URLs

- Customer:  <http://localhost:5173>
- Seller:    <http://localhost:5174>
- Admin:     <http://localhost:5175>

## Admin Credentials

- Email: <admin@foodie.com>
- Password: Admin@123
