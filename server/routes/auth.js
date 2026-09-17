const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'zbm_ultra_secure_b2b_matrix_secret_2026';
const SALT_ROUNDS = 10;

// Email regex helper
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Token generator helper
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      brand_name: user.brand_name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access denied. No authentication token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired session token.' });
    }
    req.user = decoded;
    next();
  });
}

/**
 * POST /api/auth/signup
 * Collects Name, Brand Name (optional), Email, Password
 * Validates, hashes password with bcrypt, and stores in SQLite
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, brand_name, email, password } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Full name must be at least 2 characters.' });
    }

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ success: false, error: 'Please provide a valid business email address.' });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters long.' });
    }

    // Check existing email
    const existing = await db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email address is already registered.' });
    }

    // Hash password with bcrypt (10 rounds)
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Save to SQLite
    const newUser = await db.createUser({
      name,
      brand_name,
      email,
      password_hash,
      role: 'buyer'
    });

    // Generate JWT
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: {
        id: newUser.id,
        name: newUser.name,
        brand_name: newUser.brand_name,
        email: newUser.email,
        role: newUser.role,
        created_at: newUser.created_at
      },
      token
    });
  } catch (err) {
    if (err.message === 'EMAIL_EXISTS') {
      return res.status(409).json({ success: false, error: 'An account with this email address is already registered.' });
    }
    console.error('[AUTH SIGNUP ERROR]:', err);
    return res.status(500).json({ success: false, error: 'Server error creating account. Please try again.' });
  }
});

/**
 * POST /api/auth/login
 * Validates credentials, checks bcrypt hash against SQLite, returns JWT
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide both email and password.' });
    }

    // Find user by email
    const user = await db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    // Compare with bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    // Update last login
    await db.updateLastLogin(user.id);

    // Generate JWT
    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Login successful.',
      user: {
        id: user.id,
        name: user.name,
        brand_name: user.brand_name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error('[AUTH LOGIN ERROR]:', err);
    return res.status(500).json({ success: false, error: 'Server error processing login.' });
  }
});

/**
 * GET /api/auth/me
 * Protected endpoint returning authenticated user profile
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found.' });
    }
    return res.json({ success: true, user });
  } catch (err) {
    console.error('[AUTH ME ERROR]:', err);
    return res.status(500).json({ success: false, error: 'Server error fetching user profile.' });
  }
});

module.exports = router;
