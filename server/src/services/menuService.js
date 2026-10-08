const pool = require('../db/pool');
const menuModel = require('../models/menuModel');
const categoryModel = require('../models/categoryModel');
const AppError = require('../utils/AppError');

async function listCategories() { return (await categoryModel.list()).rows; }

async function listItems(params) { return (await menuModel.list(params)).rows; }

async function getItem(id) {
  const { rows } = await menuModel.findById(id);
  if (!rows.length) throw new AppError('Menu item not found', 404);
  return rows[0];
}

async function createItem(data) { return (await menuModel.create(data)).rows[0]; }

async function updateItem(id, data) {
  const { rows } = await menuModel.update(id, data);
  if (!rows.length) throw new AppError('Menu item not found', 404);
  return rows[0];
}

async function deleteItem(id) {
  await menuModel.remove(id);
}

async function createCategory(data) { return (await categoryModel.create(data)).rows[0]; }

async function updateCategory(id, data) {
  const { rows } = await categoryModel.update(id, data);
  if (!rows.length) throw new AppError('Category not found', 404);
  return rows[0];
}

async function deleteCategory(id) {
  const { rows } = await categoryModel.countItems(id);
  if (rows[0].count > 0) throw new AppError('Cannot delete category with menu items', 400);
  await categoryModel.remove(id);
}

module.exports = { listCategories, listItems, getItem, createItem, updateItem, deleteItem, createCategory, updateCategory, deleteCategory };