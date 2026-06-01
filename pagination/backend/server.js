const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const seedDatabase = require('./seed/seedData');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb://127.0.0.1:27017/redux_cache_db';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await seedDatabase();
  })
  .catch(err => console.error('Could not connect to MongoDB:', err));

app.use('/products', productRoutes);

app.listen(3000, () => {
  console.log('Server started...');
});