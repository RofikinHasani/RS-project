# Ember & Vine — React Version

The React (Vite) frontend for the Ember & Vine restaurant site.
Connected to a real **Laravel API backend** (see the sibling
`ember-vine-api` project) for authentication, menu data, orders,
reservations, and a full **admin dashboard** — with automatic fallback
to local demo data for the public menu if that API isn't running, so
browsing still works standalone.

## Folder structure

```
ember-vine-react/
├─ index.html                Vite entry HTML
├─ package.json
├─ vite.config.js
├─ .env.example               VITE_API_URL (Laravel API base URL)
├─ scripts/
│   └─ download-images.mjs    Downloads dish + gallery photos into public/assets
├─ public/
│   ├─ images/                 hero-bar.jpg (homepage hero background)
│   └─ assets/                 images01.png ... images18.png (downloaded automatically)
└─ src/
    ├─ main.jsx                App entry, mounts React + Router
    ├─ App.jsx                  Route definitions (customer site + /admin/*)
    ├─ lib/
    │   └─ api.js               Fetch wrapper for the Laravel API (auth header, error handling)
    ├─ hooks/
    │   └─ useMenuItems.js      Fetches GET /api/menu-items, falls back to menuData.js
    ├─ data/
    │   └─ menuData.js          Local fallback menu data + dish photo paths
    ├─ context/
    │   ├─ CartContext.jsx      Cart state; checkout calls POST /api/orders
    │   ├─ AuthContext.jsx      Customer login/signup/logout, session in localStorage
    │   └─ AdminAuthContext.jsx Admin login (same /login endpoint, requires is_admin)
    ├─ components/
    │   ├─ Navbar.jsx, Footer.jsx, PageLoader.jsx, BackToTop.jsx
    │   ├─ CartDrawer.jsx       Slide-out cart + invoice/checkout
    │   ├─ Layout.jsx           Wraps every customer page with navbar/footer/cart
    │   ├─ AuthLayout.jsx       Split-screen layout for Login/Signup (customer + admin)
    │   ├─ DishImage.jsx        Dish photo with automatic Unsplash fallback
    │   ├─ RequireAuth.jsx / RequireAdminAuth.jsx  Route guards
    │   └─ admin/
    │       ├─ AdminLayout.jsx   Sidebar + topbar shell for every admin page
    │       └─ StatusBadge.jsx   Colored pill for order/reservation status
    ├─ pages/
    │   ├─ Login.jsx, Signup.jsx, Home.jsx, About.jsx, Contact.jsx
    │   ├─ Menu.jsx, Gallery.jsx          Menu from the API, search + category filter
    │   ├─ Reservation.jsx                Form + confirmation modal → POST /api/reservations
    │   ├─ Orders.jsx                     Customer's own order history
    │   └─ admin/
    │       ├─ AdminLogin.jsx             /admin/login
    │       ├─ AdminOverview.jsx          /admin — stat cards + recent activity
    │       ├─ AdminOrdersPage.jsx        /admin/orders — search, filter, change status
    │       ├─ AdminReservationsPage.jsx  /admin/reservations — search, filter, confirm/cancel
    │       ├─ AdminMenuPage.jsx          /admin/menu — add / edit / delete dishes
    │       └─ AdminCustomersPage.jsx     /admin/customers — registered customers + counts
    └─ styles/
        ├─ style.css, responsive.css      Design system
        ├─ auth.css                       Login/Signup screens + error banners
        └─ admin.css                      Admin dashboard (sidebar, tables, badges, modal)
```

## How to run

You need [Node.js](https://nodejs.org) 18+ installed.

```bash
cd ember-vine-react
npm install
npm run dev
```

Then open the local address it prints (usually `http://localhost:5173`).

### Connecting to the Laravel API

By default the frontend talks to `http://localhost:8000/api` (see
`.env.example` → copy it to `.env` to change this). Set up and run the
`ember-vine-api` project (its own README has the steps), then:

```bash
php artisan serve   # in ember-vine-api
npm run dev          # in ember-vine-react
```

**If the API isn't running**, the public menu still shows (falls back
to `src/data/menuData.js`), but login/signup, checkout, reservations,
and the whole admin panel need the backend — they'll show a "Could not
reach the server" error until it's running.

### About the photos (`public/assets`)

The dish + gallery photos aren't stored in the zip. `npm install`
automatically runs `scripts/download-images.mjs`, saving each one as
`public/assets/images01.png` through `images18.png`. Needs internet the
first time; safe to re-run with `npm run images:download`. If a photo
fails to download or is corrupted, `DishImage.jsx` swaps it for its
Unsplash URL at runtime — you should never see a broken image icon.

## Build for production

```bash
npm run build
npm run preview
```

## Customer flow: Login / Signup / Checkout

Browsing (Home, About, Menu, Gallery, Reservation, Contact) is open to
everyone. Signing in is only required to **check out the cart** or
**submit the reservation form** — you're sent to `/login`, and after
signing in (or creating an account) you're returned to finish what you
were doing. Auth is real (Sanctum tokens, hashed passwords in MySQL),
cached in `localStorage` so a refresh keeps you signed in.

## Admin dashboard

Visit `http://localhost:5173/admin/login`. This is a **separate login
and session** from the customer one — an admin is just a `users` row
with `is_admin = true` (seeded by default, see the backend README for
the default credentials). It has its own layout (dark sidebar, no
customer navbar/footer) with five sections:

- **Dashboard** (`/admin`) — stat cards (customers, orders, revenue,
  today's orders, reservations, menu items) + the 5 most recent orders
  and upcoming reservations.
- **Orders** (`/admin/orders`) — every order, searchable by order
  number/customer, filterable by status, with a status dropdown per
  row (placed → preparing → completed / cancelled) that saves
  immediately.
- **Reservations** (`/admin/reservations`) — every booking, searchable,
  filterable, confirm/cancel per row.
- **Menu Items** (`/admin/menu`) — add, edit, or delete dishes in a
  modal form (name, category, price, description, photo URL, featured
  toggle). Changes here show up on the public Menu/Home pages
  immediately via `GET /api/menu-items`.
- **Customers** (`/admin/customers`) — every registered customer with
  their order and reservation counts.

**The data loop is live end to end**: a customer placing an order on
the public site (`POST /api/orders`) or booking a table
(`POST /api/reservations`) shows up in the admin Orders/Reservations
tables immediately on next load — same MySQL database, no separate
sync step.

## What changed vs. the static HTML version

- Separate `.html` files → React page components + React Router.
- Shared navbar/footer/cart drawer are now components.
- **Menu, auth, orders, and reservations are backed by a real
  Laravel + MySQL API**, with a local fallback for menu browsing only.
- Cart checkout sends `{ menu_item_id, quantity }` pairs to the
  server; prices/subtotal/tax/total are computed server-side.
- Added a full **admin dashboard** (separate login, sidebar layout,
  orders/reservations/menu/customers management).
- Dish/gallery photos live locally in `public/assets/` (auto-downloaded,
  with automatic fallback to Unsplash) instead of being hotlinked.
- Bootstrap is an npm dependency instead of local files.
