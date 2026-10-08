const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const AppError = require('../utils/AppError');
const tableModel = require('../models/tableModel');
const { generateQrToken } = require('../utils/trackingToken');

const list = asyncHandler(async (req, res) => success(res, (await tableModel.list()).rows));
const getByToken = asyncHandler(async (req, res) => {
  const { rows } = await tableModel.findByToken(req.params.token);
  if (!rows.length) throw new AppError('Table not found', 404);
  success(res, rows[0]);
});
const create = asyncHandler(async (req, res) => {
  const { table_number, capacity = 4, location } = req.body;
  const { rows } = await tableModel.create({ table_number, qr_token: generateQrToken(), capacity, location });
  success(res, rows[0], 201);
});
const remove = asyncHandler(async (req, res) => { await tableModel.remove(req.params.id); success(res, { deleted: true }); });

module.exports = { list, getByToken, create, remove };