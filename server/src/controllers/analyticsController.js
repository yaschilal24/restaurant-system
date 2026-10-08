const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const analyticsService = require('../services/analyticsService');

const getDashboard = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDashboard(req.query.period || 'today');
  success(res, data);
});

module.exports = { getDashboard };