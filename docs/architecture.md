# Architecture

## System Diagram

## Layers
- **Routes** → **Controllers** → **Services** → **Models** → **Pool (pg)**
- **Sockets** handle real-time events (`order:new`, `order:updated`)

## Auth Flow
1. Client POSTs to `/auth/login`
2. Server verifies bcrypt hash, returns JWT (7d)
3. Client stores JWT in localStorage
4. Axios attaches `Authorization: Bearer <token>` on all requests
5. Socket.io also sends JWT in `auth` handshake

## Order Lifecycle
`pending → confirmed → preparing → ready → completed`
Cancel allowed from `pending|confirmed|preparing`.