CREATE TABLE IF NOT EXISTS restaurant_tables (
  id SERIAL PRIMARY KEY,
  table_number VARCHAR(10) NOT NULL UNIQUE,
  qr_token VARCHAR(100) UNIQUE NOT NULL,
  capacity INTEGER DEFAULT 4 CHECK (capacity > 0),
  location VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);