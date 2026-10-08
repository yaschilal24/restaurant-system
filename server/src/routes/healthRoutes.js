const express = require('express');
const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');
const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT NOW() AS time');
  res.json({ success: true, status: 'ok', db: 'connected', time: rows[0].time, env: process.env.NODE_ENV });
}));

module.exports = router;