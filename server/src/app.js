// const express = require('express');
// const helmet = require('helmet');
// const cors = require('cors');
// const morgan = require('morgan');
// const path = require('path');

// const corsOptions = require('./config/cors');
// const routes = require('./routes');
// const errorHandler = require('./middleware/errorHandler');
// const notFound = require('./middleware/notFound');

// const app = express();

// app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
// app.use(cors(corsOptions));
// app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// app.use('/api', routes);

// app.use(notFound);
// app.use(errorHandler);

// module.exports = app;
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const corsOptions = require('./config/cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors(corsOptions));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ✅ Root route for Render health check & API status
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Restaurant API is running successfully 🚀',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      menu: '/api/menu',
      orders: '/api/orders',
      payments: '/api/payments',
      analytics: '/api/analytics',
    },
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
