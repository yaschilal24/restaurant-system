const { clientUrl } = require('./env');

module.exports = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (origin === clientUrl || process.env.NODE_ENV === 'development') return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};