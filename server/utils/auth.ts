import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'shpnex_secret_key_123456';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export function generateToken(id: string, role: string): string {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE as any,
  });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
