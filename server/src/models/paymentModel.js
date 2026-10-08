// const pool = require('../db/pool');
// module.exports = {
//   create: (data) => pool.query(
//     'INSERT INTO payments (order_id, provider, reference, amount, status, raw_response) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
//     [data.order_id, data.provider, data.reference, data.amount, data.status || 'pending', data.raw_response || null]
//   ),
//   findByReference: (ref) => pool.query('SELECT * FROM payments WHERE reference = $1', [ref]),
//   updateStatus: (id, status, raw_response) => pool.query(
//     'UPDATE payments SET status = $1, raw_response = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
//     [status, raw_response, id]
//   ),
//   list: () => pool.query(
//     `SELECT p.*, o.order_number FROM payments p
//      LEFT JOIN orders o ON p.order_id = o.id ORDER BY p.created_at DESC LIMIT 100`
//   ),
// };

const pool = require('../db/pool');

module.exports = {

  create: (data) =>
    pool.query(
      `
      INSERT INTO payments
      (
        order_id,
        provider,
        reference,
        amount,
        status,
        raw_response
      )
      VALUES
      ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        data.order_id,
        data.provider,
        data.reference,
        data.amount,
        data.status || 'pending',
        data.raw_response
          ? JSON.stringify(data.raw_response)
          : null,
      ]
    ),


  findByReference: (ref) =>
    pool.query(
      `
      SELECT *
      FROM payments
      WHERE reference = $1
      `,
      [ref]
    ),


  updateStatus: (
    id,
    status,
    raw_response
  ) =>
    pool.query(
      `
      UPDATE payments
      SET
        status = $1,
        raw_response = $2,
        updated_at = NOW()
      WHERE id = $3
      RETURNING *
      `,
      [
        status,

        raw_response
          ? JSON.stringify(raw_response)
          : null,

        id,
      ]
    ),


  list: () =>
    pool.query(
      `
      SELECT
        p.*,
        o.order_number
      FROM payments p
      LEFT JOIN orders o
        ON p.order_id = o.id
      ORDER BY p.created_at DESC
      LIMIT 100
      `
    ),
};