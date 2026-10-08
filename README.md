# Restaurant & Food Ordering System

Full-stack restaurant platform: dine-in QR ordering, pickup, delivery, live tracking, KDS, and admin analytics.

## Stack
React (Vite) + Tailwind • Node/Express • PostgreSQL (raw SQL) • Socket.io • JWT

## Setup
```bash
# Server
cd server && npm install
cp .env.example .env    # edit DATABASE_URL + JWT_SECRET
createdb restaurant_db
npm run migrate && npm run seed && npm run dev

# Client (new terminal)
cd client && npm install && npm run dev