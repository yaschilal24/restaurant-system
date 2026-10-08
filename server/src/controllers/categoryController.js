const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const menuService = require('../services/menuService');

const create = asyncHandler(async (req, res) => success(res, await menuService.createCategory(req.body), 201));
const update = asyncHandler(async (req, res) => success(res, await menuService.updateCategory(req.params.id, req.body)));
const remove = asyncHandler(async (req, res) => { await menuService.deleteCategory(req.params.id); success(res, { deleted: true }); });

module.exports = { create, update, remove };