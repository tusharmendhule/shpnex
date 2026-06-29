import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.js';
import { isDbConnected } from '../config/db.js';
import { UserModel } from '../models/schemas.js';
import { localDb } from '../config/db.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: 'customer' | 'seller' | 'admin' | 'user';
    name: string;
    email: string;
  };
}

export async function protect(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token = '';

  // Check headers for authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
    return;
  }

  try {
    if (isDbConnected()) {
      const user = await UserModel.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401).json({ success: false, message: 'User not found' });
        return;
      }
      req.user = {
        id: user._id.toString(),
        role: user.role,
        name: user.name,
        email: user.email,
      };
    } else {
      // Local db mode
      const user = localDb.users.find((u) => u.id === decoded.id);
      if (!user) {
        res.status(401).json({ success: false, message: 'User not found' });
        return;
      }
      req.user = {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
      };
    }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
}

export function admin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an admin' });
  }
}

export function seller(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user && req.user.role === 'seller') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as a seller' });
  }
}

export function adminOrSeller(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'seller')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an admin or seller' });
  }
}
