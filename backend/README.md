# Ember & Vine API

Laravel 11 + Sanctum + MySQL API backend for the `front end` React app in
this same `full-stack/ember-vine-react` folder. Implements the exact
contract the frontend's `src/lib/api.js` already expects:

| Method | Endpoint            | Auth | Notes                                   |
|--------|---------------------|------|------------------------------------------|
| POST   | /api/register       | –    | `{name, email, password}` → `{user, token}` |
| POST   | /api/login          | –    | `{email, password}` → `{user, token}`    |
| POST   | /api/logout         | ✔    | revokes the current token                |
| GET    | /api/me             | ✔    | current user                             |
| GET    | /api/menu-items     | –    | optional `?search=&category=`            |
| POST   | /api/orders         | ✔    | `{items:[{menu_item_id, quantity}]}` → order (server computes prices) |
| GET    | /api/orders         | ✔    | current user's orders                    |
| POST   | /api/reservations   | ✔    | booking, `booking_ref` generated server-side |
| GET    | /api/reservations   | ✔    | current user's reservations              |
| GET    | /api/admin/stats           | ✔ admin | dashboard summary counts (now includes total_menu_items) |
| GET    | /api/admin/orders          | ✔ admin | every customer's orders                 |
| PATCH  | /api/admin/orders/{id}     | ✔ admin | `{status}` → update an order's status   |
| GET    | /api/admin/reservations    | ✔ admin | every customer's reservations           |
| PATCH  | /api/admin/reservations/{id} | ✔ admin | `{status}` → confirm/cancel a booking  |
| GET    | /api/admin/menu-items       | ✔ admin | every dish (admin's own list, separate from the public one) |
| POST   | /api/admin/menu-items       | ✔ admin | `{name, category, price, description?, photo_url?, featured?}` → add a dish |
| PUT    | /api/admin/menu-items/{id}  | ✔ admin | same body (all fields optional) → edit a dish |
| DELETE | /api/admin/menu-items/{id}  | ✔ admin | remove a dish (past orders keep their name/price snapshot) |
| GET    | /api/admin/customers        | ✔ admin | every registered customer, with order/reservation counts |

## Setup

```bash
cd "back end"
composer install
cp .env.example .env
php artisan key:generate
```

Create the MySQL database (name from `.env`, default `ember_vine`):

```sql
CREATE DATABASE ember_vine CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update `.env` with your MySQL credentials, then:

```bash
php artisan migrate --seed
php artisan serve
```

The API is now at `http://localhost:8000/api`, matching the frontend's
default `VITE_API_URL`.

## Auth

Uses Laravel Sanctum **personal access tokens** (simple Bearer-token API
auth — not the SPA cookie flow, since the frontend sends
`Authorization: Bearer <token>` and stores it in `localStorage`, per
`AuthContext.jsx`). Passwords are hashed with bcrypt.

## Menu seed data

`database/seeders/MenuItemSeeder.php` inserts the 12 dishes from the
frontend's `src/data/menuData.js`, in the same order/ids, so cart and
order behavior is identical whether the API is running or not.

## Admin Panel

`php artisan migrate --seed` also creates a default admin login (via
`AdminUserSeeder`):

- **URL**: `http://localhost:5173/admin/login` (frontend)
- **Email**: `admin@embervine.com`
- **Password**: `admin12345`

Change this password after your first login. An admin is just a regular
`users` row with `is_admin = true` — the `/api/admin/*` routes are
protected by the `admin` middleware (`EnsureUserIsAdmin`), which checks
that flag after Sanctum auth. The admin panel reuses `/api/login`; the
frontend rejects (and immediately revokes the token for) any login
attempt on `/admin/login` where the account isn't flagged as admin.

## Notes

- Order totals (subtotal/tax/total) are always computed server-side from
  the current DB price of each `menu_item_id` — the client only sends
  `{menu_item_id, quantity}` pairs.
- `orders.order_no` and `reservations.booking_ref` are generated on the
  server (e.g. `RSV-482913`).
- CORS is open to `FRONTEND_URL` (`.env`, default `http://localhost:5173`).
