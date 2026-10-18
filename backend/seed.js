const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/gadgethub");

const Product = mongoose.model("Product", new mongoose.Schema({
  name: String, price: Number, image: String, category: String
}));

const premiumProducts = [
  { name: "iPhone 15 Pro Max", price: 159999, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop", category: "Smartphones" },
  { name: "Samsung Galaxy S24 Ultra", price: 129999, image: "https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=1200&auto=format&fit=crop", category: "Smartphones" },
  { name: "Sony WH-1000XM5", price: 29999, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1200&auto=format&fit=crop", category: "Audio" },
  { name: "AirPods Pro (2nd Gen)", price: 24999, image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1200&auto=format&fit=crop", category: "Audio" },
  { name: "Apple Watch Ultra 2", price: 89999, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop", category: "Wearables" },
  { name: "MacBook Pro M3 Max", price: 319999, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop", category: "Laptops" },
  { name: "PlayStation 5 Console", price: 54999, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1200&auto=format&fit=crop", category: "Gaming" },
  { name: "Meta Quest 3", price: 49999, image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1200&auto=format&fit=crop", category: "Gaming" }
];

const seedDB = async () => {
  await Product.deleteMany({});
  await Product.insertMany(premiumProducts);
  console.log("Premium Database Seeded! 💎");
  mongoose.connection.close();
};

seedDB();