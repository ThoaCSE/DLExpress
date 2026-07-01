# DLExpress

A full-stack grocery/food delivery platform with three separate role-based frontends, a Spring Boot REST API, and MongoDB Atlas.

## Architecture

```text
MongoDB Atlas  (CatExpress database — cloud hosted)
Backend     :8080           (Spring Boot — shared API for all portals)
buyer-app   → localhost:5173  (Customer portal)
seller-app  → localhost:5174  (Seller / Provider portal)
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

### 1 — Backend

```bash
cd backend
mvn spring-boot:run
# API available at http://localhost:8080
# MongoDB Atlas (CatExpress) connects automatically — no local mongod needed
# Admin account auto-seeded: admin@foodie.com / Admin@123
```

**IntelliJ:** open the `backend/` folder as a Maven project, set SDK to JDK 17+, then run `FoodieApplication`.

### 2 — Frontend (three terminals)

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
├── backend/                        Spring Boot REST API
│   ├── pom.xml                     Maven dependencies (Spring Boot 3, MongoDB, Security, JWT)
│   └── src/main/
│       ├── java/com/foodie/
│       │   ├── FoodieApplication.java        Entry point
│       │   ├── config/
│       │   │   ├── DataSeeder.java           Seeds admin user on startup
│       │   │   ├── GroceriesSeeder.java      Seeds goods from CSV datasets
│       │   │   ├── SecurityConfig.java       JWT filter chain, CORS, public routes
│       │   │   └── WebSocketConfig.java      STOMP/SockJS WebSocket broker config
│       │   ├── controller/
│       │   │   ├── AuthController.java       POST /api/auth/register, /login
│       │   │   ├── FoodItemController.java   GET /foods/** — public goods catalogue
│       │   │   ├── OrderController.java      Buyer order placement & history
│       │   │   ├── StoreController.java      Store listing and detail
│       │   │   ├── PaymentController.java    Payment creation & verification
│       │   │   ├── NotificationController.java  Per-user notifications
│       │   │   ├── AdminController.java      Admin-only: users, stores, orders, stats
│       │   │   └── AccountController.java    Profile update, deletion requests
│       │   ├── entity/                       MongoDB @Document classes
│       │   │   ├── User.java                 → collection: users
│       │   │   ├── Store.java                → collection: stores
│       │   │   ├── FoodItem.java             → collection: goods
│       │   │   ├── Order.java                → collection: orders
│       │   │   ├── Payment.java              → collection: payments
│       │   │   ├── Notification.java         → collection: notifications
│       │   │   ├── CartItem.java             Embedded inside Order
│       │   │   └── UserRole.java             Enum: BUYER | SELLER | ADMIN
│       │   ├── dto/                          Request/Response payload objects
│       │   ├── repository/                   Spring Data MongoRepository interfaces
│       │   ├── security/
│       │   │   ├── JwtUtil.java              Token generation & validation
│       │   │   ├── JwtFilter.java            Per-request token extraction
│       │   │   └── UserDetailsServiceImpl.java  Loads user by email
│       │   ├── service/
│       │   │   ├── AuthService.java          Register/login logic
│       │   │   ├── NotificationService.java  Create & broadcast notifications
│       │   │   ├── TrackingService.java      Order status + ETA updates
│       │   │   └── AccountVerifyService.java  Seller approval workflow
│       │   └── websocket/
│       │       └── TrackingWsController.java  STOMP endpoints for live order tracking
│       └── resources/
│           ├── application.properties        Server port, MongoDB Atlas URI, JWT secret
│           └── datasets/                     CSV files used by GroceriesSeeder
│               ├── BigBasket_preprocessed.csv
│               └── walmart-products.csv
│
└── frontend/
    ├── buyer-app/                  React + Vite — Customer portal (port 5173)
    │   └── src/
    │       ├── api/axios.js        Axios instance with JWT interceptor → :8080
    │       ├── assets/categories.js  Category list for carousels
    │       ├── components/
    │       │   ├── Navbar.jsx      Top nav with cart badge & notification bell
    │       │   ├── Header.jsx      Hero banner on home page
    │       │   ├── FoodDisplay.jsx  Grid of FoodItem cards
    │       │   ├── FoodItem.jsx    Single product card (add to cart)
    │       │   ├── DealsForToday.jsx  Live promo items from DB
    │       │   ├── ExploreMenu.jsx  Category pill filter
    │       │   ├── CategoryCarousel.jsx  Horizontal scroll categories
    │       │   └── Layout.jsx      Wraps pages with Navbar
    │       ├── context/StoreContext.jsx  React context for cart state
    │       ├── pages/
    │       │   ├── HomePage.jsx         Landing page with banner & deals
    │       │   ├── ExplorePage.jsx       Browse all goods with filter
    │       │   ├── StoresPage.jsx        List of all stores
    │       │   ├── StorePage.jsx         Single store menu + cart bar
    │       │   ├── GroceriesPage.jsx     Grocery-specific browse
    │       │   ├── FoodDetailsPage.jsx   Product detail view
    │       │   ├── CartPage.jsx          Shopping cart with grouped markets
    │       │   ├── CheckoutPage.jsx      Address + payment method selection
    │       │   ├── OrdersPage.jsx        Order history (WebSocket live updates)
    │       │   ├── OrderDetailPage.jsx   Per-order status + live tracking
    │       │   ├── NotificationsPage.jsx  Notification inbox (auto-polls 30s)
    │       │   ├── ProfilePage.jsx        View/edit profile, request deletion
    │       │   ├── LoginPage.jsx          Sign in (remembers email)
    │       │   └── RegisterPage.jsx       Register as Customer or Provider
    │       ├── service/foodService.js   Fetch helpers for goods & stores
    │       └── utils/
    │           ├── auth.js              getAuth / setAuth / logout (localStorage)
    │           └── cart.js              Cart read/write (localStorage)
    │
    ├── seller-app/                 React + Vite — Seller / Provider portal (port 5174)
    │   └── src/
    │       ├── api/axios.js        Axios instance → :8080
    │       ├── components/
    │       │   ├── Sidebar.jsx     Left nav (List / Add / Orders / Notifications)
    │       │   ├── Menubar.jsx     Top bar with shop name and logout
    │       │   ├── Navbar.jsx      Alternate top nav
    │       │   └── Layout.jsx      Shell wrapper
    │       ├── pages/
    │       │   ├── SignIn.jsx           Login page (blocks pending accounts)
    │       │   ├── RegisterPage.jsx     Seller registration → pending approval
    │       │   │                        (auto-fills data forwarded from buyer app)
    │       │   ├── DashboardPage.jsx    Store summary stats
    │       │   ├── AddItem.jsx          Form to add new product with image upload
    │       │   ├── ListItem.jsx         Manage inventory: edit / delete items
    │       │   ├── Orders.jsx           Incoming orders (legacy view)
    │       │   ├── OrdersPage.jsx       Incoming orders — update status (auto-polls 30s)
    │       │   ├── NotificationsPage.jsx  Seller notifications (auto-polls 30s)
    │       │   └── ProfilePage.jsx      Seller profile view
    │       └── utils/
    │           ├── auth.js              getAuth / setAuth / logout
    │           └── categories.js        Shared category list for item forms
    │
    └── admin-app/                  React + Vite — Admin panel (port 5175)
        └── src/
            ├── api/axios.js        Axios instance → :8080
            ├── components/
            │   ├── Sidebar.jsx     Left nav (Dashboard / Users / Stores / Orders…)
            │   ├── Navbar.jsx / Topbar.jsx  Top bar
            │   └── Layout.jsx      Shell wrapper
            └── pages/
                ├── LoginPage.jsx           Admin-only login
                ├── DashboardPage.jsx       KPI cards (users, orders, revenue)
                ├── UsersPage.jsx           User list + Pending Sellers approval
                ├── StoresPage.jsx          All stores management
                ├── OrdersPage.jsx          All orders (WebSocket live updates)
                ├── DeletionRequestsPage.jsx  Review account deletion requests
                └── DbViewerPage.jsx        Browse MongoDB collections in-browser
```

## Tech Stack

- **Backend:** Java 17+, Spring Boot 3, Spring Security (JWT), Spring Data MongoDB, Maven, WebSocket (STOMP/SockJS)
- **Frontend:** React 18, Vite, Bootstrap 5, Bootstrap Icons, Axios, React Router v6
- **Database:** MongoDB Atlas (cloud) — database: `CatExpress`
  - `users` — registered customers, sellers, admin
  - `stores` — seller store profiles
  - `goods` — product catalogue (mapped from `FoodItem` entity)
  - `orders` — placed orders
  - `payments` — payment records
  - `notifications` — per-user notification inbox

