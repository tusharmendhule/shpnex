import { Response, Request } from 'express';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { isDbConnected, localDb } from '../config/db.js';
import { UserModel } from '../models/schemas.js';
import { generateToken } from '../utils/auth.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

function getRoleByEmail(email: string, requestedRole?: string): 'customer' | 'seller' | 'admin' | 'user' {
  const normalizedEmail = email.toLowerCase();
  
  // 1. Bootstrapped Admins
  if (
    normalizedEmail === 'tusharmendhule1@gmail.com' ||
    normalizedEmail === 'admin@shpnex.com' ||
    normalizedEmail.startsWith('admin@') ||
    normalizedEmail.includes('admin')
  ) {
    return 'admin';
  }
  
  // 2. Sellers
  if (
    normalizedEmail === 'seller@shpnex.com' ||
    normalizedEmail.startsWith('seller@') ||
    normalizedEmail.includes('seller')
  ) {
    return 'seller';
  }
  
  // 3. Fallback to requested role if provided and valid
  if (requestedRole === 'seller' || requestedRole === 'admin' || requestedRole === 'customer' || requestedRole === 'user') {
    if (requestedRole === 'admin') {
      return 'customer'; // Prevent arbitrary self-elevation to admin unless email matches admin criteria above
    }
    return requestedRole as any;
  }
  
  return 'customer';
}

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export async function register(req: AuthenticatedRequest, res: Response) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ success: false, message: 'Please provide all details' });
    return;
  }

  const targetRole = getRoleByEmail(email, role);

  try {
    if (isDbConnected()) {
      const userExists = await UserModel.findOne({ email });
      if (userExists) {
        res.status(400).json({ success: false, message: 'User already exists' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role: targetRole,
        addresses: [],
      });

      const token = generateToken(user._id.toString(), user.role);
      res.status(201).json({
        success: true,
        token,
        user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
      });
    } else {
      // In-memory Mock mode
      const userExists = localDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        res.status(400).json({ success: false, message: 'User already exists' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        id: 'u_' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        password: hashedPassword,
        role: targetRole,
        addresses: [],
        createdAt: new Date().toISOString()
      };

      localDb.users.push(newUser);

      const token = generateToken(newUser.id, newUser.role);
      res.status(201).json({
        success: true,
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export async function login(req: AuthenticatedRequest, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Please provide email and password' });
    return;
  }

  try {
    if (isDbConnected()) {
      const user = await UserModel.findOne({ email });
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      // Sync role based on email if needed
      const correctRole = getRoleByEmail(email, user.role);
      if (user.role !== correctRole) {
        user.role = correctRole;
        await user.save();
      }

      const token = generateToken(user._id.toString(), user.role);
      res.json({
        success: true,
        token,
        user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role, addresses: user.addresses }
      });
    } else {
      // Mock db
      const user = localDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      // Sync role based on email if needed
      const correctRole = getRoleByEmail(email, user.role);
      if (user.role !== correctRole) {
        user.role = correctRole;
      }

      const token = generateToken(user.id, user.role);
      res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, addresses: user.addresses }
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export async function getProfile(req: AuthenticatedRequest, res: Response) {
  try {
    if (isDbConnected()) {
      const user = await UserModel.findById(req.user?.id).select('-password');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.json({ success: true, user });
    } else {
      const user = localDb.users.find((u) => u.id === req.user?.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      const { password, ...userProfile } = user;
      res.json({ success: true, user: userProfile });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  const { name, email, password } = req.body;

  try {
    if (isDbConnected()) {
      const user = await UserModel.findById(req.user?.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      await user.save();
      res.json({ success: true, user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } });
    } else {
      const userIndex = localDb.users.findIndex((u) => u.id === req.user?.id);
      if (userIndex === -1) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      if (name) localDb.users[userIndex].name = name;
      if (email) localDb.users[userIndex].email = email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        localDb.users[userIndex].password = await bcrypt.hash(password, salt);
      }

      const { password: p, ...updatedUser } = localDb.users[userIndex];
      res.json({ success: true, user: updatedUser });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
}

// @desc    Get user addresses
// @route   GET /api/auth/addresses
// @access  Private
export async function getAddresses(req: AuthenticatedRequest, res: Response) {
  try {
    if (isDbConnected()) {
      const user = await UserModel.findById(req.user?.id);
      res.json({ success: true, addresses: user?.addresses || [] });
    } else {
      const user = localDb.users.find((u) => u.id === req.user?.id);
      res.json({ success: true, addresses: user?.addresses || [] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Add address
// @route   POST /api/auth/addresses
// @access  Private
export async function addAddress(req: AuthenticatedRequest, res: Response) {
  const { street, city, state, zipCode, country, isDefault } = req.body;

  if (!street || !city || !state || !zipCode || !country) {
    res.status(400).json({ success: false, message: 'Please provide all fields' });
    return;
  }

  try {
    const newAddress = {
      id: 'addr_' + Math.random().toString(36).substr(2, 9),
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: !!isDefault
    };

    if (isDbConnected()) {
      const user = await UserModel.findById(req.user?.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      if (isDefault) {
        user.addresses.forEach((addr: any) => addr.isDefault = false);
      }
      user.addresses.push(newAddress);
      await user.save();
      res.json({ success: true, addresses: user.addresses });
    } else {
      const user = localDb.users.find((u) => u.id === req.user?.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      if (!user.addresses) user.addresses = [];
      if (isDefault) {
        user.addresses.forEach((addr: any) => addr.isDefault = false);
      }
      user.addresses.push(newAddress);
      res.json({ success: true, addresses: user.addresses });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Delete address
// @route   DELETE /api/auth/addresses/:id
// @access  Private
export async function deleteAddress(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      const user = await UserModel.findById(req.user?.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      user.addresses = user.addresses.filter((addr: any) => addr.id !== id && addr._id?.toString() !== id);
      await user.save();
      res.json({ success: true, addresses: user.addresses });
    } else {
      const user = localDb.users.find((u) => u.id === req.user?.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      user.addresses = (user.addresses || []).filter((addr: any) => addr.id !== id);
      res.json({ success: true, addresses: user.addresses });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Firebase Auth Login / Registration
// @route   POST /api/auth/firebase-login
// @access  Public
export async function firebaseLogin(req: Request, res: Response) {
  const { idToken, role } = req.body;

  if (!idToken) {
    res.status(400).json({ success: false, message: 'ID Token is required' });
    return;
  }

  try {
    // Read API key from config
    // let firebaseApiKey = '';
    // const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    // if (fs.existsSync(configPath)) {
    //   const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    //   firebaseApiKey = config.apiKey;
    // }
    const firebaseApiKey = process.env.FIREBASE_API_KEY || '';

    if (!firebaseApiKey) {
      res.status(500).json({
      success: false,
      message: 'Firebase API Key not configured'
     });
     return;
    }

    if (!firebaseApiKey) {
      res.status(500).json({ success: false, message: 'Firebase API Key not configured on server' });
      return;
    }

    // Verify token with Firebase REST API
    const verifyRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const verifyData = await verifyRes.json();
    if (!verifyData || !verifyData.users || verifyData.users.length === 0) {
      res.status(401).json({ success: false, message: 'Invalid Firebase ID Token' });
      return;
    }

    const firebaseUser = verifyData.users[0];
    const email = firebaseUser.email;
    const name = firebaseUser.displayName || email.split('@')[0];
    const uid = firebaseUser.localId; // Firebase unique ID

    const targetRole = getRoleByEmail(email, role);

    if (isDbConnected()) {
      let user = await UserModel.findOne({ email });

      if (!user) {
        // If user doesn't exist, create them
        user = await UserModel.create({
          name,
          email,
          password: 'firebase_auth_managed_' + Math.random().toString(36).substr(2, 9), // Managed by firebase
          role: targetRole,
          addresses: [],
        });
      } else {
        // Ensure email-based roles are applied even on existing user login
        const correctRole = getRoleByEmail(email, user.role);
        if (user.role !== correctRole) {
          user.role = correctRole;
          await user.save();
        }
      }

      const token = generateToken(user._id.toString(), user.role);
      res.json({
        success: true,
        token,
        user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
      });
    } else {
      // Local db mode
      let user = localDb.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        user = {
          id: 'firebase_' + uid,
          name,
          email,
          password: 'firebase_auth_managed_' + Math.random().toString(36).substr(2, 9),
          role: targetRole,
          addresses: [],
          createdAt: new Date().toISOString()
        };
        localDb.users.push(user);
      } else {
        // Ensure email-based roles are applied even on existing user login
        const correctRole = getRoleByEmail(email, user.role);
        if (user.role !== correctRole) {
          user.role = correctRole;
        }
      }

      const token = generateToken(user.id, user.role);
      res.json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during Firebase Login' });
  }
}

