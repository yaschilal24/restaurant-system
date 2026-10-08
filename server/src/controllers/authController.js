const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const authService = require('../services/authService');

const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  success(res, await authService.register({ name, email, phone, password }), 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  success(res, await authService.login({ email, password }));
});

const me = asyncHandler(async (req, res) => {
  success(res, await authService.getMe(req.user.id));
});

module.exports = { register, login, me };