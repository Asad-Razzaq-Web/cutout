import jwt from 'jsonwebtoken';

export const signToken = (userId) =>
  jwt.sign({}, process.env.JWT_SECRET, {
    subject: String(userId),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
