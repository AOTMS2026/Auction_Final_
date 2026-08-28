const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  let count = 0;
  
  const auctions = await db.collection('auctions').find().toArray();
  for (let a of auctions) {
    if (typeof a.createdBy === 'string') {
      await db.collection('auctions').updateOne({ _id: a._id }, { $set: { createdBy: new ObjectId(a.createdBy) } });
      count++;
    }
  }
  console.log(`Fixed ${count} auctions.`);
  
  count = 0;
  const teams = await db.collection('teams').find().toArray();
  for (let t of teams) {
    if (typeof t.auctionId === 'string') {
      await db.collection('teams').updateOne({ _id: t._id }, { $set: { auctionId: new ObjectId(t.auctionId) } });
      count++;
    }
  }
  console.log(`Fixed ${count} teams.`);
  
  count = 0;
  const players = await db.collection('players').find().toArray();
  for (let p of players) {
    const updates = {};
    if (typeof p.auctionId === 'string') updates.auctionId = new ObjectId(p.auctionId);
    if (typeof p.teamId === 'string') updates.teamId = new ObjectId(p.teamId);
    
    if (Object.keys(updates).length > 0) {
      await db.collection('players').updateOne({ _id: p._id }, { $set: updates });
      count++;
    }
  }
  console.log(`Fixed ${count} players.`);
  
  process.exit(0);
}).catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
