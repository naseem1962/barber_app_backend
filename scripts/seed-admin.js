/**
 * Seed script: create or update the default admin user.
 * Run from backend folder: node scripts/seed-admin.js
 *
 * Credentials:
 *   email: admin@admin.com
 *   password: Tester@123
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'Tester@123';
const ADMIN_NAME = 'Admin';
const ADMIN_ROLE = 'super_admin';

async function seedAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const collection = mongoose.connection.collection('admins');

    const result = await collection.updateOne(
      { email: ADMIN_EMAIL },
      {
        $set: {
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          password: hashedPassword,
          role: ADMIN_ROLE,
          isActive: true,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log('Admin user created.');
    } else {
      console.log('Admin user updated (password and role refreshed).');
    }
    console.log('Admin login: email =', ADMIN_EMAIL, ', password =', ADMIN_PASSWORD);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedAdmin();
