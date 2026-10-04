import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import Product from '../src/models/Product.js';

const demoProducts = [
  { name: 'Oversized Bonkers Tee', description: 'Heavyweight cotton oversized tee.', price: 899, discountPrice: 699, stock: 40, category: 'men', subCategory: 't-shirts', sizes: ['S','M','L','XL'], colors: [{name:'Black',hex:'#000'},{name:'Off White',hex:'#f4f1ea'}], isFeatured: true, isNewArrival: true, images: [] },
  { name: 'Cargo Wide-Leg Pants', description: 'Utility cargos with tapered ankle.', price: 1899, stock: 25, category: 'men', subCategory: 'bottoms', sizes: ['28','30','32','34'], colors: [{name:'Olive',hex:'#556b2f'}], isBestSeller: true, images: [] },
  { name: 'Cropped Graphic Tee', description: 'Boxy fit crop with front print.', price: 799, stock: 60, category: 'women', subCategory: 't-shirts', sizes: ['XS','S','M','L'], colors: [{name:'Lavender',hex:'#c5b3e6'}], isNewArrival: true, images: [] },
  { name: 'Wide-Leg Denim', description: 'Rigid wide-leg with raw hem.', price: 2299, discountPrice: 1799, stock: 18, category: 'women', subCategory: 'bottoms', sizes: ['26','28','30','32'], colors: [{name:'Indigo',hex:'#3b3b6d'}], isFeatured: true, images: [] },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.ADMIN_EMAIL, password = process.env.ADMIN_PASSWORD;
  await User.deleteOne({ email });
  await User.create({ name: 'Admin', email, password, role: 'admin' });
  console.log(`Admin created: ${email} / ${password}`);
  await Product.deleteMany({});
  await Product.insertMany(demoProducts);
  console.log(`Seeded ${demoProducts.length} products`);
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
