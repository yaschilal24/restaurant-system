const pool = require('../db/pool');
const userModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

async function register({ name, email, phone, password }) {
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length) throw new AppError('Email already registered', 409);
  const passwordHash = await hashPassword(password);
  const { rows } = await userModel.create({ name, email, phone, passwordHash, role: 'customer' });
  const user = rows[0];
  const token = signToken({ id: user.id, role: user.role, email: user.email });
  return { user, token };
}

async function login({ email, password }) {
  const { rows } = await pool.query(
    'SELECT id, name, email, phone, role, password_hash FROM users WHERE email = $1 AND is_active = true', [email]
  );
  if (!rows.length) throw new AppError('Invalid credentials', 401);
  const user = rows[0];
  const valid = await comparePassword(password, user.password_hash);
  if (!valid) throw new AppError('Invalid credentials', 401);
  delete user.password_hash;
  const token = signToken({ id: user.id, role: user.role, email: user.email });
  return { user, token };
}

async function getMe(userId) {
  const { rows } = await userModel.findById(userId);
  if (!rows.length) throw new AppError('User not found', 404);
  return rows[0];
}

module.exports = { register, login, getMe };