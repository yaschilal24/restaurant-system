const pool = require('../db/pool');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const AppError = require('../utils/AppError');
const userModel = require('../models/userModel');
const { hashPassword } = require('../utils/password');

const list = asyncHandler(async (req, res) => success(res, (await userModel.list(req.query)).rows));

const createStaff = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role = 'staff' } = req.body;
  if (!['staff', 'admin'].includes(role)) throw new AppError('Invalid role', 400);
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length) throw new AppError('Email already registered', 409);
  const passwordHash = await hashPassword(password);
  const { rows } = await userModel.create({ name, email, phone, passwordHash, role });
  success(res, rows[0], 201);
});

const updateRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['customer', 'staff', 'admin'].includes(role)) throw new AppError('Invalid role', 400);
  const { rows } = await userModel.updateRole(req.params.id, role);
  if (!rows.length) throw new AppError('User not found', 404);
  success(res, rows[0]);
});

module.exports = { list, createStaff, updateRole };