const bcrypt = require('bcrypt');
const crypto = require('crypto');
const pool = require('./pool');

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Seeding users...');
    const hash = await bcrypt.hash('password123', 10);
    await client.query(`
      INSERT INTO users (name, email, phone, password_hash, role) VALUES
        ('Admin User', 'admin@restaurant.com', '+251911000001', $1, 'admin'),
        ('Staff Member', 'staff@restaurant.com', '+251911000002', $1, 'staff'),
        ('John Customer', 'john@example.com', '+251911000003', $1, 'customer')
      ON CONFLICT (email) DO NOTHING
    `, [hash]);

    console.log('Seeding categories...');
    const cats = [
      ['Signatures', 'Chef\'s finest creations', 1],
      ['Mains', 'Hearty main courses', 2],
      ['Burgers', 'Gourmet burgers', 3],
      ['Drinks', 'Beverages and cocktails', 4],
      ['Desserts', 'Sweet endings', 5],
    ];
    for (const [n, d, o] of cats) {
      await client.query(`INSERT INTO categories (name, description, sort_order) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING`, [n, d, o]);
    }

    console.log('Seeding menu items...');
    const { rows: catRows } = await client.query('SELECT id, name FROM categories');
    const catMap = Object.fromEntries(catRows.map((c) => [c.name, c.id]));

    const items = [
      ['Signatures', 'Wagyu Truffle Ribeye', '28-day dry aged wagyu, black truffle butter, charred asparagus, smoked sea salt.', 64.50, true, true, ['signature', 'top_seller']],
      ['Signatures', 'Miso Glazed Salmon', 'Hokkaido salmon, sweet miso glaze, charred greens.', 28.00, true, false, ['signature']],
      ['Signatures', 'Charred Spanish Octopus', 'Romesco sauce, fingerling potatoes, crispy chorizo, smoked paprika oil.', 34.00, true, false, ['signature']],
      ['Signatures', 'Wagyu A5 Tartare', 'Smoked quail egg, black truffle shavings, yuzu kosho.', 42.00, true, true, ['signature', 'top_seller']],
      ['Signatures', 'Hokkaido Scallops', 'Pan-seared, brown butter, cauliflower purée, caviar.', 34.00, true, false, ['signature']],
      ['Signatures', 'Roasted Bone Marrow', 'Parsley salad, caramelized onion jam, sourdough toast.', 28.00, true, false, ['signature']],
      ['Signatures', 'Charred Maitake', 'Miso glaze, edamame purée, crispy shallots, togarashi, micro cilantro.', 24.00, true, false, ['signature', 'vegan']],
      ['Mains', 'Spicy Rigatoni', 'Calabrian chili, vodka sauce, pecorino romano.', 26.00, true, true, ['main', 'spicy']],
      ['Mains', 'Crispy Calamari', 'Lemon aioli, charred lemon, fresh herbs.', 18.00, true, false, ['main']],
      ['Mains', 'Spicy Tuna Crispy Rice', 'Yellowfin tuna, sriracha, jalapeño, crispy sushi rice.', 22.00, true, false, ['main', 'spicy']],
      ['Mains', 'Miso Glazed Black Cod', 'Marinated 72 hours, pickled ginger, bok choy.', 38.00, true, false, ['main']],
      ['Burgers', 'Smoked Brisket Burger', '12-hour smoked brisket, pickled onions, house sauce, brioche bun.', 22.00, true, false, ['burger', 'top_seller']],
      ['Burgers', 'A5 Wagyu Sliders', 'Three mini wagyu burgers, truffle aioli, aged cheddar.', 32.00, true, false, ['burger']],
      ['Burgers', 'Truffle Burger', 'Wagyu beef, truffle cheese, caramelized onions, arugula.', 28.00, true, true, ['burger']],
      ['Drinks', 'Smoked Old Fashioned', 'Japanese whisky, maple demerara, angostura, hickory smoke, Luxardo cherry.', 22.00, true, false, ['drink']],
      ['Drinks', 'Yuzu Lemonade', 'Fresh yuzu, sparkling water, mint, honey.', 9.00, true, false, ['drink']],
      ['Drinks', 'Yuzu Margarita', 'Tequila blanco, yuzu, agave, tajín rim.', 16.00, true, false, ['drink']],
      ['Drinks', 'Charred Edamame', 'Sea salt, chili flakes, yuzu zest.', 8.00, true, false, ['drink', 'vegan']],
      ['Desserts', 'Matcha Lava Cake', 'Warm matcha center, black sesame ice cream, kinako.', 16.00, true, true, ['dessert']],
      ['Desserts', 'Miso Caramel Cheesecake', 'White miso caramel, toasted sesame, berries.', 14.00, true, false, ['dessert']],
    ];
    for (const [cat, n, d, p, av, fe, tags] of items) {
      await client.query(
        `INSERT INTO menu_items (category_id, name, description, price, is_available, is_featured, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [catMap[cat], n, d, p, av, fe, tags]
      );
    }

    console.log('Seeding tables...');
    for (let i = 1; i <= 10; i++) {
      const token = crypto.randomBytes(16).toString('hex');
      const num = `T${String(i).padStart(2, '0')}`;
      await client.query(
        `INSERT INTO restaurant_tables (table_number, qr_token, capacity, location)
         VALUES ($1, $2, $3, $4) ON CONFLICT (table_number) DO NOTHING`,
        [num, token, i <= 6 ? 4 : 6, i <= 5 ? 'Main Hall' : 'Terrace']
      );
    }

    await client.query('COMMIT');
    console.log('\n✨ Seed complete.\n');
  } catch (e) {
    await client.query('ROLLBACK'); throw e;
  } finally { client.release(); await pool.end(); }
}

seed().catch((e) => { console.error('❌', e.message); process.exit(1); });