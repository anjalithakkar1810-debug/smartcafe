import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './models/MenuItem.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcafe';

const seedItems = [
  {
    name: 'Garlic Bread sticks',
    description: 'Freshly baked garlic bread sticks with herbs and butter dip.',
    price: 120,
    category: 'Starters',
    imageUrl: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400&q=80',
    isAvailable: true
  },
  {
    name: 'Double Cheese Burger',
    description: 'Juicy vegetable patty with double cheddar cheese, lettuce, tomatoes, and spicy mayo.',
    price: 180,
    category: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    isAvailable: true
  },
  {
    name: 'Paneer Butter Masala & Butter Naan',
    description: 'Rich cottage cheese cubes cooked in creamy tomato butter gravy, served with 1 hot naan.',
    price: 260,
    category: 'Mains',
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80',
    isAvailable: true
  },
  {
    name: 'Vanilla Iced Cold Brew',
    description: 'Slow-steeped cold brew coffee served cold with vanilla syrup and milk over ice.',
    price: 140,
    category: 'Drinks',
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80',
    isAvailable: true
  },
  {
    name: 'Molten Lava Chocolate Cake',
    description: 'Hot chocolate cake with a rich liquid chocolate center, served with whipped cream.',
    price: 150,
    category: 'Desserts',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80',
    isAvailable: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "smartcafe"
    });
    console.log('Connected to MongoDB for seeding...');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items.');

    // Insert new seed items
    await MenuItem.insertMany(seedItems);
    console.log('Successfully seeded 5 tasty dishes into menu database!');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
