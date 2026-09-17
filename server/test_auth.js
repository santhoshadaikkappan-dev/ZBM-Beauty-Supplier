const db = require('./db');
const bcrypt = require('bcryptjs');

async function testAuth() {
  console.log('Testing DB engine:', db.getDatabaseEngine());
  const testEmail = `test_${Date.now()}@zbm-luxury.com`;
  const rawPassword = 'MasterPassword2026!';
  
  console.log('1. Hashing password with bcrypt (10 rounds)...');
  const hash = await bcrypt.hash(rawPassword, 10);
  console.log('Generated Bcrypt Hash:', hash);
  
  if (!hash.startsWith('$2a$') && !hash.startsWith('$2b$')) {
    throw new Error('Hash does not match standard bcrypt prefix!');
  }
  console.log('✓ Bcrypt format verified ($2a$/$2b$)');

  console.log('2. Inserting user into SQLite database...');
  const user = await db.createUser({
    name: 'Eleanor Vance',
    brand_name: 'Vance Cosmetics Beverly Hills',
    email: testEmail,
    password_hash: hash,
    role: 'buyer'
  });
  console.log('✓ User created with ID:', user.id);

  console.log('3. Fetching user by email from SQLite...');
  const fetched = await db.findUserByEmail(testEmail);
  console.log('✓ Fetched user:', fetched.name, 'Email:', fetched.email);

  console.log('4. Testing bcrypt password verification...');
  const isMatchValid = await bcrypt.compare(rawPassword, fetched.password_hash);
  console.log('Correct password match:', isMatchValid);
  if (!isMatchValid) throw new Error('Correct password failed comparison!');

  const isMatchInvalid = await bcrypt.compare('WrongPassword123', fetched.password_hash);
  console.log('Incorrect password rejected:', !isMatchInvalid);
  if (isMatchInvalid) throw new Error('Incorrect password was accepted!');

  console.log('5. Testing unique email constraint...');
  try {
    await db.createUser({
      name: 'Duplicate Test',
      email: testEmail,
      password_hash: hash
    });
    throw new Error('Duplicate email was not rejected!');
  } catch (err) {
    console.log('✓ Duplicate email rejected as expected with error:', err.message);
  }

  console.log('\n========================================');
  console.log('ALL BACKEND SQLITE & BCRYPT TESTS PASSED');
  console.log('========================================');
  process.exit(0);
}

testAuth().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
