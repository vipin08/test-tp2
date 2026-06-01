const mongoose = require('mongoose');
const Product = require('../models/Product');

const seedProducts = [
  { title: "iPhone 15", price: 999, category: "electronics" },
  { title: "MacBook Pro", price: 1999, category: "electronics" },
  { title: "Sony Headphones", price: 350, category: "electronics" },
  { title: "iPad Air", price: 599, category: "electronics" },
  { title: "Smart Watch", price: 249, category: "electronics" },
  { title: "Gaming Monitor", price: 449, category: "electronics" },
  { title: "Mechanical Keyboard", price: 129, category: "electronics" },
 
  { title: "Leather Jacket", price: 150, category: "fashion" },
  { title: "Running Shoes", price: 120, category: "fashion" },
  { title: "Denim Jeans", price: 60, category: "fashion" },
  { title: "Sunglasses", price: 85, category: "fashion" },
  { title: "Cotton T-Shirt", price: 25, category: "fashion" },
  { title: "Winter Coat", price: 200, category: "fashion" },
  { title: "Backpack", price: 45, category: "fashion" },

  { title: "Organic Milk", price: 4, category: "grocery" },
  { title: "Whole Wheat Bread", price: 3, category: "grocery" },
  { title: "Fresh Eggs (12pk)", price: 5, category: "grocery" },
  { title: "Coffee Beans 1kg", price: 18, category: "grocery" },
  { title: "Olive Oil 1L", price: 14, category: "grocery" },
  { title: "Greek Yogurt", price: 6, category: "grocery" }
];

const seedDatabase = async () => {
  try {
    await Product.deleteMany({});
    await Product.insertMany(seedProducts);
    console.log("Database seeded successfully with 20 items!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

module.exports = seedDatabase;