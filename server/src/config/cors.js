// const { clientUrl } = require('./env');

// module.exports = {
//   origin: (origin, cb) => {
//     if (!origin) return cb(null, true);
//     if (origin === clientUrl || process.env.NODE_ENV === 'development') return cb(null, true);
//     cb(new Error('Not allowed by CORS'));
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

const { clientUrl } = require('./env');

module.exports = {
  origin: (origin, cb) => {
    // 1. Allow requests with no origin (like Postman or server-to-server)
    if (!origin) return cb(null, true);

    // 2. Allow local development
    if (process.env.NODE_ENV === 'development') return cb(null, true);

    // 3. Allow your exact production URL
    if (origin === clientUrl) return cb(null, true);

    // 4. Allow any Vercel deployment (including preview URLs)
    if (origin.endsWith('.vercel.app')) return cb(null, true);

    // Block everything else
    console.error(`CORS blocked for origin: ${origin}`);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};