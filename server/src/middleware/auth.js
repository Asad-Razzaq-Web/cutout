import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function readToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

/** Returns { state: 'none' | 'invalid' | 'disabled' | 'ok', user? } */
async function resolve(req) {
  const token = readToken(req);
  if (!token) return { state: 'none' };
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return { state: 'invalid' };
  }
  const user = await User.findById(payload.sub).select('role disabled').lean();
  if (!user) return { state: 'invalid' };
  if (user.disabled) return { state: 'disabled' };
  return { state: 'ok', user: { id: String(user._id), role: user.role } };
}

/** Attaches req.user if a valid token is present; never blocks the request. */
export async function optionalAuth(req, _res, next) {
  try {
    const { state, user } = await resolve(req);
    if (state === 'ok') req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/** Blocks the request unless a valid token is present. */
export async function requireAuth(req, res, next) {
  try {
    const { state, user } = await resolve(req);
    if (state === 'none') return res.status(401).json({ message: 'Please log in to continue.' });
    if (state === 'invalid') return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    if (state === 'disabled') return res.status(403).json({ message: 'This account has been disabled.' });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/** Use after requireAuth. */
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
  next();
}