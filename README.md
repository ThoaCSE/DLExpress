# DLExpress v6

A full-stack food delivery platform with three separate role-based frontends, a Spring Boot REST API, and MongoDB.

## Architecture

```text
MongoDB     :27017          (database)
Backend     :8080           (Spring Boot — shared API for all portals)
buyer-app   → localhost:5173  (Customer portal)
seller-app  → localhost:5174  (Seller portal)
admin-app   → localhost:5175  (Admin panel)
```

## What's New in v6

1. **Seller Verification Flow**
   - New seller registrations are created with `active=false` pending admin approval
   - Sellers cannot log in until the admin approves their account
   - Admin dashboard shows a live count of pending sellers with one-click Approve/Reject

2. **Redesigned Buyer Login**
   - Reverted to the red-gradient "Welcome Back" header design
   - Added **Remember Me** — saves email to `localStorage` for the next visit

3. **Explore as Default Page**
   - Opening the buyer app now lands on the Explore page
   - Navbar reordered: Explore → Stores → Groceries → Orders → Notifications → Cart

4. **Store Menu Category Filter**
   - Store pages now have a search bar and category pill-filter
   - Categories are derived live from the store's actual inventory
   - Floating checkout bar appears when the cart has items

5. **Live Advertisements**
   - "Deals for Today" section on the home page now fetches real food items from the database
   - Shows actual food photos, names, prices, and category badges
   - Links directly to the food detail page

6. **Seller Portal — Combined Login/Sign-Up**
   - Single page with Login and Sign Up tabs
   - Sign Up shows pending-approval confirmation after submitting
   - Login shows a yellow warning if the account is still pending

7. **Admin — Pending Sellers Panel**
   - Users page defaults to a "Pending Sellers" tab showing cards for every unapproved seller
   - Each card shows name, email, phone, address, and registration date
   - Approve activates the account; Reject permanently removes it

## Features (Cumulative)

| Feature | Description |
|---|---|
| 3 role-based portals | Buyer, Seller, Admin — each with its own `localStorage` scope |
| JWT authentication | Role validated on every login; wrong-role attempts are blocked |
| Cart & Checkout | Session-based cart with qty controls; Cash / Card / QR payment |
| Order tracking | Real-time order status; buyers and sellers see their own orders |
| Food & store browsing | Explore page, category carousel, search, store menus |
| Seller inventory | Add / edit / delete food items with image upload (base64) |
| Account deletion | User requests deletion; admin runs safety check before approving |
| Database viewer | Admin can browse all MongoDB collections with full-text search |
| Notifications | System-generated alerts for order updates and account events |

## Quick Start

### 1 — MongoDB

```bash
mongod
# or start as a system service
```

### 2 — Backend

```bash
cd backend
mvn spring-boot:run
# API available at http://localhost:8080
# Admin account auto-seeded: admin@foodie.com / Admin@123
```

**IntelliJ:** open the `backend/` folder as a Maven project, set SDK to JDK 17+, then run `FoodieApplication`.

### 3 — Frontend (three terminals)

```bash
# Terminal A — Buyer
cd frontend/buyer-app && npm install && npm run dev   # http://localhost:5173

# Terminal B — Seller
cd frontend/seller-app && npm install && npm run dev  # http://localhost:5174

# Terminal C — Admin
cd frontend/admin-app && npm install && npm run dev   # http://localhost:5175
```

## URLs

| Portal | URL | Default credentials |
|---|---|---|
| Buyer | <http://localhost:5173> | Register as a new customer |
| Seller | <http://localhost:5174> | Register → wait for admin approval |
| Admin | <http://localhost:5175> | admin@foodie.com / Admin@123 |

## Project Structure

```text
DLExpress/
├── backend/                  Spring Boot API (Java, MongoDB)
│   └── src/main/java/com/foodie/
│       ├── controller/       REST endpoints
│       ├── entity/           MongoDB documents
│       ├── service/          Business logic
│       └── repository/       Spring Data repositories
├── frontend/
│   ├── buyer-app/            React + Vite — Customer portal
│   ├── seller-app/           React + Vite — Seller portal
│   └── admin-app/            React + Vite — Admin panel
└── README.md
```

## Tech Stack

- **Backend:** Java 17, Spring Boot 3, Spring Security (JWT), MongoDB, Maven
- **Frontend:** React 18, Vite, Bootstrap 5, Bootstrap Icons, Axios, React Router v6
- **Database:** MongoDB (local or Atlas)

