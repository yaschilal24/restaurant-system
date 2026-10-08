# Deployment

## Database (Neon / Supabase / Render)
1. Create PostgreSQL instance
2. Copy connection string into `DATABASE_URL`
3. Run `npm run migrate && npm run seed` from server

## Server (Render / Railway)
- Build: `npm install`
- Start: `npm start`
- Env: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV=production`
- Note: free hosts lose uploaded files on redeploy — use S3/Cloudinary for production uploads

## Client (Vercel / Netlify)
- Build: `npm run build`
- Output: `dist`
- Env: set `VITE_API_URL` if not using proxy