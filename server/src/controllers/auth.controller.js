import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../utils/token.js';

const publicUser = (u) => ({ id: u._id, email: u.email, name: u.name, role: u.role });
const bad = (res, status, message) => res.status(status).json({ message });

const isAdminEmail = (email) =>
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());

export async function signup(req, res, next) {
  try {
    const { email = '', password = '', name = '' } = req.body;
    if (!/^\S+@\S+\.\S+$/.test(email)) return bad(res, 400, 'Enter a valid email address.');
    if (password.length < 8) return bad(res, 400, 'Password must be at least 8 characters.');
    if (await User.exists({ email: email.toLowerCase() }))
      return bad(res, 409, 'An account with this email already exists.');

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      name,
      passwordHash,
      role: isAdminEmail(email) ? 'admin' : 'user',
      lastLoginAt: new Date(),
    });
    res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email = '', password = '' } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) return bad(res, 401, 'Incorrect email or password.');
    if (user.disabled) return bad(res, 403, 'This account has been disabled.');

    if (isAdminEmail(user.email)) user.role = 'admin';
    user.lastLoginAt = new Date();
    await user.save();
    res.json({ token: signToken(user._id), user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return bad(res, 401, 'Account not found.');
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}