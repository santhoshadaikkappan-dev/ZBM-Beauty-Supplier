const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'users.db');

let sqlite3;
let db = null;
let useFallback = false;

try {
  sqlite3 = require('sqlite3').verbose();
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.warn('[DB] SQLite connection failed, using embedded persistence:', err.message);
      useFallback = true;
    } else {
      console.log('[DB] Connected to SQLite database at:', dbPath);
      initSqliteTables();
    }
  });
} catch (e) {
  console.warn('[DB] sqlite3 module not loaded, using embedded persistence:', e.message);
  useFallback = true;
}

function initSqliteTables() {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand_name TEXT,
      email TEXT UNIQUE NOT NULL COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'buyer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    );
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  `;
  db.exec(schema, (err) => {
    if (err) {
      console.error('[DB] Error initializing tables:', err.message);
    } else {
      console.log('[DB] SQLite "users" schema verified.');
    }
  });
}

// Fallback JSON-backed SQLite store in case native addon is unavailable
const fallbackPath = path.join(dataDir, 'users.json');
function loadFallback() {
  if (!fs.existsSync(fallbackPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
  } catch {
    return [];
  }
}
function saveFallback(users) {
  fs.writeFileSync(fallbackPath, JSON.stringify(users, null, 2), 'utf8');
}

// Public Database Methods
function createUser({ name, brand_name, email, password_hash, role = 'buyer' }) {
  return new Promise((resolve, reject) => {
    const normalizedEmail = email.trim().toLowerCase();
    
    if (!useFallback && db) {
      const stmt = db.prepare(
        'INSERT INTO users (name, brand_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)'
      );
      stmt.run([name.trim(), brand_name ? brand_name.trim() : null, normalizedEmail, password_hash, role], function(err) {
        if (err) {
          if (err.message && (err.message.includes('UNIQUE constraint failed') || err.message.includes('SQLITE_CONSTRAINT'))) {
            return reject(new Error('EMAIL_EXISTS'));
          }
          return reject(err);
        }
        resolve({
          id: this.lastID,
          name: name.trim(),
          brand_name: brand_name ? brand_name.trim() : null,
          email: normalizedEmail,
          role,
          created_at: new Date().toISOString()
        });
      });
      stmt.finalize();
    } else {
      // Fallback
      const users = loadFallback();
      if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
        return reject(new Error('EMAIL_EXISTS'));
      }
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name: name.trim(),
        brand_name: brand_name ? brand_name.trim() : null,
        email: normalizedEmail,
        password_hash,
        role,
        created_at: new Date().toISOString(),
        last_login: null
      };
      users.push(newUser);
      saveFallback(users);
      resolve(newUser);
    }
  });
}

function findUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!useFallback && db) {
      db.get('SELECT * FROM users WHERE email = ?', [normalizedEmail], (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    } else {
      const users = loadFallback();
      const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
      resolve(user || null);
    }
  });
}

function findUserById(id) {
  return new Promise((resolve, reject) => {
    const numId = parseInt(id, 10);
    if (!useFallback && db) {
      db.get('SELECT id, name, brand_name, email, role, created_at, last_login FROM users WHERE id = ?', [numId], (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    } else {
      const users = loadFallback();
      const user = users.find(u => u.id === numId);
      if (!user) return resolve(null);
      const { password_hash, ...sanitized } = user;
      resolve(sanitized);
    }
  });
}

function updateLastLogin(id) {
  return new Promise((resolve) => {
    const numId = parseInt(id, 10);
    const now = new Date().toISOString();
    if (!useFallback && db) {
      db.run('UPDATE users SET last_login = ? WHERE id = ?', [now, numId], () => resolve(true));
    } else {
      const users = loadFallback();
      const user = users.find(u => u.id === numId);
      if (user) {
        user.last_login = now;
        saveFallback(users);
      }
      resolve(true);
    }
  });
}

function getDatabaseEngine() {
  return useFallback ? 'Embedded JSON/SQLite' : 'SQLite 3';
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateLastLogin,
  getDatabaseEngine
};
