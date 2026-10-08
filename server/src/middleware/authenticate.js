// const { verifyToken } = require('../utils/jwt');
// const AppError = require('../utils/AppError');

// function authenticate(req, res, next) {
//   const header = req.headers.authorization;
//   if (!header || !header.startsWith('Bearer ')) return next(new AppError('Authentication required', 401));
//   try {
//     const decoded = verifyToken(header.split(' ')[1]);
//     req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
//     next();
//   } catch { next(new AppError('Invalid or expired token', 401)); }
// }

// function optionalAuth(req, res, next) {
//   const header = req.headers.authorization;
//   if (!header || !header.startsWith('Bearer ')) { req.user = null; return next(); }
//   try {
//     const decoded = verifyToken(header.split(' ')[1]);
//     req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
//   } catch { req.user = null; }
//   next();
// }

// module.exports = { authenticate, optionalAuth };

const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 401));
  }
  try {
    const decoded = verifyToken(header.split(' ')[1]);
    req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401));
  }
}

// ✅ Guest-friendly — never fails
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  try {
    const decoded = verifyToken(header.split(' ')[1]);
    req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
  } catch {
    req.user = null;
  }
  next();
}

module.exports = { authenticate, optionalAuth };