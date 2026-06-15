# GreenBridge

A farm-to-table marketplace connecting local farmers with consumers. Farmers can list products, manage orders, and consumers can browse, cart, and checkout.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Query
- **Backend:** Express, Prisma, SQLite, JWT authentication

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```sh
npm install
npm run db:push
```

### Development

Run both frontend and backend:

```sh
npm run dev:all
```

Or separately:

```sh
npm run dev:server   # API on http://localhost:3001
npm run dev          # Frontend on http://localhost:8080
```

### Build

```sh
npm run build
```

## Usage

1. **Register** as a farmer or consumer at `/account`
2. **Farmers** can add products from their dashboard and manage incoming orders
3. **Consumers** can browse products, add to cart, and place orders
4. Farmers update order status (accepted → processing → shipped → delivered)

## API

The backend runs at `http://localhost:3001/api` with endpoints for auth, products, farmers, orders, cart, reviews, and contact.

## Deploy

Frontend builds to `root/` for GitHub Pages. The backend requires a separate host with a database (replace SQLite with PostgreSQL for production).
