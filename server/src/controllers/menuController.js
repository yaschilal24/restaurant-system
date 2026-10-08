const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const menuService = require('../services/menuService');

const getCategories = asyncHandler(async (req, res) => success(res, await menuService.listCategories()));
const getMenuItems = asyncHandler(async (req, res) => success(res, await menuService.listItems(req.query)));
const getMenuItemById = asyncHandler(async (req, res) => success(res, await menuService.getItem(req.params.id)));
const createMenuItem = asyncHandler(async (req, res) => success(res, await menuService.createItem(req.body), 201));
const updateMenuItem = asyncHandler(async (req, res) => success(res, await menuService.updateItem(req.params.id, req.body)));
const deleteMenuItem = asyncHandler(async (req, res) => { await menuService.deleteItem(req.params.id); success(res, { deleted: true }); });
const toggleAvailability = asyncHandler(async (req, res) => {
  const item = await menuService.updateItem(req.params.id, { ...req.body, is_available: req.body.is_available });
  success(res, item);
});

module.exports = { getCategories, getMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability };