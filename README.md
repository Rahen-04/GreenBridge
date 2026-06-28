# GreenBridge

A farm-to-table marketplace that connects local farmers with consumers. Farmers list products and manage orders; consumers browse, add to cart, and checkout.

**Live demo (frontend only):** [https://Rahen-04.github.io/GreenBridge](https://Rahen-04.github.io/GreenBridge)

> The hosted demo is static. Auth, cart, and orders require the backend running locally (or deployed separately).

## Features

- **Farmers:** Register, add/edit products, manage incoming orders, update order status
- **Consumers:** Browse and search products, view farmers, cart checkout, track orders
- **Shared:** JWT auth, contact form, farmer profiles and reviews (read-only)

## Tech Stack

| Layer    | Technologies |
|----------|--------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Query |
| Backend  | Express, Prisma, SQLite, JWT |

## Prerequisites

- Node.js 18+
- npm

## Getting Started

### 1. Clone and install

```sh
git clone https://github.com/Rahen-04/GreenBridge.git
cd GreenBridge
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-secret-key-change-in-production"
```

### 3. Set up the database

```sh
npm run db:push
```

### 4. Run locally

Start frontend and backend together:

```sh
npm run dev:all
```

Or run them separately:

```sh
npm run dev:server   # API → http://localhost:3001
npm run dev          # Frontend → http://localhost:8080/GreenBridge/
```

Open the app at **http://localhost:8080/GreenBridge/** (note the `/GreenBridge/` path).

## Usage

1. Go to **Account** (`/account`) and register as a **farmer** or **consumer**
2. **Farmers:** Add products from your profile, accept orders, update status  
   `pending → accepted → processing → ready → shipped → delivered`
3. **Consumers:** Browse products, add to cart, checkout (coupon `fresh10` = 10% off)
4. View farmers on the **Farmers** page and contact via the **Contact** form

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:all` | Run frontend + backend |
| `npm run dev` | Frontend only |
| `npm run dev:server` | Backend only |
| `npm run build` | Production build (output: `root/`) |
| `npm run lint` | Run ESLint |
| `npm run db:studio` | Open Prisma Studio |

## API

Base URL (local): `http://localhost:3001/api`

| Route | Purpose |
|-------|---------|
| `/auth` | Register, login, profile |
| `/products` | Product CRUD and listings |
| `/farmers` | Farmer directory and stats |
| `/orders` | Create orders, checkout, status |
| `/cart` | Cart management |
| `/reviews` | Farmer reviews |
| `/contact` | Contact form submissions |

## Deploy

**Frontend (GitHub Pages):**

```sh
npm run build
```

Build output goes to `root/`. Configure GitHub Pages to serve from that folder, or use `gh-pages` with the correct output directory (`root/`, not `dist/`).

**Backend:** Deploy separately (e.g. Railway, Render, Fly.io). Use PostgreSQL instead of SQLite in production and set `DATABASE_URL` and `JWT_SECRET` on the host.

## Project Structure

```
GreenBridge/
├── src/           # React frontend
├── server/        # Express API
├── prisma/        # Database schema
└── root/          # Production build (GitHub Pages)
```
