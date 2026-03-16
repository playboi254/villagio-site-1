require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./src/models/userDB');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const existing = await User.findOne({ email: 'admin@villagio.com' });
  if (existing) {
    console.log('⚠️  Admin already exists:', existing.email, '| userType:', existing.userType);
    return process.exit();
  }

  await new User({
    name: 'Admin',
    email: 'admin@villagio.com',
    password: await bcrypt.hash('Admin@1234', 10),
    userType: 'admin',
  }).save();

  console.log('✅ Admin created successfully');
  console.log('📧 Email:    admin@villagio.com');
  console.log('🔑 Password: Admin@1234');
  process.exit();
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
