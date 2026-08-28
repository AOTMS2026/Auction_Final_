const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usersToCreate = [
  { email: 'bni@gmail.com', pass: 'Bni@2026' },
  { email: 'jsc@gmail.com', pass: 'Jsc@2026' },
  { email: 'hunterz@gmail.com', pass: 'Hunterz@2026' }
];

mongoose.connect('mongodb+srv://aotmsmarketing_db_user:Aotms@cluster0.98dzwez.mongodb.net/auction_new_one').then(async () => {
  const User = require('./src/models/User');
  
  for (const u of usersToCreate) {
    const existing = await User.findOne({ email: u.email.toLowerCase() });
    if (existing) {
      console.log(`User ${u.email} already exists.`);
    } else {
      const passwordHash = await bcrypt.hash(u.pass, 10);
      await User.create({ email: u.email.toLowerCase(), passwordHash });
      console.log(`Created user ${u.email}`);
    }
  }
  
  console.log('Database update complete.');
  process.exit(0);
}).catch(console.error);
