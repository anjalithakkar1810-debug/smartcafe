import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Starters', 'Mains', 'Drinks', 'Desserts', 'Snacks'] 
  },
  imageUrl: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true }
});

export default mongoose.model('MenuItem', menuItemSchema);
